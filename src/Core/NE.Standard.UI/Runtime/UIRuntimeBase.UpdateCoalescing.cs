using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private void AddPendingContextRebuildUpdateNoLock(ServerContextRebuildUIUpdate update)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            ServerUIUpdate existing = _pendingUpdates[i];

            if (existing is ServerContextRebuildUIUpdate existingContextRebuild)
            {
                if (IsSameContextRebuild(existingContextRebuild, update))
                {
                    _pendingUpdates.RemoveAt(i);
                    continue;
                }

                if (IsComponentInside(existingContextRebuild.Component.Id, update.Component.Id) && IsDynamicParameterPrefix(update.Component.DynamicParameters, existingContextRebuild.Component.DynamicParameters))
                    _pendingUpdates.RemoveAt(i);

                continue;
            }

            if (existing is ServerValueUIUpdate existingValue)
            {
                // Only an update carrying dynamic parameters of its own is dropped. A zero-parameter one
                // (a Root-scoped binding that merely sits inside an item template) is not part of the
                // rebuilt subtree, and ContextRebuild is still a client-side no-op — dropping it would lose
                // the value outright. See docs/PROJECT.md §4.
                if (existingValue.Address.Component.DynamicParameters.Length > 0
                    && IsComponentInside(existingValue.Address.Component.Id, update.Component.Id)
                    && IsDynamicParameterPrefix(update.Component.DynamicParameters, existingValue.Address.Component.DynamicParameters))
                {
                    _pendingUpdates.RemoveAt(i);
                }

                continue;
            }

            if (existing is ServerCollectionChangeUIUpdate existingCollection)
            {
                if (AreComponentAddressesEqual(existingCollection.Component, update.Component))
                    _pendingUpdates.RemoveAt(i);
            }
        }

        _pendingUpdates.Add(update);
    }

    private static bool IsSameContextRebuild(ServerContextRebuildUIUpdate left, ServerContextRebuildUIUpdate right)
        => AreComponentAddressesEqual(left.Component, right.Component);

    private static bool AreComponentAddressesEqual(UIComponentAddress left, UIComponentAddress right)
        => left.Id.Equals(right.Id) && AreDynamicParametersEqual(left.DynamicParameters, right.DynamicParameters);

    private void AddPendingValueUpdateNoLock(ServerValueUIUpdate update)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            if (_pendingUpdates[i] is ServerContextRebuildUIUpdate existingContextRebuild)
            {
                // Mirror of the rule above: a value update with no dynamic parameters of its own is never
                // suppressed by a pending ContextRebuild it happens to sit inside.
                if (update.Address.Component.DynamicParameters.Length > 0
                    && IsComponentInside(update.Address.Component.Id, existingContextRebuild.Component.Id)
                    && IsDynamicParameterPrefix(existingContextRebuild.Component.DynamicParameters, update.Address.Component.DynamicParameters))
                {
                    return;
                }

                continue;
            }

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
        => _pendingUpdates.Add(update);

    private void RemovePendingSubtreeUpdatesNoLock(UIComponentId componentId, object?[] dynamicParameters)
    {
        for (var i = _pendingUpdates.Count - 1; i >= 0; i--)
        {
            ServerUIUpdate existing = _pendingUpdates[i];

            if (existing is ServerContextRebuildUIUpdate contextRebuild)
            {
                if (IsComponentInside(contextRebuild.Component.Id, componentId) && IsDynamicParameterPrefix(dynamicParameters, contextRebuild.Component.DynamicParameters))
                    _pendingUpdates.RemoveAt(i);

                continue;
            }

            if (existing is ServerValueUIUpdate valueUpdate)
            {
                // Same carve-out: only updates addressed within the rebuilt subtree are withdrawn.
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
