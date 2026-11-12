using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    // Latest slot in _pendingUpdates for each queued property address, single-item collection Replace, and row scope, so repeated writes
    // and row redraws supersede in O(1) without scanning or shifting the queue.
    private readonly Dictionary<UIPropertyAddress, int> _queuedValueIndices = [];
    private readonly Dictionary<(UIComponentAddress Host, string Key), int> _queuedRowReplaces = [];
    private readonly Dictionary<(UIComponentId HostId, string RowKey), List<int>> _rowChildUpdateIndices = [];
    private int _pendingUpdateCount;

    // Past this many updates queued for one host, and past its rows, a row withdrawn from it sends its list whole instead: four times the
    // whole queue of the heaviest page in ordinary use, which never reaches it, while a list rewritten wholesale stops reading the queue
    // once a row.
    private const int CrowdedHostUpdates = 512;

    /// <summary>Queues a value update in place of one still queued for the same address, which it supersedes.</summary>
    private void AddPendingValueUpdateNoLock(ServerValueUIUpdate update)
    {
        if (_queuedValueIndices.TryGetValue(update.Address, out var existingIndex)
            && (uint)existingIndex < (uint)_pendingUpdates.Count
            && _pendingUpdates[existingIndex].Update is ServerValueUIUpdate existing
            && existing.Address.Equals(update.Address))
        {
            SupersedePendingAtNoLock(existingIndex);
        }

        var index = QueueUpdateNoLock(update);
        _queuedValueIndices[update.Address] = index;
        NoteRowScopesNoLock(update.Address.Component, index);
    }

    private void AddPendingCollectionUpdateNoLock(ServerCollectionChangeUIUpdate update)
    {
        // A collection inside a template variant the row does not wear has no host on the page: not sent, not warned about.
        if (!IsStampedFor(update.Component))
            return;

        // A reset empties the host, so what was queued for it and its rows before is moot: a row drawn in a new variant sends its
        // list whole, and a command that then clears and refills the list would otherwise send it twice.
        if (update.Action == CollectionUpdateAction.Reset)
        {
            WithdrawHostNoLock(update.Component.Id, update.Component.DynamicParameters);
            var resetIndex = QueueUpdateNoLock(update);
            NoteRowScopesNoLock(update.Component, resetIndex);
            return;
        }

        if (TryGetSingleReplacedKey(update, out var replacedKey))
        {
            (UIComponentAddress Component, string Key) row = (update.Component, replacedKey);

            if (_queuedRowReplaces.TryGetValue(row, out var existingIndex)
                && (uint)existingIndex < (uint)_pendingUpdates.Count
                && _pendingUpdates[existingIndex].Update is ServerCollectionChangeUIUpdate existing
                && existing.Component.Equals(update.Component)
                && TryGetSingleReplacedKey(existing, out var existingKey)
                && string.Equals(existingKey, replacedKey, StringComparison.Ordinal))
            {
                SupersedePendingAtNoLock(existingIndex);
            }

            var replaceIndex = QueueUpdateNoLock(update);
            _queuedRowReplaces[row] = replaceIndex;
            NoteRowScopesNoLock(update.Component, replaceIndex);
            return;
        }

        var queuedIndex = QueueUpdateNoLock(update);
        NoteRowScopesNoLock(update.Component, queuedIndex);
    }

    private static bool TryGetSingleReplacedKey(ServerCollectionChangeUIUpdate update, [NotNullWhen(true)] out string? key)
    {
        if (update.Action == CollectionUpdateAction.Replace
            && update.Items.Length == 1
            && (update.Items[0].OldKey ?? update.Items[0].Key) is { Length: > 0 } singleKey)
        {
            key = singleKey;
            return true;
        }

        key = null;
        return false;
    }

    private void SupersedePendingAtNoLock(int index)
    {
        if ((uint)index < (uint)_pendingUpdates.Count && _pendingUpdates[index].Update is not null)
        {
            _pendingUpdates[index] = default;
            _pendingUpdateCount--;
        }
    }

    private void NoteRowScopesNoLock(UIComponentAddress address, int index)
    {
        var parameters = address.DynamicParameters;

        if (parameters.Length == 0)
            return;

        IReadOnlyList<UIComponentId> scopes = View.Graph.GetItemScopes(address.Id);
        var limit = Math.Min(scopes.Count, parameters.Length);

        for (var depth = 0; depth < limit; depth++)
        {
            if (parameters[depth] is not string rowKey
                || !View.Graph.TryGet(scopes[depth], out UIComponentNode? root)
                || root.ParentId is not UIComponentId hostId)
            {
                continue;
            }

            if (!_rowChildUpdateIndices.TryGetValue((hostId, rowKey), out List<int>? indices))
            {
                indices = [];
                _rowChildUpdateIndices.Add((hostId, rowKey), indices);
            }

            indices.Add(index);
        }
    }

    /// <summary>Withdraws child updates queued inside a single row of <paramref name="hostId"/> without scanning the whole queue.</summary>
    private void WithdrawChildUpdatesOfRowNoLock(UIComponentId hostId, object?[] ownerParameters, string rowKey)
    {
        if (!_rowChildUpdateIndices.TryGetValue((hostId, rowKey), out List<int>? indices))
            return;

        if (ownerParameters.Length == 0)
        {
            for (var i = 0; i < indices.Count; i++)
                SupersedePendingAtNoLock(indices[i]);

            _ = _rowChildUpdateIndices.Remove((hostId, rowKey));
            return;
        }

        var kept = 0;

        for (var i = 0; i < indices.Count; i++)
        {
            var index = indices[i];

            if ((uint)index >= (uint)_pendingUpdates.Count || _pendingUpdates[index].Update is not { } existing)
                continue;

            if (IsHostsUpdate(existing, hostId, ownerParameters, out var existingKey) && existingKey is string key && string.Equals(key, rowKey, StringComparison.Ordinal))
                SupersedePendingAtNoLock(index);
            else
                indices[kept++] = index;
        }

        if (kept == 0)
            _ = _rowChildUpdateIndices.Remove((hostId, rowKey));
        else
            indices.RemoveRange(kept, indices.Count - kept);
    }

    /// <summary>Restores saved updates back into the queue and rebuilds the coalescing indexes.</summary>
    private void RestorePendingUpdatesNoLock(List<PendingUpdate> updates)
    {
        for (var i = 0; i < updates.Count; i++)
        {
            PendingUpdate pending = updates[i];

            if (pending.Update is not { } update)
                continue;

            var index = _pendingUpdates.Count;
            _pendingUpdates.Add(pending);
            _pendingUpdateCount++;

            if (update is ServerValueUIUpdate value)
            {
                _queuedValueIndices[value.Address] = index;
                NoteRowScopesNoLock(value.Address.Component, index);
            }
            else if (update is ServerCollectionChangeUIUpdate collection)
            {
                if (TryGetSingleReplacedKey(collection, out var key))
                    _queuedRowReplaces[(collection.Component, key)] = index;

                NoteRowScopesNoLock(collection.Component, index);
            }
        }
    }

    /// <summary>Withdraws, in one pass over the queue, everything queued for a host: its own list's updates and its rows'.</summary>
    private void WithdrawHostNoLock(UIComponentId hostId, object?[] ownerParameters)
    {
        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            if (_pendingUpdates[i].Update is { } existing && IsHostsUpdate(existing, hostId, ownerParameters, out _))
                SupersedePendingAtNoLock(i);
        }
    }

    /// <summary>
    /// Whether an update is a host's: one of its own list, or one inside a row of it — a component its template holds, under its owner
    /// keys, then the row's; <paramref name="rowKey"/> is that row's key, null for the list's own. A zero-key value is Root-scoped and
    /// belongs to the view, whatever template it stands in.
    /// </summary>
    private bool IsHostsUpdate(ServerUIUpdate update, UIComponentId hostId, object?[] ownerParameters, out object? rowKey)
    {
        rowKey = null;

        UIComponentAddress address;

        switch (update)
        {
            case ServerCollectionChangeUIUpdate collection:
                address = collection.Component;
                break;
            case ServerValueUIUpdate value:
                address = value.Address.Component;
                break;
            default:
                return false;
        }

        var parameters = address.DynamicParameters;

        if (parameters.Length < ownerParameters.Length || !IsDynamicParameterPrefix(ownerParameters, parameters))
            return false;

        if (parameters.Length == ownerParameters.Length)
        {
            if (update is not ServerCollectionChangeUIUpdate hostCollection || !address.Id.Equals(hostId))
                return false;

            if (TryGetSingleReplacedKey(hostCollection, out var singleKey))
                rowKey = singleKey;

            return true;
        }

        if (!IsComponentInside(address.Id, hostId))
            return false;

        rowKey = parameters[ownerParameters.Length];

        return true;
    }

    /// <summary>
    /// Withdraws, in one pass over the queue, what is queued under the given rows of a host; answers whether the host is crowded — it
    /// held more than <see cref="CrowdedHostUpdates"/> updates and more than its list at <paramref name="collectionPath"/> has rows —
    /// past which the caller sends its list whole instead.
    /// </summary>
    /// <remarks>
    /// Each withdrawal reads the whole queue: a host thousands of whose rows changed and went one at a time read it once per row,
    /// quadratic under the state lock. Its list whole costs one read of its rows, and its later changes of the round are skipped — but
    /// only where it is the smaller thing to send: a long list a few hundred of whose cells changed would be drawn anew, every row, and a
    /// row drawn anew loses the reader's focus, caret, popup and cursor in it.
    /// </remarks>
    private bool WithdrawRowsNoLock(UIComponentId hostId, object?[] ownerParameters, IReadOnlyList<string> keys, RecursivePath collectionPath)
    {
        // A few keys are compared in place; a range's many are looked up.
        HashSet<string>? lookup = keys.Count > 8 ? new(keys, StringComparer.Ordinal) : null;
        var held = 0;

        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            if (_pendingUpdates[i].Update is not { } existing)
                continue;

            if (IsHostsUpdate(existing, hostId, ownerParameters, out var rowKey))
            {
                held++;

                // A key carried as anything but text names no row (a forged address), and is no row of these.
                if (rowKey is string key && (lookup?.Contains(key) ?? Contains(keys, key)))
                    SupersedePendingAtNoLock(i);
            }
        }

        return held > CrowdedHostUpdates && held > CountRows(collectionPath);
    }

    /// <summary>How many rows the list at <paramref name="collectionPath"/> holds; none where it is no recursive collection.</summary>
    private int CountRows(RecursivePath collectionPath)
        => TryGetControllerValue(collectionPath) is IRecursiveCollection rows ? rows.Count : 0;

    private static bool Contains(IReadOnlyList<string> keys, string key)
    {
        for (var i = 0; i < keys.Count; i++)
        {
            if (string.Equals(keys[i], key, StringComparison.Ordinal))
                return true;
        }

        return false;
    }
}
