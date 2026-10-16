using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // The host's queue that the scheduled flush and every answer hand this runtime's change sets to, in the hold that drained them.
    private readonly UIUpdateDispatcher _dispatcher;

    /// <summary>
    /// Takes the queued updates a drain's change set carries. A runtime that sends as it drains takes the whole queue every turn;
    /// one that batches leaves it to its flush, takes it whole for the flush, and queues an answer its caller's copy.
    /// </summary>
    private ServerChangeSet TakePendingUpdatesNoLock(DrainTarget target)
    {
        if (SendsWhatItDrains || target.Whole)
        {
            ServerChangeSet drained = DrainPendingUpdatesNoLock();

            // In the hold that drained it: an answer drained after it is queued behind it.
            if (!SendsWhatItDrains && target.Dispatch && !drained.IsEmpty)
                _dispatcher.Enqueue(this, drained);

            return drained;
        }

        return target.AnswerFor is { } instanceId && target.Sends is { } sends
            ? AnswerPendingUpdatesNoLock(instanceId, sends)
            : ServerChangeSet.Empty;
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
    private ServerChangeSet AnswerPendingUpdatesNoLock(string instanceId, AnswerSends sends)
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
        => Array.IndexOf(_attachedInstanceIdsSnapshot, instanceId) >= 0;

    private ServerChangeSet DrainPendingUpdatesNoLock()
    {
        ServerChangeSet changes = CopyPendingUpdatesNoLock();

        KeepDrainedPastRenderNoLock();
        ClearPendingUpdatesNoLock();

        return changes;
    }

    private ServerChangeSet CopyPendingUpdatesNoLock()
    {
        if (_pendingUpdates.Count == 0)
            return ServerChangeSet.Empty;

        ServerUIUpdate[] updates = new ServerUIUpdate[_pendingUpdates.Count];
        var sequences = new long[updates.Length];

        for (var i = 0; i < updates.Length; i++)
            (updates[i], sequences[i]) = _pendingUpdates[i];

        ServerChangeSet changes = new() { Updates = updates, Sequences = sequences };
        changes.Validate();

        return changes;
    }

    /// <summary>Queues an update under the next number.</summary>
    private void QueueUpdateNoLock(ServerUIUpdate update)
        => _pendingUpdates.Add(new PendingUpdate(update, ++_updateSequence));

    private readonly record struct PendingUpdate(ServerUIUpdate Update, long Sequence);

    /// <summary>Who a drain's change set goes to, which decides what it takes from the queue.</summary>
    private readonly record struct DrainTarget(bool Whole, bool Dispatch, string? AnswerFor, AnswerSends? Sends)
    {
        /// <summary>Nobody in particular: a batching runtime leaves its queue to the flush.</summary>
        public static DrainTarget Leave => default;

        /// <summary>Every attached instance: the flush takes the whole queue.</summary>
        public static DrainTarget Flush => new(Whole: true, Dispatch: false, AnswerFor: null, Sends: null);

        /// <summary>Every attached instance, through the dispatcher, handed each set in the hold that drained it.</summary>
        public static DrainTarget Dispatched => new(Whole: true, Dispatch: true, AnswerFor: null, Sends: null);

        /// <summary>One caller, whose copy of the queue the dispatcher sends it, and whose answer learns which send to wait for.</summary>
        public static DrainTarget Answer(string instanceId, AnswerSends sends) => new(Whole: false, Dispatch: false, instanceId, sends);
    }

    /// <summary>
    /// What an answer waits for before it goes: the send of its copy, queued behind every set drained before it; filled in the drain,
    /// under the state lock, and read once the drain is over.
    /// </summary>
    private sealed class AnswerSends
    {
        public Task? Sent { get; set; }
    }

    private void ClearPendingUpdatesNoLock()
    {
        _pendingUpdates.Clear();
        _queuedValueAddresses.Clear();
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
            case ServerValueUIUpdate valueUpdate:
                // Built by BuildServerValueNoLock, which resolved its value already.
                AddPendingValueUpdateNoLock(valueUpdate);
                break;

            case ServerCollectionChangeUIUpdate collectionUpdate:
                AddPendingCollectionUpdateNoLock(collectionUpdate);
                break;

            default:
                QueueUpdateNoLock(update);
                break;
        }
    }

    private void AppendExactValueUpdatesNoLock(RecursivePath path)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerProperties(path, out var materializedParameters);

        if (bindings.Count == 0)
            return;

        var value = TryGetControllerValue(path);

        // Every binding here reads the same path, so its row is asked once, by the first binding that needs the answer.
        bool? content = null;

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
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
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerDescendantProperties(path, out var baseParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, baseParameters, out var dynamicParameters))
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
        QueueUpdateNoLock(new ServerFullResyncUIUpdate());
    }
}
