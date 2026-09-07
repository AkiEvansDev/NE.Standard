using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private void AddPendingValueUpdateNoLock(ServerValueUIUpdate update)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            if (_pendingUpdates[i] is not ServerValueUIUpdate existing)
                continue;

            if (!existing.Address.Component.Id.Equals(update.Address.Component.Id) || !existing.Address.Property.Equals(update.Address.Property))
                continue;

            if (!AreDynamicParametersEqual(existing.Address.Component.DynamicParameters, update.Address.Component.DynamicParameters))
                continue;

            _pendingUpdates.RemoveAt(i);
            break;
        }

        _pendingUpdates.Add(update);
    }

    private void AddPendingCollectionUpdateNoLock(ServerCollectionChangeUIUpdate update)
    {
        // A collection inside a template variant the row does not wear has no host on the page: not sent, not warned about.
        if (IsStampedFor(update.Component))
            _pendingUpdates.Add(update);
    }

    private void RemovePendingSubtreeUpdatesNoLock(UIComponentId componentId, object?[] dynamicParameters)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            ServerUIUpdate existing = _pendingUpdates[i];

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
                if (IsComponentInside(collectionUpdate.Component.Id, componentId) && IsDynamicParameterPrefix(dynamicParameters, collectionUpdate.Component.DynamicParameters))
                    _pendingUpdates.RemoveAt(i);
            }
        }
    }
}
