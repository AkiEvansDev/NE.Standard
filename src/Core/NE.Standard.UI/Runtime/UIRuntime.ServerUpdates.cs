using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    // The host's queue that the scheduled flush and every answer hand this runtime's change sets to, in the hold that drained them.
    private readonly UIUpdateDispatcher _dispatcher;

    /// <summary>
    /// Takes the queued updates a drain's change set carries: left to the flush, taken whole for it, and an answer queued its caller's
    /// copy.
    /// </summary>
    private ServerChangeSet TakePendingUpdatesNoLock(DrainTarget target)
    {
        if (target.Whole)
        {
            ServerChangeSet drained = DrainPendingUpdatesNoLock();

            // In the hold that drained it: an answer drained after it is queued behind it.
            if (target.Dispatch && !drained.IsEmpty)
                QueueDrainedNoLock(drained, target.Sends);

            return drained;
        }

        return target.AnswerFor is { } instanceId && target.Sends is { } sends
            ? AnswerPendingUpdatesNoLock(instanceId, sends)
            : ServerChangeSet.Empty;
    }

    /// <summary>Hands a drained set to the dispatcher, noting in <paramref name="sends"/>, where given, the send to wait for.</summary>
    private void QueueDrainedNoLock(ServerChangeSet drained, DrainSends? sends)
    {
        if (sends is null)
        {
            _dispatcher.Enqueue(this, drained);
            return;
        }

        // A later set of the same drain is sent after the earlier one, so its send is the one to wait for.
        if (_dispatcher.EnqueueAwaited(this, drained) is { } sent)
            sends.Sent = sent;
    }

    /// <summary>
    /// Queues one caller's copy of the queue in the dispatcher for that caller alone — behind every set drained before it, ahead of
    /// every set drained after — and notes in <paramref name="sends"/> the send its answer waits for; answers the copy itself only
    /// where the dispatcher took none: the caller not attached, the runtime stopping, nothing to send and nothing to wait for.
    /// </summary>
    /// <remarks>
    /// The queue keeps the updates for the flush to send every other attached instance, and the caller's watermark moves past them
    /// as its copy is sent, so the flush does not send it them again: moved at once, it would cut from a set drained before the copy,
    /// still to be sent, updates the copy never carried.
    /// </remarks>
    private ServerChangeSet AnswerPendingUpdatesNoLock(string instanceId, DrainSends sends)
    {
        // Nobody else to send them to: taken whole, and the flush has nothing left to do.
        var whole = !HasOtherAttachedInstance(instanceId);
        ServerChangeSet copy = whole ? DrainPendingUpdatesNoLock() : CopyPendingUpdatesNoLock();
        var through = _updateSequence;
        Action? mark = whole || copy.IsEmpty ? null : () => MarkAnswered(instanceId, through);

        if (IsAttached(instanceId) && _dispatcher.EnqueueAnswer(this, instanceId, copy, mark) is { } sent)
        {
            sends.Sent = sent;
            return ServerChangeSet.Empty;
        }

        return ChangesFor(instanceId, copy);
    }

    /// <summary>Whether an instance is attached: one the dispatcher sends to.</summary>
    private bool IsAttached(string instanceId)
        => _connections.IsAttached(instanceId);

    private ServerChangeSet DrainPendingUpdatesNoLock()
    {
        ServerChangeSet changes = CopyPendingUpdatesNoLock();

        KeepDrainedPastRenderNoLock();
        ClearPendingUpdatesNoLock();

        return changes;
    }

    private ServerChangeSet CopyPendingUpdatesNoLock()
    {
        if (_pendingUpdateCount == 0)
            return ServerChangeSet.Empty;

        ServerUIUpdate[] updates = new ServerUIUpdate[_pendingUpdateCount];
        var sequences = new long[updates.Length];
        var next = 0;

        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            PendingUpdate pending = _pendingUpdates[i];

            if (pending.Update is null)
                continue;

            updates[next] = pending.Update;
            sequences[next++] = pending.Sequence;
        }

        ServerChangeSet changes = new() { Updates = updates, Sequences = sequences };
        changes.Validate();

        return changes;
    }

    /// <summary>Queues an update under the next number and returns its slot in <c>_pendingUpdates</c>.</summary>
    private int QueueUpdateNoLock(ServerUIUpdate update)
    {
        var index = _pendingUpdates.Count;
        _pendingUpdates.Add(new PendingUpdate(update, ++_updateSequence));
        _pendingUpdateCount++;
        return index;
    }

    private readonly record struct PendingUpdate(ServerUIUpdate? Update, long Sequence);

    /// <summary>Who a drain's change set goes to, which decides what it takes from the queue.</summary>
    private readonly record struct DrainTarget(bool Whole, bool Dispatch, string? AnswerFor, DrainSends? Sends)
    {
        /// <summary>Nobody: what the drain moved into the queue is left there for the flush.</summary>
        public static DrainTarget Leave => default;

        /// <summary>Every attached instance, through the dispatcher, handed each set in the hold that drained it.</summary>
        public static DrainTarget Dispatched => new(Whole: true, Dispatch: true, AnswerFor: null, Sends: null);

        /// <summary>Every attached instance, through the dispatcher, the caller learning which send to wait for.</summary>
        public static DrainTarget DispatchedAwaited(DrainSends sends) => new(Whole: true, Dispatch: true, AnswerFor: null, sends);

        /// <summary>One caller, whose copy of the queue the dispatcher sends it, and whose answer learns which send to wait for.</summary>
        public static DrainTarget Answer(string instanceId, DrainSends sends) => new(Whole: false, Dispatch: false, instanceId, sends);
    }

    /// <summary>
    /// What a drain's caller waits for before it goes — an answer, an explicit flush: the send of what it queued, behind every set
    /// drained before it; filled in the drain, under the state lock, and read once the drain is over.
    /// </summary>
    private sealed class DrainSends
    {
        public Task? Sent { get; set; }
    }

    private void ClearPendingUpdatesNoLock()
    {
        _pendingUpdates.Clear();
        _pendingUpdateCount = 0;
        _queuedValueIndices.Clear();
        _queuedRowReplaces.Clear();
        _rowChildUpdateIndices.Clear();
        _pendingFullResync = false;
    }

    private void AppendSetUpdatesNoLock(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (_pendingFullResync)
            return;

        AppendExactValueUpdatesNoLock(path);
        AppendDescendantValueUpdatesNoLock(path);
        AppendItemReplaceUpdatesNoLock(path);
        MarkChangedItemWindowRulesNoLock(path);
    }

    private void AddPendingUpdateNoLock(ServerUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);

        if (_pendingFullResync)
            return;

        switch (update)
        {
            // Built by BuildServerValueNoLock, which resolved its value already; one still unresolved failed to, was reported there, and
            // is dropped rather than sent raw.
            case ServerValueUIUpdate { Value: IUIResolvableValue }:
                break;

            case ServerValueUIUpdate valueUpdate:
                AddPendingValueUpdateNoLock(valueUpdate);
                break;

            case ServerCollectionChangeUIUpdate collectionUpdate:
                AddPendingCollectionUpdateNoLock(collectionUpdate);
                break;

            default:
                _ = QueueUpdateNoLock(update);
                break;
        }
    }

    private void AppendExactValueUpdatesNoLock(RecursivePath path)
    {
        if (!View.Bindings.TryGetControllerProperties(path, out IReadOnlyList<CompiledUIBinding> bindings, out var materializedParameters))
            return;

        var value = TryGetControllerValue(path);

        // Every binding here reads the same path, so its row is asked once, by the first binding that needs the answer.
        bool? content = null;

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (!TryAddressPush(binding, materializedParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(BuildServerValueNoLock(binding, path, dynamicParameters, value, ref content));
        }
    }

    /// <summary>
    /// The update that tells a client the value a binding reads at a controller path — the one shape a pushed value and the answer
    /// to a refused write share: brought to the property's type, its fallback for nothing, marked content where its row item is,
    /// and resolved.
    /// </summary>
    private ServerValueUIUpdate BuildServerValueNoLock(CompiledUIBinding binding, RecursivePath path, object?[] dynamicParameters)
    {
        bool? content = null;

        return BuildServerValueNoLock(binding, path, dynamicParameters, TryGetControllerValue(path), ref content);
    }

    /// <remarks>
    /// Takes the value read already and the row's answer once asked, which several bindings reading one path share.
    /// </remarks>
    private ServerValueUIUpdate BuildServerValueNoLock(CompiledUIBinding binding, RecursivePath path, object?[] dynamicParameters, object? value, ref bool? content)
        => ResolveServerValueUpdateNoLock(new ServerValueUIUpdate
        {
            Address = new(binding.Address.Component.Id, binding.Address.Property, dynamicParameters),
            Value = UIBoundValueConverter.Convert(value ?? binding.TargetFallbackValue, binding.TargetValueType),
            Content = AsksRowItem(binding, dynamicParameters) && (content ??= IsReadOffContentItem(path))
        });

    /// <summary>Whether a binding's pushed value asks its row item for a content mark: only a row's binding, and only a word.</summary>
    private static bool AsksRowItem(CompiledUIBinding binding, object?[] dynamicParameters)
        => binding.IsTranslatable && dynamicParameters.Length > 0;

    /// <summary>
    /// Whether a value is read off a row item that says its words are content (<see cref="IContentItem"/>) — the innermost row on
    /// the path, the one the first paint and a client-built row ask; an ordinary item nested under a content one is not content.
    /// </summary>
    /// <remarks>Walked segment by segment from the controller: the flush path builds no prefix path.</remarks>
    private bool IsReadOffContentItem(RecursivePath path)
    {
        ReadOnlySpan<PathSegment> segments = path.AsSpan();
        var rowEnd = segments.Length - 1;

        while (rowEnd >= 0 && segments[rowEnd].Kind == PathSegmentKind.Property)
            rowEnd--;

        if (rowEnd < 0)
            return false;

        if (Controller is not RecursiveObservable current)
            return TryGetControllerValue(path.Take(rowEnd + 1)) is IContentItem { IsContent: true };

        object? item = current;

        for (var i = 0; i <= rowEnd; i++)
        {
            if (item is not RecursiveObservable observable || !observable.TryGetRecursiveValue(segments[i], out item))
                return false;
        }

        return item is IContentItem { IsContent: true };
    }

    private void AppendDescendantValueUpdatesNoLock(RecursivePath path)
    {
        if (!View.Bindings.TryGetControllerDescendantProperties(path, out IReadOnlyList<CompiledUIBinding> bindings, out var baseParameters))
            return;

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (!TryAddressPush(binding, baseParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(BuildServerValueNoLock(binding, View.Bindings.MaterializePath(binding, baseParameters), dynamicParameters));
        }
    }

    private void AppendFullResyncNoLock()
    {
        ClearPendingUpdatesNoLock();
        ForgetRenderNoLock();

        // A resync sends every value to every instance; a write held back from one would be held from nothing.
        _heldValues.Clear();
        _pendingFullResync = true;
        _ = QueueUpdateNoLock(new ServerFullResyncUIUpdate());
    }
}
