using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;

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

        EnsurePropertyDefinitionsInitialized(component);
        AddComponentContent(component);
    }

    private void AddComponentContent(IVisualComponent component)
    {
        if (component is IContainerComponent container && container.HasChildren)
        {
            foreach (IVisualComponent child in container.Children)
                AddSlot(component, child, UIComponentSlotKind.Child, null);
        }

        if (component is IRegionContainerComponent regionContainer && regionContainer.HasRegions)
        {
            foreach (KeyValuePair<string, IVisualComponent> region in regionContainer.Regions)
                AddSlot(component, region.Value, UIComponentSlotKind.Region, region.Key);
        }

        if (component is ITemplatedComponent templated)
            AddTemplates(component, templated);

        if (component is IGroupedItemsComponent groupedItems && groupedItems.HasGroupTemplate)
            AddSlot(component, groupedItems.GroupTemplate!, UIComponentSlotKind.GroupTemplate, null);

        // Unlike every slot above, this one is not gated on the owner implementing a capability interface:
        // any component may carry a context menu.
        if (component.ContextMenu is IVisualComponent contextMenu)
            AddSlot(component, contextMenu, UIComponentSlotKind.ContextMenu, null);
    }

    private void AddSlot(IVisualComponent owner, IVisualComponent root, UIComponentSlotKind kind, string? key)
    {
        ArgumentNullException.ThrowIfNull(owner);
        ArgumentNullException.ThrowIfNull(root);

        AddComponent(root, owner.Id);

        UIComponentSlot slot = new()
        {
            Kind = kind,
            OwnerComponentId = GetComponentId(owner.Id),
            RootComponentId = GetComponentId(root.Id),
            Key = key
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

    private void AddTemplates(IVisualComponent owner, ITemplatedComponent templated)
    {
        if (templated.HasTemplate)
            AddSlot(owner, templated.Template!, UIComponentSlotKind.Template, null);

        if (templated.HasTemplates)
        {
            foreach (KeyValuePair<string, IVisualComponent> template in templated.Templates)
                AddSlot(owner, template.Value, UIComponentSlotKind.TemplateVariant, template.Key);
        }

        if (templated.HasEmptyTemplate)
            AddSlot(owner, templated.EmptyTemplate!, UIComponentSlotKind.EmptyTemplate, null);
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

        return (IVisualComponent?)_components[parentId];
    }
}
