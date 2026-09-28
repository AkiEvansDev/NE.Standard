using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <summary>
    /// Takes the queued updates a drain's change set carries. A runtime that sends as it drains takes the whole queue every turn;
    /// one that batches leaves it to its flush, takes it whole for the flush, and gives an answer its caller's copy.
    /// </summary>
    private ServerChangeSet TakePendingUpdatesNoLock(DrainTarget target)
    {
        if (SendsWhatItDrains || target.Whole)
            return DrainPendingUpdatesNoLock();

        return target.AnswerFor is { } instanceId
            ? AnswerPendingUpdatesNoLock(instanceId)
            : ServerChangeSet.Empty;
    }

    /// <summary>
    /// One caller's copy of the queue, without what it already holds. The queue keeps the updates for the flush to send every
    /// other attached instance, and the caller's mark moves past them so the flush does not send it them again.
    /// </summary>
    private ServerChangeSet AnswerPendingUpdatesNoLock(string instanceId)
    {
        // Nobody else to send them to: taken whole, and the flush has nothing left to do.
        if (!HasOtherAttachedInstance(instanceId))
            return ChangesFor(instanceId, DrainPendingUpdatesNoLock());

        if (_pendingUpdates.Count == 0)
            return ServerChangeSet.Empty;

        ServerChangeSet answer = ChangesFor(instanceId, CopyPendingUpdatesNoLock());

        MarkAnswered(instanceId, _updateSequence);

        return answer;
    }

    private ServerChangeSet DrainPendingUpdatesNoLock()
    {
        ServerChangeSet changes = CopyPendingUpdatesNoLock();

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
    private readonly record struct DrainTarget(bool Whole, string? AnswerFor)
    {
        /// <summary>Nobody in particular: a batching runtime leaves its queue to the flush.</summary>
        public static DrainTarget Leave => default;

        /// <summary>Every attached instance: the flush takes the whole queue.</summary>
        public static DrainTarget Flush => new(Whole: true, AnswerFor: null);

        /// <summary>One caller, whose answer carries its own copy of the queue.</summary>
        public static DrainTarget Answer(string instanceId) => new(Whole: false, instanceId);
    }

    private void ClearPendingUpdatesNoLock()
    {
        _pendingUpdates.Clear();
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
                AddPendingValueUpdateNoLock(ResolveServerValueUpdateNoLock(valueUpdate));
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

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(new ServerValueUIUpdate
            {
                Address = new(binding.Address.Component.Id, binding.Address.Property, dynamicParameters),
                Value = UIBoundValueConverter.Convert(value ?? binding.TargetFallbackValue, binding.TargetValueType)
            });
        }
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

            RecursivePath bindingPath = View.Bindings.MaterializePath(binding, baseParameters);
            var value = TryGetControllerValue(bindingPath);

            AddPendingUpdateNoLock(new ServerValueUIUpdate
            {
                Address = new(binding.Address.Component.Id, binding.Address.Property, dynamicParameters),
                Value = UIBoundValueConverter.Convert(value ?? binding.TargetFallbackValue, binding.TargetValueType)
            });
        }
    }

    private void AppendFullResyncNoLock()
    {
        ClearPendingUpdatesNoLock();

        // A resync sends every value to every instance; a write held back from one would be held from nothing.
        _heldValues.Clear();
        _pendingFullResync = true;
        QueueUpdateNoLock(new ServerFullResyncUIUpdate());
    }
}
