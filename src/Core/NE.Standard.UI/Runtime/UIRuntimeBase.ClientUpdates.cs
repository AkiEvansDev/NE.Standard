using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private const string DefaultFormatMessage = "The value does not match the expected format.";

    /// <summary>
    /// Addresses currently showing a refusal, so a later valid value sends exactly one "clear". Guarded by <c>_stateLock</c>.
    /// </summary>
    private readonly HashSet<UIPropertyAddress> _rejectedValueAddresses = [];

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetFromUIAsync(ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(changeSet);
        changeSet.Validate();

        try
        {
            ServerChangeSet changes;
            List<PendingSourceWrite>? sourceWrites = null;
            List<UIComponentId>? staleWindows;

            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                List<ServerUIUpdate>? validationUpdates = null;

                for (var i = 0; i < changeSet.Updates.Length; i++)
                {
                    if (TryHoldSourceWriteNoLock(changeSet.Updates[i], out PendingSourceWrite? sourceWrite))
                    {
                        (sourceWrites ??= []).Add(sourceWrite.Value);
                        continue;
                    }

                    ServerValidationUIUpdate? validation = ApplyClientUpdate(changeSet.Updates[i]);

                    if (validation is not null)
                        (validationUpdates ??= []).Add(validation);
                }

                DrainControllerChangesNoLock();

                staleWindows = DrainDirtyItemWindowsNoLock();
                changes = DrainPendingUpdatesForRuntimeModeNoLock(force: false);

                // Appended after the drain so a refusal always travels and one rejected value cannot abandon the rest.
                if (validationUpdates is not null)
                    changes = AppendUpdates(changes, validationUpdates);
            }
            finally
            {
                _ = _stateLock.Release();
            }

            // After the lock: a source write runs through its own asynchronous method, once the rest of the change set has applied.
            if (sourceWrites is not null)
                changes = AppendUpdates(changes, await ApplySourceWritesAsync(sourceWrites, cancellationToken).ConfigureAwait(false));

            // Arrives here, not through a flush, so a windowed host's reload rules see what just changed.
            changes = await AppendItemWindowReloadsAsync(changes, staleWindows, cancellationToken).ConfigureAwait(false);

            return await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _ = await HandleRuntimeExceptionAsync(
                exception,
                "ProcessChangeSetFromUI",
                commandRequest: null,
                clientChangeSet: changeSet,
                cancellationToken
            ).ConfigureAwait(false);

            return await FlushCoreAsync(force: true, publish: true, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// Holds aside a write that belongs to a windowed source. Everything else is applied inline.
    /// </summary>
    private bool TryHoldSourceWriteNoLock(ClientUIUpdate update, [NotNullWhen(true)] out PendingSourceWrite? pending)
    {
        pending = null;

        if (update is not ClientValueUIUpdate valueUpdate)
            return false;

        ArgumentNullException.ThrowIfNull(valueUpdate.DynamicParameters);

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(valueUpdate.Address, valueUpdate.DynamicParameters);

        if (resolution.Binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit))
            return false;

        return TryResolveSourceWriteNoLock(valueUpdate, resolution, out pending);
    }

    /// <summary>
    /// Applies one client update, returning the validation update it produced, if any.
    /// </summary>
    private ServerValidationUIUpdate? ApplyClientUpdate(ClientUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);

        return update switch
        {
            ClientValueUIUpdate valueUpdate => ApplyValueUpdate(valueUpdate),
            _ => throw new UnreachableException()
        };
    }

    /// <summary>
    /// Applies a client value update; a value the format cannot read is rejected, not thrown, while a malformed update still throws.
    /// </summary>
    private ServerValidationUIUpdate? ApplyValueUpdate(ClientValueUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update.DynamicParameters);

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(update.Address, update.DynamicParameters);

        if (resolution.Binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit))
            throw new InvalidOperationException($"Binding '{resolution.Binding.Id}' does not accept client value updates.");

        if (resolution.Source.Kind != CompiledUIBindingSourceKind.Controller)
            throw new InvalidOperationException($"Client value update target source '{resolution.Source.Kind}' is not writable.");

        if (NormalizeClientValue(resolution.Binding, update.Value, out var value) == UIFormattedValueNormalization.Rejected)
            return RejectValueNoLock(update, resolution.Binding);

        if (Controller.TrySetRecursiveValue(resolution.Path, value))
            return ClearRejectionNoLock(update);

        // A path that reads but refuses the value comes back as a refusal; one that cannot even read is a broken address and still throws.
        if (!Controller.TryGetRecursiveValue(resolution.Path, out _))
            throw new InvalidOperationException($"Binding '{resolution.Binding.Id}' target path '{resolution.Path}' cannot be resolved on the controller.");

        return RejectValueNoLock(update, resolution.Binding);
    }

    /// <summary>
    /// Normalizes a formatted <see cref="IFormattedInputComponent"/> value against its own format/culture
    /// before the culture-unaware setter coercion sees it.
    /// </summary>
    private UIFormattedValueNormalization NormalizeClientValue(CompiledUIBinding binding, object? value, out object? normalized)
    {
        normalized = value;

        if (value is not string)
            return UIFormattedValueNormalization.Untouched;

        var format = TryGetComponentText(binding.Address.Component.Id, IFormattedInputComponent.FormatProperty);
        var culture = TryGetComponentText(binding.Address.Component.Id, IFormattedInputComponent.CultureProperty);

        return UIFormattedValueNormalizer.Normalize(value, format, culture, out normalized);
    }

    /// <summary>
    /// Reads a statically-authored string property off the compiled component; a bound format or culture is not followed.
    /// </summary>
    private string? TryGetComponentText(UIComponentId componentId, UIProperty property)
        => View.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? value) && value is { IsBind: false }
            ? value.Value as string
            : null;

    private ServerValidationUIUpdate RejectValueNoLock(ClientValueUIUpdate update, CompiledUIBinding binding)
    {
        UIPropertyAddress address = CreateValidationAddress(update);

        _ = _rejectedValueAddresses.Add(address);

        return new ServerValidationUIUpdate
        {
            Address = address,
            Message = TryGetComponentText(binding.Address.Component.Id, IFormattedInputComponent.FormatMessageProperty) ?? DefaultFormatMessage
        };
    }

    private static UIPropertyAddress CreateValidationAddress(ClientValueUIUpdate update)
        => new(update.Address.Component.Id, update.Address.Property, update.DynamicParameters);

    private ServerValidationUIUpdate? ClearRejectionNoLock(ClientValueUIUpdate update)
    {
        if (_rejectedValueAddresses.Count == 0)
            return null;

        UIPropertyAddress address = CreateValidationAddress(update);

        return _rejectedValueAddresses.Remove(address)
            ? new ServerValidationUIUpdate { Address = address, Message = null }
            : null;
    }

    private static ServerChangeSet AppendUpdates(ServerChangeSet changes, ServerChangeSet additional)
        => additional.IsEmpty ? changes : AppendUpdates(changes, [.. additional.Updates]);

    private static ServerChangeSet AppendUpdates(ServerChangeSet changes, List<ServerUIUpdate> additional)
    {
        if (changes.IsEmpty)
            return new ServerChangeSet { Updates = [.. additional] };

        ServerUIUpdate[] updates = new ServerUIUpdate[changes.Updates.Length + additional.Count];

        changes.Updates.CopyTo(updates, 0);
        additional.CopyTo(updates, changes.Updates.Length);

        return new ServerChangeSet { Updates = updates };
    }
}
