using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // Every address a value update was queued for since the queue was last emptied: one not here has nothing queued to replace, so the
    // queue is scanned only for an address written twice. One withdrawn since stays, and costs that address a scan for nothing.
    private readonly HashSet<UIPropertyAddress> _queuedValueAddresses = [];

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
            RemovePendingSubtreeUpdatesNoLock(update.Component.Id, update.Component.DynamicParameters);

        QueueUpdateNoLock(update);
    }

    private void RemovePendingSubtreeUpdatesNoLock(UIComponentId componentId, object?[] dynamicParameters)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            ServerUIUpdate existing = _pendingUpdates[i].Update;

            if (existing is ServerValueUIUpdate valueUpdate)
            {
                // Only an update inside the replaced item is withdrawn; a zero-parameter one is Root-scoped and belongs to the view.
                if (valueUpdate.Address.Component.DynamicParameters.Length > 0
                    && IsComponentInside(valueUpdate.Address.Component.Id, componentId)
                    && IsDynamicParameterPrefix(dynamicParameters, valueUpdate.Address.Component.DynamicParameters))
                {
                    _pendingUpdates.RemoveAt(i);
                }

                continue;
            }

            if (existing is ServerCollectionChangeUIUpdate collectionUpdate)
            {
                // The same rule: a zero-parameter collection update is the view's own and survives the row it is not inside.
                if (collectionUpdate.Component.DynamicParameters.Length > 0
                    && IsComponentInside(collectionUpdate.Component.Id, componentId)
                    && IsDynamicParameterPrefix(dynamicParameters, collectionUpdate.Component.DynamicParameters))
                {
                    _pendingUpdates.RemoveAt(i);
                }
            }
        }
    }
}
