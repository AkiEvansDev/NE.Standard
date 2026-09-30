using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;
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

        // A resync sends every value to every instance; a write held back from one would be held from nothing.
        _heldValues.Clear();
        _pendingFullResync = true;
        QueueUpdateNoLock(new ServerFullResyncUIUpdate());
    }
}
