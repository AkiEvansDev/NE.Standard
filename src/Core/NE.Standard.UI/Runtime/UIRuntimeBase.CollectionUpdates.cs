using System;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <summary>
    /// Withdraws updates still queued for an item a <see cref="RecursiveChangeKind.Replace"/> is about to replace.
    /// </summary>
    /// <remarks>
    /// The replacement itself travels as the ordinary collection <c>Replace</c> update that follows.
    /// </remarks>
    private void RemoveReplacedItemPendingUpdatesNoLock(RecursiveChange change)
    {
        if (_pendingFullResync)
            return;

        if (change.Index < 0 || change.Count <= 0)
            return;

        IReadOnlyList<CompiledUIBinding> collectionBindings = View.Bindings.GetControllerCollections(change.Path, out var materializedParameters);

        for (var bindingIndex = 0; bindingIndex < collectionBindings.Count; bindingIndex++)
        {
            CompiledUIBinding binding = collectionBindings[bindingIndex];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var ownerDynamicParameters))
                continue;

            for (var itemOffset = 0; itemOffset < change.Count; itemOffset++)
            {
                RemovePendingSubtreeUpdatesNoLock(
                    binding.Address.Component.Id,
                    AppendDynamicParameter(ownerDynamicParameters, GetOldCollectionItemParameter(change, itemOffset))
                );
            }
        }
    }

    private static string GetOldCollectionItemParameter(RecursiveChange change, int offset)
        => GetItemKey(change, offset, old: true) ?? throw MissingItemKeyException();

    /// <summary>
    /// A bound item collection change carried no item id; throwing here names the fault instead of silently addressing by position.
    /// </summary>
    private static InvalidOperationException MissingItemKeyException()
        => new($"A bound item collection change carried no item id. Every item must implement '{nameof(IBindableItem)}'.");

    private static string? GetItemKey(RecursiveChange change, int offset, bool old)
    {
        IReadOnlyList<string> ids = old ? change.OldItemIds : change.ItemIds;

        return (uint)offset < (uint)ids.Count
            ? ids[offset]
            : null;
    }

    /// <summary>
    /// Re-sends the one item whose changed property decides how the host draws it — the template key it is
    /// rendered by, or the group it belongs to.
    /// </summary>
    /// <remarks>
    /// Neither the template key nor the group is bound on the item, so only a full <c>Replace</c> update reaches the client's redraw rules.
    /// </remarks>
    private void AppendItemReplaceUpdatesNoLock(RecursivePath path)
    {
        if (path.Count < 3)
            return;

        PathSegment propertySegment = path[^1];
        PathSegment itemSegment = path[^2];

        if (propertySegment.Kind != PathSegmentKind.Property || itemSegment.Kind == PathSegmentKind.Property)
            return;

        RecursivePath collectionPath = new(path.AsSpan()[..^2].ToArray(), ownsArray: true);
        IReadOnlyList<CompiledUIBinding> collectionBindings = View.Bindings.GetControllerCollections(collectionPath, out var materializedParameters);

        if (collectionBindings.Count == 0)
            return;

        object? item = null;

        for (var i = 0; i < collectionBindings.Count; i++)
        {
            CompiledUIBinding binding = collectionBindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!IsTemplateKeyProperty(binding.Address.Component.Id, propertySegment.Property) &&
                !IsGroupProperty(binding.Address.Component.Id, propertySegment.Property))
            {
                continue;
            }

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            item ??= TryGetControllerValue(new RecursivePath(path.AsSpan()[..^1].ToArray(), ownsArray: true));

            if (item is null)
                continue;

            var itemKey = (itemSegment.Kind == PathSegmentKind.Key ? itemSegment.Key : TryGetItemKey(item))
                ?? throw MissingItemKeyException();

            // Still needed: the item's position, since the addressing above is by key, not index.
            var itemIndex = itemSegment.Kind == PathSegmentKind.Index
                ? itemSegment.Index
                : TryGetItemIndex(TryGetControllerValue(collectionPath), item);

            RemovePendingSubtreeUpdatesNoLock(
                binding.Address.Component.Id,
                AppendDynamicParameter(dynamicParameters, itemKey)
            );

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Replace,
                Component = new(binding.Address.Component.Id, dynamicParameters),
                Items =
                [
                    new ServerCollectionItemChange
                    {
                        Index = itemIndex,
                        Key = itemKey,
                        OldKey = itemKey,
                        Item = item
                    }
                ],
                Moves = []
            });
        }
    }

    private bool IsTemplateKeyProperty(UIComponentId componentId, string propertyName)
    {
        return View.State.TryGetValue(componentId, ITemplatedComponent.TemplateKeyPropertyProperty, out CompiledUIPropertyValue? value) &&
               !value.IsBind &&
               value.Value is string templateKeyProperty &&
               string.Equals(templateKeyProperty, propertyName, StringComparison.Ordinal);
    }

    /// <summary>
    /// Whether the property is the item's group, on a host that actually draws groups.
    /// </summary>
    /// <remarks>
    /// Gated on the group template; a host without one lays items out flat regardless.
    /// </remarks>
    private bool IsGroupProperty(UIComponentId componentId, string propertyName)
        => string.Equals(propertyName, nameof(IBindableGroup.Group), StringComparison.Ordinal) &&
           View.Graph.TryGetSlot(componentId, UIComponentSlotKind.GroupTemplate, out _);

    private static int? TryGetItemIndex(object? collection, object item)
    {
        if (collection is not System.Collections.IEnumerable enumerable)
            return null;

        var index = 0;

        foreach (var candidate in enumerable)
        {
            if (ReferenceEquals(candidate, item))
                return index;

            index++;
        }

        return null;
    }

    private void AppendCollectionResetUpdateNoLock(RecursiveChange change)
        => AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Reset);

    private void AppendCollectionUpdateNoLock(RecursiveChange change, CollectionUpdateAction action)
    {
        if (_pendingFullResync)
            return;

        RecursivePath collectionPath = change.Path;
        IReadOnlyList<CompiledUIBinding> collectionBindings = View.Bindings.GetControllerCollections(collectionPath, out var materializedParameters);

        for (var i = 0; i < collectionBindings.Count; i++)
        {
            CompiledUIBinding binding = collectionBindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            if (action == CollectionUpdateAction.Remove)
                RemovePendingRemovedCollectionItemUpdatesNoLock(binding.Address.Component.Id, dynamicParameters, change);

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = action,
                Component = new(binding.Address.Component.Id, dynamicParameters),
                Items = BuildCollectionItemChanges(collectionPath, change, action),
                Moves = BuildCollectionMoveChanges(collectionPath, change, action)
            });
        }
    }

    private void RemovePendingRemovedCollectionItemUpdatesNoLock(UIComponentId componentId, object?[] ownerDynamicParameters, RecursiveChange change)
    {
        for (var itemOffset = 0; itemOffset < change.Count; itemOffset++)
        {
            RemovePendingSubtreeUpdatesNoLock(
                componentId,
                AppendDynamicParameter(ownerDynamicParameters, GetOldCollectionItemParameter(change, itemOffset))
            );
        }
    }

    private ServerCollectionItemChange[] BuildCollectionItemChanges(RecursivePath collectionPath, RecursiveChange change, CollectionUpdateAction action)
    {
        if (action is CollectionUpdateAction.Reset or CollectionUpdateAction.Move)
            return [];

        if (change.Count <= 0)
            return [];

        ServerCollectionItemChange[] result = new ServerCollectionItemChange[change.Count];

        for (var i = 0; i < result.Length; i++)
        {
            var index = change.Index + i;
            var key = GetItemKey(change, i, old: false);

            var item = action is CollectionUpdateAction.Insert or CollectionUpdateAction.Replace
                ? ResolveChangedItem(collectionPath, key, index)
                : null;

            result[i] = action switch
            {
                CollectionUpdateAction.Insert => new ServerCollectionItemChange
                {
                    Index = index,
                    Key = key ?? TryGetItemKey(item),
                    Item = item
                },

                CollectionUpdateAction.Remove => new ServerCollectionItemChange
                {
                    Index = index,
                    Key = GetItemKey(change, i, old: true)
                },

                CollectionUpdateAction.Replace => new ServerCollectionItemChange
                {
                    Index = index,
                    Key = key ?? TryGetItemKey(item),
                    OldKey = GetItemKey(change, i, old: true),
                    Item = item
                },

                _ => throw new UnreachableException()
            };
        }

        return result;
    }

    /// <summary>
    /// The item a collection change carries, addressed by the key recorded when the change was raised.
    /// </summary>
    /// <remarks>
    /// Falls back to index only when the change carried no key; by flush time a later change in the same batch may have moved items.
    /// </remarks>
    private object? ResolveChangedItem(RecursivePath collectionPath, string? key, int index)
        => TryGetControllerValue(key is null ? collectionPath.AppendIndex(index) : collectionPath.AppendKey(key));

    private static string? TryGetItemKey(object? item)
        => item is IBindableItem { Id: { Length: > 0 } id } ? id : null;

    private ServerCollectionMoveChange[] BuildCollectionMoveChanges(RecursivePath collectionPath, RecursiveChange change, CollectionUpdateAction action)
    {
        if (action != CollectionUpdateAction.Move)
            return [];

        if (change.Count <= 0)
            return [];

        ServerCollectionMoveChange[] result = new ServerCollectionMoveChange[change.Count];

        for (var i = 0; i < result.Length; i++)
        {
            var newIndex = change.Index + i;
            var item = TryGetControllerValue(collectionPath.AppendIndex(newIndex));

            result[i] = new ServerCollectionMoveChange
            {
                OldIndex = change.OldIndex + i,
                NewIndex = newIndex,
                Key = GetItemKey(change, i, old: false) ?? TryGetItemKey(item)
            };
        }

        return result;
    }
}
