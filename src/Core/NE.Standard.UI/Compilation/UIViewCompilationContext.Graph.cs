using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Infrastructure;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private void AddComponent(IVisualComponent component, string? parentId)
    {
        ArgumentNullException.ThrowIfNull(component);
        ArgumentException.ThrowIfNullOrWhiteSpace(component.Id);
        ArgumentException.ThrowIfNullOrWhiteSpace(component.TypeKey);

        if (!_components.TryAdd(component.Id, component))
            throw new InvalidOperationException($"Component id '{component.Id}' is already used.");

        UIComponentId compiledId = CreateComponentId();

        _componentIdsByAuthoringId.Add(component.Id, compiledId);
        _authoringIdByComponentId.Add(compiledId, component.Id);
        _componentOrder.Add(component);
        _parentByComponentId.Add(component.Id, parentId);

        UIPropertyRegister.EnsureRegistered(component.GetType());
        ValidateSplitButton(component);
        ValidateKeyValueEditing(component);
        ValidateActionBar(component);
        AddComponentContent(component);
    }

    // A menu button's whole face opens the menu, so a click of its own would never run: refused here rather than left to fail silently.
    private static void ValidateSplitButton(IVisualComponent component)
    {
        if (component is ISplitButtonComponent { Mode: UISplitButtonMode.Menu } && HasEvent(component, EventNames.Click))
            throw new InvalidOperationException($"'{component.Id}' is a Menu-mode split button with its own click command, which would never run; register the command on the entries with OnItemClick.");
    }

    /// <summary>Whether a component registers a command on the event of the given name.</summary>
    private static bool HasEvent(IVisualComponent component, string name)
    {
        for (var i = 0; i < component.Events.Count; i++)
        {
            if (string.Equals(component.Events[i].Name, name, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    // Editing makes the rows' one action the pencil, so a click of the author's would land on it: the edit or the command, never both.
    private static void ValidateKeyValueEditing(IVisualComponent component)
    {
        if (component is IKeyValueActionComponent { Editable: true, HasActionClick: true })
            throw new InvalidOperationException($"Key-value list '{component.Id}' edits its rows in place and has an action click command; the rows' action is then the edit pencil, which cannot be both. Drop OnActionClick, or pass the command to EnableEditing as its edit command.");
    }

    // The bar is a quick view of the context menu's entries, so with no menu it would have nothing to show and nothing behind "more".
    private static void ValidateActionBar(IVisualComponent component)
    {
        if (component.ActionBar is not null && component.ContextMenu is null)
            throw new InvalidOperationException($"'{component.Id}' has an action bar and no context menu; the bar shows the menu's entries marked InActionBar, so set the menu with SetContextMenu.");
    }

    private void AddComponentContent(IVisualComponent component)
    {
        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(component))
        {
            if (slot.Kind == UIComponentSlotKind.Child && component is IGridTracksComponent tracks && slot.Root is IGridSplitterComponent splitter)
                ValidateGridSplitter(tracks, splitter);

            AddSlot(component, slot.Root, slot.Kind, slot.Key, slot.Kind == UIComponentSlotKind.TemplateVariant ? GetCompositeKeyProperty((ITemplatedComponent)component, slot.Key!) : null);
        }
    }

    /// <summary>A composite's variant carries the property its typed keys are read from: "node" and "node:folder" alike.</summary>
    private static string? GetCompositeKeyProperty(ITemplatedComponent templated, string key)
    {
        var colon = key.IndexOf(':', StringComparison.Ordinal);
        var baseKey = colon < 0 ? key : key[..colon];

        return templated.CompositeSlotKeyProperties.GetValueOrDefault(baseKey);
    }

    private void AddSlot(IVisualComponent owner, IVisualComponent root, UIComponentSlotKind kind, string? key, string? keyProperty = null)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(root);

        AddComponent(root, owner.Id);

        UIComponentSlot slot = new()
        {
            Kind = kind,
            OwnerComponentId = GetComponentId(owner.Id),
            RootComponentId = GetComponentId(root.Id),
            Key = key,
            KeyProperty = keyProperty
        };

        if (!_slotsByOwnerComponentId.TryGetValue(owner.Id, out List<UIComponentSlot>? ownerSlots))
        {
            ownerSlots = [];
            _slotsByOwnerComponentId.Add(owner.Id, ownerSlots);
        }

        ownerSlots.Add(slot);

        if (!_slotByRootComponentId.TryAdd(root.Id, slot))
            throw new InvalidOperationException($"Slot for root component '{root.Id}' is already registered.");
    }

    private UIComponentNode[] BuildNodes(Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        UIComponentNode[] nodes = new UIComponentNode[_componentOrder.Count];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];
            ResolvedComponentContext context = componentContexts[component.Id];
            var parentAuthoringId = _parentByComponentId[component.Id];

            nodes[i] = new UIComponentNode
            {
                AuthoringId = component.Id,
                HasAuthoredId = component.HasAuthoredId,
                TypeKey = component.TypeKey,
                ComponentId = GetComponentId(component.Id),
                ParentId = parentAuthoringId is null ? null : GetComponentId(parentAuthoringId),
                ContextId = context.Context.Id,
                ContextParameterCount = CompiledUIBindingParameterResolver.CountDynamic(context.Path.Parameters),
                DefinesContextParameter = context.DefinesParameter,
                IsContentTree = component.IsContentTree,
                Slots = BuildSlots(component.Id),
                Children = BuildChildren(component.Id)
            };
        }

        return nodes;
    }

    private UIComponentSlot[] BuildSlots(string componentId)
        => !_slotsByOwnerComponentId.TryGetValue(componentId, out List<UIComponentSlot>? slots) ? [] : [.. slots];

    private UIComponentId[] BuildChildren(string componentId)
    {
        if (!_slotsByOwnerComponentId.TryGetValue(componentId, out List<UIComponentSlot>? slots))
            return [];

        List<UIComponentId> children = [];

        for (var i = 0; i < slots.Count; i++)
        {
            UIComponentSlot slot = slots[i];

            if (slot.Kind == UIComponentSlotKind.Child)
                children.Add(slot.RootComponentId);
        }

        return [.. children];
    }

    private IVisualComponent? TryGetParentComponent(IVisualComponent? component)
    {
        if (component is null)
            return null;

        if (!_parentByComponentId.TryGetValue(component.Id, out var parentId))
            return null;

        if (parentId is null)
            return null;

        return _components[parentId];
    }
}
