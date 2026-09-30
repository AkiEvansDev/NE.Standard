using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <summary>
    /// Addresses currently showing a refusal, so a later valid value sends exactly one "clear". Guarded by <c>_stateLock</c>.
    /// </summary>
    private readonly HashSet<UIPropertyAddress> _rejectedValueAddresses = [];

    /// <summary>
    /// The values clients wrote that no controller change has been turned into updates for yet. Guarded by <c>_stateLock</c>.
    /// </summary>
    private readonly List<HeldValue> _heldValues = [];

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetFromUIAsync(UIHandle invoker, ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(invoker);
        ArgumentNullException.ThrowIfNull(changeSet);
        changeSet.Validate();

        // Held as a command holds it, so a runtime taken away meanwhile waits for the write rather than disposing under it.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        return await InSendOrderAsync(() => ProcessChangeSetFromUICoreAsync(invoker, changeSet, cancellationToken), cancellationToken).ConfigureAwait(false);
    }

    private async Task<ServerChangeSet> ProcessChangeSetFromUICoreAsync(UIHandle invoker, ClientChangeSet changeSet, CancellationToken cancellationToken)
    {
        try
        {
            ServerChangeSet changes;
            List<PendingSourceWrite>? sourceWrites = null;
            List<ServerUIUpdate>? refusals = null;
            List<UIComponentId>? staleWindows;

            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                for (var i = 0; i < changeSet.Updates.Length; i++)
                {
                    ClientUIUpdate update = changeSet.Updates[i];

                    ArgumentNullException.ThrowIfNull(update);

                    // A value is the only update a client sends.
                    if (update is not ClientValueUIUpdate valueUpdate)
                        throw new UnreachableException();

                    ArgumentNullException.ThrowIfNull(valueUpdate.DynamicParameters);

                    // Resolved once, and its text read by the input's format at most once, for the gates and the write alike.
                    CompiledUIBindingResolution resolution = View.Bindings.Resolve(valueUpdate.Address, valueUpdate.DynamicParameters);
                    ClientValueRead? read = null;

                    // Ahead of both ways a write goes: one the reader may not make is answered with the value it would replace.
                    if (IsWriteRefusedNoLock(valueUpdate, resolution, ref read))
                    {
                        (refusals ??= []).Add(AnswerRefusedWriteNoLock(valueUpdate, resolution));
                        continue;
                    }

                    if (TryHoldSourceWriteNoLock(valueUpdate, resolution, out PendingSourceWrite? sourceWrite))
                    {
                        (sourceWrites ??= []).Add(sourceWrite.Value);
                        continue;
                    }

                    ServerValidationUIUpdate? validation = ApplyValueUpdate(valueUpdate, resolution, read, out ClientValueUIUpdate? applied);

                    // Collected apart from the queue so a refusal always travels and one rejected value cannot abandon the rest.
                    if (validation is not null)
                        (refusals ??= []).Add(validation);

                    if (applied is not null)
                        _heldValues.Add(new HeldValue(applied, invoker.Instance.Id));
                }

                DrainControllerChangesNoLock();

                staleWindows = DrainDirtyItemWindowsNoLock();
                changes = TakePendingUpdatesNoLock(DrainTarget.Leave);
            }
            finally
            {
                _ = _stateLock.Release();
            }

            // After the lock: a source write runs through its own asynchronous method, once the rest of the change set has applied.
            if (sourceWrites is not null)
            {
                if (await ApplySourceWritesAsync(sourceWrites, cancellationToken).ConfigureAwait(false) is { } refused)
                    (refusals ??= []).AddRange(refused);

                changes = AppendUpdates(changes, await FlushCoreAsync(DrainTarget.Leave, publish: false, cancellationToken).ConfigureAwait(false));
            }

            // Arrives here, not through a flush, so a windowed host's reload rules see what just changed.
            changes = await AppendItemWindowReloadsAsync(changes, staleWindows, DrainTarget.Leave, cancellationToken).ConfigureAwait(false);

            // Every instance's: a runtime that sends as it drains sends them now, one that batches has left them to its flush.
            _ = await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false);

            // The writer's own, shown to no other instance.
            return refusals is null ? ServerChangeSet.Empty : new ServerChangeSet { Updates = [.. refusals] };
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _ = await HandleRuntimeExceptionAsync(exception, "ProcessChangeSetFromUI", commandRequest: null, clientChangeSet: changeSet, cancellationToken).ConfigureAwait(false);

            // The writer's copy, without the values it just sent: they would otherwise come back over what it is typing.
            return await AnswerCoreAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// Holds aside a write that belongs to a windowed source. Everything else is applied inline.
    /// </summary>
    private bool TryHoldSourceWriteNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, [NotNullWhen(true)] out PendingSourceWrite? pending)
    {
        pending = null;

        if (resolution.Binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit))
            return false;

        return TryResolveSourceWriteNoLock(update, resolution, out pending);
    }

    /// <summary>
    /// Applies a client value update, its text read by the input's format where a gate has not read it already; a value the format
    /// cannot read is rejected, not thrown, while a malformed update still throws.
    /// </summary>
    private ServerValidationUIUpdate? ApplyValueUpdate(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ClientValueRead? read, out ClientValueUIUpdate? applied)
    {
        applied = null;

        if (resolution.Binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit))
            throw new InvalidOperationException($"Binding '{resolution.Binding.Id}' does not accept client value updates.");

        if (resolution.Source.Kind != CompiledUIBindingSourceKind.Controller)
            throw new InvalidOperationException($"Client value update target source '{resolution.Source.Kind}' is not writable.");

        ClientValueRead value = read ?? ReadClientValue(resolution.Binding, update.Value);

        if (value.Normalization == UIFormattedValueNormalization.Rejected)
            return RejectValueNoLock(update, resolution.Binding);

        if (Controller.TrySetRecursiveValue(resolution.Path, value.Value))
        {
            applied = update;
            return ClearRejectionNoLock(update);
        }

        // A path that reads but refuses the value comes back as a refusal; one that cannot even read is a broken address and still throws.
        if (!Controller.TryGetRecursiveValue(resolution.Path, out _))
            throw new InvalidOperationException($"Binding '{resolution.Binding.Id}' target path '{resolution.Path}' cannot be resolved on the controller.");

        return RejectValueNoLock(update, resolution.Binding);
    }

    /// <summary>A value a client wrote as its input's format reads it: what the normalization made of it, and the value it made.</summary>
    private readonly record struct ClientValueRead(UIFormattedValueNormalization Normalization, object? Value);

    private ClientValueRead ReadClientValue(CompiledUIBinding binding, object? value)
        => new(NormalizeClientValue(binding, value, out var normalized), normalized);

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

        // The author's text compiles to its plain string; a phrase stays one, always translated.
        UIPhrase? message = View.State.TryGetValue(binding.Address.Component.Id, IFormattedInputComponent.FormatMessageProperty, out CompiledUIPropertyValue? authored) && authored is { IsBind: false }
            ? authored.Value switch
            {
                string text => text,
                UIPhrase phrase => phrase,
                _ => null
            }
            : null;

        return new ServerValidationUIUpdate
        {
            Address = address,
            // The author's words or the framework's key, as written: the page translates the refusal as it does a label.
            Message = message ?? UIStrings.ValueFormat,
            Content = message is { IsText: true } && authored!.IsContent
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

    /// <summary>
    /// Marks queued updates that carry exactly what a client just wrote to the same address, so the writer doesn't get its own
    /// value echoed back, then forgets the writes — one kept past this append could hold back a later value.
    /// </summary>
    /// <remarks>
    /// Equal by <see cref="object.Equals(object?, object?)"/>: a value the setter changed, or one that differs in shape (object
    /// here, JSON there), still goes back.
    /// </remarks>
    private void MarkHeldValuesNoLock()
    {
        if (_heldValues.Count == 0)
            return;

        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            if (_pendingUpdates[i].Update is not ServerValueUIUpdate { ExceptInstanceId: null } pending)
                continue;

            foreach (HeldValue held in _heldValues)
            {
                ClientValueUIUpdate update = held.Update;

                if (!pending.Address.Component.Id.Equals(update.Address.Component.Id)
                    || !pending.Address.Property.Equals(update.Address.Property)
                    || !AreDynamicParametersEqual(pending.Address.Component.DynamicParameters, update.DynamicParameters)
                    || !Equals(pending.Value, update.Value))
                {
                    continue;
                }

                _pendingUpdates[i] = _pendingUpdates[i] with { Update = new ServerValueUIUpdate { Address = pending.Address, Value = pending.Value, Content = pending.Content, ExceptInstanceId = held.InstanceId } };
                break;
            }
        }

        _heldValues.Clear();
    }

    private readonly record struct HeldValue(ClientValueUIUpdate Update, string InstanceId);

    /// <remarks>An update never queued carries no number, and counts as newer than any snapshot a client started from.</remarks>
    private static ServerChangeSet AppendUpdates(ServerChangeSet changes, ServerChangeSet additional)
    {
        if (additional.IsEmpty)
            return changes;

        if (changes.IsEmpty)
            return additional;

        ServerUIUpdate[] updates = [.. changes.Updates, .. additional.Updates];

        return changes.Sequences is null && additional.Sequences is null
            ? new ServerChangeSet { Updates = updates }
            : new ServerChangeSet { Updates = updates, Sequences = [.. SequencesOf(changes), .. SequencesOf(additional)] };
    }

    private static long[] SequencesOf(ServerChangeSet changes)
    {
        if (changes.Sequences is { } sequences)
            return sequences;

        var unnumbered = new long[changes.Updates.Length];

        Array.Fill(unnumbered, long.MaxValue);

        return unnumbered;
    }
}
