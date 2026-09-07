using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    protected async Task<ServerChangeSet> PublishExternalControllerChangesAsync(RecursiveChange[] changes, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(changes);

        if (changes.Length == 0 && Interlocked.CompareExchange(ref _fullResyncRequested, 0, 0) == 0)
            return ServerChangeSet.Empty;

        ServerChangeSet changeSet;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (!IsStarted || IsStopped)
                return ServerChangeSet.Empty;

            if (Interlocked.Exchange(ref _fullResyncRequested, 0) == 1)
            {
                AppendFullResyncNoLock();
            }
            else
            {
                for (var i = 0; i < changes.Length; i++)
                {
                    ArgumentNullException.ThrowIfNull(changes[i]);
                    AppendControllerChangeNoLock(changes[i]);
                }
            }

            changeSet = DrainPendingUpdatesForRuntimeModeNoLock(force: false);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return await PublishChangesAsync(changeSet, cancellationToken).ConfigureAwait(false);
    }

    private void AppendControllerChangeNoLock(RecursiveChange change)
    {
        ArgumentNullException.ThrowIfNull(change);

        switch (change.Kind)
        {
            case RecursiveChangeKind.Set:
                AppendSetUpdatesNoLock(change.Path);
                AppendSwappedCollectionUpdatesNoLock(change.Path);
                break;

            case RecursiveChangeKind.Reset:
                AppendCollectionResetUpdateNoLock(change);
                break;

            case RecursiveChangeKind.Replace:
                RemoveReplacedItemPendingUpdatesNoLock(change);
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Replace);
                AppendInsertedItemCollectionsNoLock(change);
                break;

            case RecursiveChangeKind.Add:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Insert);
                AppendInsertedItemCollectionsNoLock(change);
                break;

            case RecursiveChangeKind.Remove:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Remove);
                break;

            case RecursiveChangeKind.Move:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Move);
                break;

            default:
                throw new UnreachableException();
        }
    }

    /// <summary>
    /// The rows a collection just gained carry collections of their own — a message with its attachments — which reach the
    /// client as inserts of their own, addressed by the row's key; without them the row is stamped and its nested host stays empty.
    /// </summary>
    private void AppendInsertedItemCollectionsNoLock(RecursiveChange change)
    {
        for (var i = 0; i < change.Count; i++)
        {
            var key = GetItemKey(change, i, old: false);

            if (key is not null)
                AppendDescendantCollectionUpdatesNoLock(change.Path.AppendKey(key));
        }
    }

    /// <summary>
    /// Every bound collection under an item's path, sent whole; a collection under one of those rows is reached the same way.
    /// </summary>
    private void AppendDescendantCollectionUpdatesNoLock(RecursivePath path)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerDescendantCollections(path, out var baseParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            // A collection two rows down wants two keys; it is reached from its own row below, not from here.
            if (!TryBuildDynamicParameters(binding, baseParameters, out var dynamicParameters))
                continue;

            RecursivePath bindingPath = View.Bindings.MaterializePath(binding, baseParameters);
            UIComponentAddress component = new(binding.Address.Component.Id, dynamicParameters);

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Reset,
                Component = component,
                Items = []
            });

            if (!TryBuildCollectionItems(bindingPath, out ServerCollectionItemChange[] items) || items.Length == 0)
                continue;

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Insert,
                Component = component,
                Items = items
            });

            for (var j = 0; j < items.Length; j++)
            {
                if (items[j].Key is string nestedKey)
                    AppendDescendantCollectionUpdatesNoLock(bindingPath.AppendKey(nestedKey));
            }
        }
    }

    /// <summary>
    /// Whether the collection host an update addresses is on the page: the row it sits in wears the template variant it belongs to.
    /// </summary>
    private bool IsStampedFor(UIComponentAddress component)
    {
        if (component.DynamicParameters.Length == 0 || !View.Bindings.TryGetCollection(component.Id, out CompiledUIBinding? binding))
            return true;

        var parameters = new object[component.DynamicParameters.Length];

        for (var i = 0; i < parameters.Length; i++)
            parameters[i] = component.DynamicParameters[i] ?? string.Empty;

        // The row is the path up to its last key or index; what follows names the collection inside it.
        ReadOnlySpan<PathSegment> segments = View.Bindings.MaterializePath(binding, parameters).AsSpan();
        var rowLength = 0;

        for (var i = 0; i < segments.Length; i++)
        {
            if (segments[i].Kind is PathSegmentKind.Key or PathSegmentKind.Index)
                rowLength = i + 1;
        }

        return rowLength == 0 || IsStampedForItem(component.Id, TryGetControllerValue(new RecursivePath(segments[..rowLength].ToArray(), ownsArray: true)));
    }

    /// <summary>
    /// Whether a component inside an items template is on the page for this row: the row wears its own key's variant when
    /// there is one, else the host's fallback, else the default template — the same choice the renderer and the client make.
    /// A variant the key property could never name (a menu's Submenu beside its Kind variants) is a slot every row wears.
    /// </summary>
    private bool IsStampedForItem(UIComponentId componentId, object? item)
    {
        UIComponentGraph graph = View.Graph;

        if (!graph.TryGet(componentId, out UIComponentNode? node))
            return true;

        while (node.ParentId is UIComponentId parentId)
        {
            if (!graph.TryGet(parentId, out UIComponentNode? parent))
                return true;

            foreach (UIComponentSlot slot in parent.Slots)
            {
                if (slot.RootComponentId != node.ComponentId || slot.Kind is not (UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant))
                    continue;

                var worn = ResolveWornVariant(parent.ComponentId, item);

                return slot.Kind == UIComponentSlotKind.TemplateVariant
                    ? string.Equals(slot.Key, worn, StringComparison.Ordinal) || !IsKeyValue(parent.ComponentId, item, slot.Key)
                    : worn is null;
            }

            node = parent;
        }

        return true;
    }

    private string? ResolveWornVariant(UIComponentId hostId, object? item)
    {
        var keyProperty = ReadStaticString(hostId, ITemplatedComponent.TemplateKeyPropertyProperty);
        var fallback = ReadStaticString(hostId, ITemplatedComponent.FallbackTemplateKeyProperty);

        if (keyProperty is not null && ReadItemProperty(item, keyProperty) is { Length: > 0 } key && View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, key))
            return key;

        return fallback is not null && View.Graph.TryGetSlot(hostId, UIComponentSlotKind.TemplateVariant, out _, fallback) ? fallback : null;
    }

    /// <summary>
    /// Whether the host's key property could take this variant's key: an enum-typed key property names exactly its members, any
    /// other type may name anything.
    /// </summary>
    private bool IsKeyValue(UIComponentId hostId, object? item, string? key)
    {
        if (key is null || item is null || ReadStaticString(hostId, ITemplatedComponent.TemplateKeyPropertyProperty) is not { } keyProperty)
            return true;

        Type? type = item.GetType().GetProperty(keyProperty)?.PropertyType;

        if (type is null)
            return true;

        type = Nullable.GetUnderlyingType(type) ?? type;

        return !type.IsEnum || Enum.IsDefined(type, key) || Array.IndexOf(Enum.GetNames(type), key) >= 0;
    }

    private string? ReadStaticString(UIComponentId componentId, UIProperty property)
        => View.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? value) && !value.IsBind && value.Value is string text && text.Length > 0
            ? text
            : null;

    private static string? ReadItemProperty(object? item, string propertyName)
    {
        if (item is RecursiveObservable observable)
            return observable.TryGetRecursiveValue(propertyName, out var value) ? value?.ToString() : null;

        return item?.GetType().GetProperty(propertyName)?.GetValue(item)?.ToString();
    }

    /// <summary>
    /// Re-sends a bound collection whose whole instance was assigned, as a reset followed by its items.
    /// </summary>
    /// <remarks>
    /// Needed because <see cref="RecursiveChangeKind.Reset"/> fires only from inside a collection, not when the instance is <c>Set</c>.
    /// </remarks>
    private void AppendSwappedCollectionUpdatesNoLock(RecursivePath path)
    {
        if (_pendingFullResync)
            return;

        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerCollections(path, out var materializedParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            UIComponentAddress component = new(binding.Address.Component.Id, dynamicParameters);

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Reset,
                Component = component,
                Items = []
            });

            if (!TryBuildCollectionItems(path, out ServerCollectionItemChange[] items) || items.Length == 0)
                continue;

            AddPendingUpdateNoLock(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Insert,
                Component = component,
                Items = items
            });
        }
    }

    private void DrainControllerChangesNoLock()
    {
        _changeBuffer.Clear();

        _ = Controller.DrainChanges(_changeBuffer);

        AppendControllerChangesNoLock();

        _changeBuffer.Clear();
    }

    private void AppendControllerChangesNoLock()
    {
        if (Interlocked.Exchange(ref _fullResyncRequested, 0) == 1)
        {
            AppendFullResyncNoLock();
            return;
        }

        if (_pendingFullResync || _changeBuffer.Count == 0)
            return;

        RecursiveChange[] changes = CompactControllerChangesNoLock();

        for (var i = 0; i < changes.Length; i++)
            AppendControllerChangeNoLock(changes[i]);
    }

    private RecursiveChange[] CompactControllerChangesNoLock()
    {
        if (_changeBuffer.Count <= 1)
            return [.. _changeBuffer];

        List<RecursiveChange> result = new(_changeBuffer.Count);

        for (var i = 0; i < _changeBuffer.Count; i++)
        {
            RecursiveChange change = _changeBuffer[i];

            ArgumentNullException.ThrowIfNull(change);

            RecursivePath path = change.Path;

            switch (change.Kind)
            {
                case RecursiveChangeKind.Set:
                    RemovePreviousChangesCoveredByPath(result, path);
                    result.Add(change);
                    break;

                case RecursiveChangeKind.Reset:
                    RemovePreviousChangesCoveredByPath(result, path);
                    result.Add(change);
                    break;

                case RecursiveChangeKind.Add:
                case RecursiveChangeKind.Remove:
                case RecursiveChangeKind.Replace:
                case RecursiveChangeKind.Move:
                    result.Add(change);
                    break;

                default:
                    throw new UnreachableException();
            }
        }

        return [.. result];
    }

    /// <summary>
    /// Drops every earlier change the new one supersedes — the same path, or anything under it.
    /// </summary>
    /// <remarks>
    /// Compares segment by segment rather than via <c>Path.ToString()</c>, since this runs for every change against every kept change.
    /// </remarks>
    private static void RemovePreviousChangesCoveredByPath(List<RecursiveChange> changes, RecursivePath path)
    {
        for (var i = changes.Count - 1; i >= 0; i--)
        {
            if (IsSameOrDescendantPath(path, changes[i].Path))
                changes.RemoveAt(i);
        }
    }

    private static bool IsSameOrDescendantPath(RecursivePath ancestor, RecursivePath candidate)
    {
        if (candidate.Count < ancestor.Count)
            return false;

        for (var i = 0; i < ancestor.Count; i++)
        {
            if (!ancestor[i].Equals(candidate[i]))
                return false;
        }

        return true;
    }

    private void DiscardControllerChangesNoLock()
    {
        _changeBuffer.Clear();

        _ = Controller.DrainChanges(_changeBuffer);

        _changeBuffer.Clear();
    }
}
