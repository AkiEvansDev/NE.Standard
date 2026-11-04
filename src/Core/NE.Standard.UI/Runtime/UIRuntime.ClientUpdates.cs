using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using System.Runtime.ExceptionServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    // A page shows a handful of refused fields at once; past this the oldest refusal is given up, and only its later clear is not sent.
    private const int MaxRejectedValueAddresses = 256;

    /// <summary>
    /// Addresses currently showing a refusal, oldest first, so a later valid value sends exactly one "clear"; a row leaving its list
    /// takes its own with it (<c>ForgetRejectionsInRowsNoLock</c>). The value is unused. Guarded by <c>_stateLock</c>.
    /// </summary>
    private readonly OrderedDictionary<UIPropertyAddress, bool> _rejectedValueAddresses = [];

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

        // Refused here as at the host: a write waits for the state lock, which an action holds until it returns.
        ThrowIfInsideAction(nameof(ProcessChangeSetFromUIAsync));

        // Held as a command holds it, so a runtime taken away meanwhile waits for the write rather than disposing under it.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        // A setter or a source sending effects or reading the connection reads the writer's tab, as a command reads its own.
        using IDisposable invocation = BeginInvocation(invoker);

        return await ProcessChangeSetFromUICoreAsync(invoker, changeSet, cancellationToken).ConfigureAwait(false);
    }

    private async Task<ServerChangeSet> ProcessChangeSetFromUICoreAsync(UIHandle invoker, ClientChangeSet changeSet, CancellationToken cancellationToken)
    {
        try
        {
            (List<PendingSourceWrite>? sourceWrites, List<ServerUIUpdate>? refusals, List<UIComponentId>? staleWindows, List<Exception>? failures) = await ApplyClientValuesTurnAsync(invoker, changeSet, cancellationToken).ConfigureAwait(false);

            // Outside the turn: the handler is the author's code, which may await this runtime.
            if (failures is not null)
            {
                foreach (Exception failure in failures)
                    await ReportFailureAsync(invoker, failure, "ProcessChangeSetFromUI", changeSet, cancellationToken).ConfigureAwait(false);
            }

            // After the turn: a source write runs the source's own code, which may await this runtime, once the rest has applied.
            if (sourceWrites is not null)
            {
                if (await ApplySourceWritesAsync(sourceWrites, invoker.Instance.Id, cancellationToken).ConfigureAwait(false) is { } refused)
                    (refusals ??= []).AddRange(refused);

                _ = await DrainAsync(action: null, DrainTarget.Leave, cancellationToken).ConfigureAwait(false);
            }

            // Here, not through a flush, so a windowed host's reload rules see what just changed.
            _ = await AppendItemWindowReloadsAsync(ServerChangeSet.Empty, staleWindows, DrainTarget.Leave, invoker, cancellationToken).ConfigureAwait(false);

            // The writer's own, shown to no other instance.
            return refusals is null ? ServerChangeSet.Empty : new ServerChangeSet { Updates = [.. refusals] };
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            await ReportFailureAsync(invoker, exception, "ProcessChangeSetFromUI", changeSet, cancellationToken).ConfigureAwait(false);

            // The writer's copy, without the values it just sent: they would otherwise come back over what it is typing.
            return await AnswerAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);
        }
    }

    /// <summary>
    /// Hands a failure of a page's own request — a value it wrote, a window it asked for — to the controller's handler, and shows the
    /// page what the handler answers: its own effects, or the failure notification a failed command shows.
    /// </summary>
    /// <remarks>
    /// A hook and posted work answer no page, so their failures stay in the log. The page is sent the effects as an effect outside a
    /// command is; one it cannot be sent is dropped and said in the log, since the failure itself has had its handler already.
    /// </remarks>
    private async Task ReportFailureAsync(UIHandle page, Exception exception, string operation, ClientChangeSet? changeSet, CancellationToken cancellationToken)
    {
        RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, changeSet, cancellationToken).ConfigureAwait(false);
        UICommandResult failed = ResolveCommandResult(error, exception);

        if (failed.Effects.Length == 0)
            return;

        try
        {
            await SendEffectsToAsync([page], failed.Effects, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception sendFailure) when (sendFailure is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
        {
            TryLog((failed.Effects[0].Kind, sendFailure), static (logger, state) => Log.RuntimeEffectDropped(logger, state.sendFailure, state.Kind, state.sendFailure.Message));
        }
    }

    /// <summary>
    /// The change set's turn: every value applied under the state lock — but a source's, held aside for after the turn — and what it
    /// changed left queued for the flush; answers the held writes, the writer's refusals, the windows found stale and what the setters
    /// threw.
    /// </summary>
    private async Task<(List<PendingSourceWrite>? SourceWrites, List<ServerUIUpdate>? Refusals, List<UIComponentId>? StaleWindows, List<Exception>? Failures)> ApplyClientValuesTurnAsync(UIHandle invoker, ClientChangeSet changeSet, CancellationToken cancellationToken)
    {
        List<PendingSourceWrite>? sourceWrites = null;
        List<ServerUIUpdate>? refusals = null;
        List<UIComponentId>? staleWindows;
        List<Exception>? failures = null;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            for (var i = 0; i < changeSet.Updates.Length; i++)
            {
                ClientUIUpdate update = changeSet.Updates[i];

                ArgumentNullException.ThrowIfNull(update);

                // A value is the only update a client sends.
                if (update is not ClientValueUIUpdate sent)
                    throw new UnreachableException();

                // Trimmed once, so the gates, the write, its answer and its hold all read the one row it names.
                ClientValueUIUpdate valueUpdate = TrimToComponentKeys(sent);

                // Resolved once, and its text read by the input's format at most once, for the gates and the write alike.
                CompiledUIBindingResolution resolution = ResolveClientWrite(valueUpdate.Address);
                ClientValueRead? read = null;

                // Ahead of both ways a write goes: one the reader may not make is answered with the value it would replace.
                if (IsWriteRefusedNoLock(valueUpdate, resolution, ref read, changeSet))
                {
                    _host.Metrics.ValueRefused("refused");
                    (refusals ??= []).Add(AnswerRefusedWriteNoLock(valueUpdate, resolution));

                    // The field goes back to the server's value, so a refusal of an earlier text no longer speaks for what it shows.
                    if (ClearRejectionNoLock(valueUpdate) is { } cleared)
                        refusals.Add(cleared);

                    continue;
                }

                if (TryHoldSourceWriteNoLock(valueUpdate, resolution, out PendingSourceWrite? sourceWrite))
                {
                    // Read as an inline write is: by the input's format, an emptied number or day as no value, unreadable text refused
                    // for a row the window holds and skipped for one it does not.
                    ClientValueRead value = read ?? ReadClientValue(resolution.Binding, valueUpdate.Value);

                    if (value.Normalization != UIFormattedValueNormalization.Rejected)
                        (sourceWrites ??= []).Add(sourceWrite.Value with { Value = value.Value });
                    else if (IsWriteRowHeldNoLock(resolution))
                        (refusals ??= []).Add(RejectValueNoLock(valueUpdate, resolution.Binding));

                    continue;
                }

                ServerValidationUIUpdate? validation = ApplyValueUpdate(valueUpdate, resolution, read, out ClientValueUIUpdate? applied, out Exception? setterFailure);

                // A throw would end the set here, and the values after it, which the writer shows, would be lost unseen: the value is
                // refused, the handler hears it after the turn, and the rest of the set goes on.
                if (setterFailure is not null)
                {
                    (failures ??= []).Add(setterFailure);
                    validation = RejectValueNoLock(valueUpdate, resolution.Binding);
                }

                // Collected apart from the queue so a refusal always travels and one rejected value cannot abandon the rest.
                if (validation is not null)
                    (refusals ??= []).Add(validation);

                if (applied is not null)
                    HoldWrittenValueNoLock(applied, resolution.Binding, invoker.Instance.Id);
            }

            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return (sourceWrites, refusals, staleWindows, failures);
    }

    /// <summary>
    /// The write addressed by the keys of the rows its component stands in, and no more: an interaction in a row writing back a
    /// component outside it sends the row's keys along. Left past the gates, a surplus key would have them judge another row than
    /// the one the write lands on; a key short is a forged address, whose gates read by key would read no row and close nothing.
    /// </summary>
    private ClientValueUIUpdate TrimToComponentKeys(ClientValueUIUpdate update)
    {
        UIComponentAddress component = update.Address.Component;

        if (!View.Graph.TryGet(component.Id, out UIComponentNode? node) || component.DynamicParameters.Length == node.ContextParameterCount)
            return update;

        if (component.DynamicParameters.Length < node.ContextParameterCount)
        {
            _host.Metrics.ValueRefused("forged");

            throw new UnauthorizedAccessException($"A value at '{update.Address}' names fewer row keys than the rows its component stands in.");
        }

        return new ClientValueUIUpdate
        {
            Address = new UIPropertyAddress(component.Id, update.Address.Property, TakeDynamicParameters(component.DynamicParameters, node.ContextParameterCount)),
            Value = update.Value
        };
    }

    /// <summary>
    /// The binding a client's write lands on, read by the outer row keys it is bound under. An address no page of this compile could
    /// send — no binding there, or fewer row keys than it reads — is a forged call, refused as one rather than failed with a stack.
    /// </summary>
    private CompiledUIBindingResolution ResolveClientWrite(UIPropertyAddress address)
    {
        if (View.Bindings.TryResolveWrite(address, out CompiledUIBindingResolution resolution))
            return resolution;

        _host.Metrics.ValueRefused("forged");

        throw new UnauthorizedAccessException($"No value of this page is written at '{address}', or not under the row keys it names.");
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
    /// Whether the row a write lands in is still held. Only a write under its own row's key answers false — that row removed while the
    /// write was on its way, or one a script made up: the write lands nowhere and the rest of the set goes on. The row is the path up
    /// to the binding's innermost row key; a field past it the path cannot read (a null on the way) is the binding's fault, not a
    /// stale row.
    /// </summary>
    /// <remarks>
    /// Skipped rather than thrown: a throw ended the set there, and the values after it, which the writer shows, were lost unseen.
    /// A removed row and a made-up one look alike here, and neither is recorded.
    /// </remarks>
    private bool IsWriteRowHeldNoLock(CompiledUIBindingResolution resolution)
    {
        var row = InnermostRowSlot(resolution.Binding.Parameters);

        // The field read first: where it reads, its row is held, and no row path is built.
        if (row == 0 || Controller.TryGetRecursiveValue(resolution.Path, out _) || Controller.TryGetRecursiveValue(RowPath(resolution.Path, row), out _))
            return true;

        _host.Metrics.ValueRefused("stale");

        return false;
    }

    /// <summary>
    /// The place, among the path's keys and indexes counted from the outermost, of the binding's innermost row key; zero where it is
    /// bound under none (a Root-scoped binding in a row).
    /// </summary>
    private static int InnermostRowSlot(CompiledUIBindingParameter[] parameters)
    {
        var slot = 0;
        var row = 0;

        for (var i = 0; i < parameters.Length; i++)
        {
            // A scope parameter fills no slot of the path; a fixed one fills a key or an index, as a row key does.
            if (parameters[i].Kind == CompiledUIBindingParameterKind.Scope)
                continue;

            slot++;

            if (parameters[i].Kind == CompiledUIBindingParameterKind.Dynamic)
                row = slot;
        }

        return row;
    }

    /// <summary>
    /// Applies a client value update as <see cref="ApplyValueUpdate(ClientValueUIUpdate, CompiledUIBindingResolution, ClientValueRead?, out ClientValueUIUpdate?, out Exception?)"/>
    /// does, a setter's throw thrown on.
    /// </summary>
    private ServerValidationUIUpdate? ApplyValueUpdate(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ClientValueRead? read, out ClientValueUIUpdate? applied)
    {
        ServerValidationUIUpdate? validation = ApplyValueUpdate(update, resolution, read, out applied, out Exception? setterFailure);

        if (setterFailure is not null)
            ExceptionDispatchInfo.Throw(setterFailure);

        return validation;
    }

    /// <summary>
    /// Applies a client value update, its text read by the input's format where a gate has not read it already; a value the format
    /// cannot read is rejected, not thrown, one for a row no longer held is skipped, while a malformed update still throws. What a
    /// setter of the author's throws is handed back, the value left unapplied.
    /// </summary>
    private ServerValidationUIUpdate? ApplyValueUpdate(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ClientValueRead? read, out ClientValueUIUpdate? applied, out Exception? setterFailure)
    {
        applied = null;
        setterFailure = null;

        if (resolution.Binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit))
            throw new InvalidOperationException($"Binding '{resolution.Binding.Id}' does not accept client value updates.");

        if (resolution.Source.Kind != CompiledUIBindingSourceKind.Controller)
            throw new InvalidOperationException($"Client value update target source '{resolution.Source.Kind}' is not writable.");

        ClientValueRead value = read ?? ReadClientValue(resolution.Binding, update.Value);

        // Read first, so a refusal is recorded only for a field in a row the controller holds, never for a row key a script made up.
        if (value.Normalization == UIFormattedValueNormalization.Rejected)
            return IsWriteRowHeldNoLock(resolution) ? RejectValueNoLock(update, resolution.Binding) : null;

        bool set;

        try
        {
            set = Controller.TrySetRecursiveValue(resolution.Path, value.Value);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            setterFailure = exception;
            return null;
        }

        if (set)
        {
            applied = ReferenceEquals(value.Value, update.Value) ? update : new ClientValueUIUpdate { Address = update.Address, Value = value.Value };
            return ClearRejectionNoLock(update);
        }

        if (!IsWriteRowHeldNoLock(resolution))
            return null;

        // A path that reads but refuses the value comes back as a refusal; one that cannot even read, in a row that is held, is a
        // broken binding, as it is outside any row.
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

        // A list or document past the application's limits is refused as unreadable, before any setter or source sees it.
        if (value is not string text)
            return RecursiveValueCoercion.IsWithinLimits(value, _application.Security.MaxClientValueElements, _application.Security.MaxClientValueDepth) ? UIFormattedValueNormalization.Untouched : UIFormattedValueNormalization.Rejected;

        // An emptied field sends its empty text: written to a value that is no text — a number, a day — it is no value at all.
        if (string.IsNullOrWhiteSpace(text) && binding.TargetValueType is { IsValueType: true })
        {
            normalized = null;
            return UIFormattedValueNormalization.Normalized;
        }

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
        UIPropertyAddress address = update.Address;

        _host.Metrics.ValueRefused("rejected");

        // Past the bound the oldest gives way: the newest is the one its reader is fixing now.
        if (_rejectedValueAddresses.Count >= MaxRejectedValueAddresses && !_rejectedValueAddresses.ContainsKey(address))
            _rejectedValueAddresses.RemoveAt(0);

        _rejectedValueAddresses[address] = true;

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

    private ServerValidationUIUpdate? ClearRejectionNoLock(ClientValueUIUpdate update)
    {
        if (_rejectedValueAddresses.Count == 0)
            return null;

        // The field's own address, the row it stands in: a refusal is the one field's, not every row's a Root-scoped binding reaches.
        UIPropertyAddress address = update.Address;

        return _rejectedValueAddresses.Remove(address)
            ? new ServerValidationUIUpdate { Address = address, Message = null }
            : null;
    }

    /// <summary>
    /// Keeps a taken write from being echoed to its writer — unless its binding reaches more fields than the one written (a Root-scoped
    /// binding in a row), whose others on the writer's page must still hear it.
    /// </summary>
    private void HoldWrittenValueNoLock(ClientValueUIUpdate update, CompiledUIBinding binding, string instanceId)
    {
        if (CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters) == update.Address.Component.DynamicParameters.Length)
            _heldValues.Add(new HeldValue(update, instanceId));
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

                if (!pending.Address.Equals(update.Address) || !SameHeldValue(pending.Value, update.Value))
                    continue;

                _pendingUpdates[i] = _pendingUpdates[i] with { Update = new ServerValueUIUpdate { Address = pending.Address, Value = pending.Value, Content = pending.Content, ExceptInstanceId = held.InstanceId } };
                break;
            }
        }

        _heldValues.Clear();
    }

    private static bool SameHeldValue(object? pending, object? written)
        => Equals(pending, written)
            || (pending is not null && written is not null && RecursiveValueCoercion.TryCoerce(written, pending.GetType(), out var coerced) && Equals(pending, coerced));

    private readonly record struct HeldValue(ClientValueUIUpdate Update, string InstanceId);
}
