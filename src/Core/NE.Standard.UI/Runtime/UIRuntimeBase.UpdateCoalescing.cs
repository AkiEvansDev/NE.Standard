using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // Every address a value update was queued for since the queue was last emptied: one not here has nothing queued to replace, so the
    // queue is scanned only for an address written twice. One withdrawn since stays, and costs that address a scan for nothing.
    private readonly HashSet<UIPropertyAddress> _queuedValueAddresses = [];

    // Past this many updates queued for one host, and past its rows, a row withdrawn from it sends its list whole instead: four times the
    // whole queue of the heaviest page in ordinary use, which never reaches it, while a list rewritten wholesale stops reading the queue
    // once a row.
    private const int CrowdedHostUpdates = 512;

    /// <summary>Queues a value update in place of one still queued for the same address, which it supersedes.</summary>
    private void AddPendingValueUpdateNoLock(ServerValueUIUpdate update)
    {
        if (!_queuedValueAddresses.Add(update.Address))
        {
            for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
            {
                if (_pendingUpdates[i].Update is ServerValueUIUpdate existing && existing.Address.Equals(update.Address))
                {
                    _pendingUpdates.RemoveAt(i);
                    break;
                }
            }
        }

        QueueUpdateNoLock(update);
    }

    /// <summary>Notes the value updates put back in the queue, which <see cref="AddPendingValueUpdateNoLock"/> must still find.</summary>
    private void NoteQueuedValueAddressesNoLock(List<PendingUpdate> updates)
    {
        for (var i = 0; i < updates.Count; i++)
        {
            if (updates[i].Update is ServerValueUIUpdate value)
                _ = _queuedValueAddresses.Add(value.Address);
        }
    }

    private void AddPendingCollectionUpdateNoLock(ServerCollectionChangeUIUpdate update)
    {
        // A collection inside a template variant the row does not wear has no host on the page: not sent, not warned about.
        if (!IsStampedFor(update.Component))
            return;

        // A reset empties the host, so what was queued for it and its rows before is moot: a row drawn in a new variant sends its
        // list whole, and a command that then clears and refills the list would otherwise send it twice.
        if (update.Action == CollectionUpdateAction.Reset)
            WithdrawHostNoLock(update.Component.Id, update.Component.DynamicParameters);

        QueueUpdateNoLock(update);
    }

    /// <summary>Withdraws, in one pass over the queue, everything queued for a host: its own list's updates and its rows'.</summary>
    private void WithdrawHostNoLock(UIComponentId hostId, object?[] ownerParameters)
    {
        var kept = 0;

        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            PendingUpdate pending = _pendingUpdates[i];

            if (IsHostsUpdate(pending.Update, hostId, ownerParameters, out _))
                continue;

            _pendingUpdates[kept++] = pending;
        }

        _pendingUpdates.RemoveRange(kept, _pendingUpdates.Count - kept);
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
            return update is ServerCollectionChangeUIUpdate && address.Id.Equals(hostId);

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
        var kept = 0;

        for (var i = 0; i < _pendingUpdates.Count; i++)
        {
            PendingUpdate pending = _pendingUpdates[i];

            if (IsHostsUpdate(pending.Update, hostId, ownerParameters, out var rowKey))
            {
                held++;

                // A key carried as anything but text names no row (a forged address), and is no row of these.
                if (rowKey is string key && (lookup?.Contains(key) ?? Contains(keys, key)))
                    continue;
            }

            _pendingUpdates[kept++] = pending;
        }

        _pendingUpdates.RemoveRange(kept, _pendingUpdates.Count - kept);

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
