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
    private void AppendCollectionItemContextRebuildUpdatesNoLock(RecursiveChange change)
    {
        if (_pendingFullResync)
            return;

        if (change.Index < 0 || change.Count <= 0)
            return;

        RecursivePath collectionPath = change.Path;
        IReadOnlyList<CompiledUIBinding> collectionBindings = View.Bindings.GetControllerCollections(collectionPath, out var materializedParameters);

        if (collectionBindings.Count == 0)
            return;

        for (var bindingIndex = 0; bindingIndex < collectionBindings.Count; bindingIndex++)
        {
            CompiledUIBinding binding = collectionBindings[bindingIndex];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var ownerDynamicParameters))
                continue;

            for (var itemOffset = 0; itemOffset < change.Count; itemOffset++)
            {
                if (change.Kind == RecursiveChangeKind.Replace)
                {
                    RemovePendingSubtreeUpdatesNoLock(
                        binding.Address.Component.Id,
                        AppendDynamicParameter(ownerDynamicParameters, GetOldCollectionItemParameter(change, itemOffset))
                    );
                }

                var itemIndex = change.Index + itemOffset;
                var itemParameter = GetItemKey(change, itemOffset, old: false)
                    ?? GetCollectionItemParameter(collectionPath, itemIndex);
                var itemContext = ResolveChangedItem(collectionPath, itemParameter, itemIndex);

                AddPendingUpdateNoLock(new ServerContextRebuildUIUpdate
                {
                    Component = new(binding.Address.Component.Id, AppendDynamicParameter(ownerDynamicParameters, itemParameter)),
                    Context = itemContext
                });
            }
        }
    }

    private static string GetOldCollectionItemParameter(RecursiveChange change, int offset)
        => GetItemKey(change, offset, old: true) ?? throw MissingItemKeyException();

    /// <summary>
    /// A bound item collection is keyed by construction — the compiler refuses a non-<see cref="IBindableItem"/>
    /// element type and the renderer refuses a non-keyed item — so reaching here means a change carried no ids
    /// where the binding says it must. Throwing names that, instead of quietly addressing the item by position
    /// and acting on the wrong one after the next insert.
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

    private string GetCollectionItemParameter(RecursivePath collectionPath, int index)
        => TryGetItemKey(TryGetControllerValue(collectionPath.AppendIndex(index))) ?? throw MissingItemKeyException();

    private void AppendTemplateKeyItemReplaceUpdatesNoLock(RecursivePath path)
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

            if (!IsTemplateKeyProperty(binding.Address.Component.Id, propertySegment.Property))
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            item ??= TryGetControllerValue(new RecursivePath(path.AsSpan()[..^1].ToArray(), ownsArray: true));

            if (item is null)
                continue;

            var itemKey = (itemSegment.Kind == PathSegmentKind.Key ? itemSegment.Key : TryGetItemKey(item))
                ?? throw MissingItemKeyException();

            // Still the item's position in the collection, which the client needs to place the replacement —
            // the addressing above is by key, this is not.
            var itemIndex = itemSegment.Kind == PathSegmentKind.Index
                ? itemSegment.Index
                : TryGetItemIndex(TryGetControllerValue(collectionPath), item);

            RemovePendingSubtreeUpdatesNoLock(
                binding.Address.Component.Id,
                AppendDynamicParameter(dynamicParameters, itemKey)
            );

            AddPendingUpdateNoLock(new ServerContextRebuildUIUpdate
            {
                Component = new(binding.Address.Component.Id, AppendDynamicParameter(dynamicParameters, itemKey)),
                Context = item
            });

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
    /// By index only when a change carried no keys at all. Changes are buffered on the controller and turned
    /// into updates when the runtime flushes, so by then a later change in the same batch may have moved
    /// everything past this one: an extending window that trims its far side removes fifty items from the
    /// front after appending fifty at the back, and each appended item was then read from whatever now stood
    /// at its old index &#8212; or from past the end, which sent an item with no values at all.
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
