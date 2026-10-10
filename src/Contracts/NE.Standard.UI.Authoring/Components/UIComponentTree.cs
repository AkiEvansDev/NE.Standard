using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Walks an authored component tree: children, regions, templates and their variants, the empty and group template, and the
/// context menu.
/// </summary>
/// <remarks>
/// A component's own dialogs (<see cref="IDialogOwnerComponent"/>) are not walked; a view collects them separately. The compiler
/// builds its slot graph from <see cref="EnumerateSlots"/>, so a slot added there is laid out, validated and searched for dialogs
/// alike.
/// </remarks>
public static class UIComponentTree
{
    /// <summary>The root and everything under it, each component once, in no promised order.</summary>
    public static IEnumerable<IVisualComponent> EnumerateDescendants(IVisualComponent root)
    {
        ArgumentNullException.ThrowIfNull(root);

        return EnumerateDescendantsCore(root);
    }

    private static IEnumerable<IVisualComponent> EnumerateDescendantsCore(IVisualComponent root)
    {
        Stack<IVisualComponent> pending = new();
        pending.Push(root);

        while (pending.Count > 0)
        {
            IVisualComponent component = pending.Pop();

            yield return component;

            foreach (UIComponentTreeSlot slot in EnumerateSlotsCore(component))
                pending.Push(slot.Root);
        }
    }

    /// <summary>The components one component holds directly, each with the slot it fills, in the order the compiler numbers them.</summary>
    public static IEnumerable<UIComponentTreeSlot> EnumerateSlots(IVisualComponent component)
    {
        ArgumentNullException.ThrowIfNull(component);

        return EnumerateSlotsCore(component);
    }

    private static IEnumerable<UIComponentTreeSlot> EnumerateSlotsCore(IVisualComponent component)
    {
        if (component is IContainerComponent { HasChildren: true } container)
        {
            foreach (IVisualComponent child in container.Children)
                yield return new(UIComponentSlotKind.Child, null, child);
        }

        if (component is IRegionContainerComponent { HasRegions: true } regionContainer)
        {
            foreach (KeyValuePair<string, IVisualComponent> region in regionContainer.Regions)
                yield return new(UIComponentSlotKind.Region, region.Key, region.Value);
        }

        if (component is ITemplatedComponent templated)
        {
            if (templated.HasTemplate)
                yield return new(UIComponentSlotKind.Template, null, templated.Template!);

            if (templated.HasTemplates)
            {
                foreach (KeyValuePair<string, IVisualComponent> template in templated.Templates)
                    yield return new(UIComponentSlotKind.TemplateVariant, template.Key, template.Value);
            }

            if (templated.HasEmptyTemplate)
                yield return new(UIComponentSlotKind.EmptyTemplate, null, templated.EmptyTemplate!);
        }

        if (component is IGroupedItemsComponent { HasGroupTemplate: true } groupedItems)
            yield return new(UIComponentSlotKind.GroupTemplate, null, groupedItems.GroupTemplate!);

        // Unlike every slot above, this one is not gated on a capability interface: any component may carry a context menu.
        if (component.ContextMenu is IVisualComponent contextMenu)
            yield return new(UIComponentSlotKind.ContextMenu, null, contextMenu);
    }
}

/// <summary>
/// One component another holds directly: the slot's kind, its key where the slot is named (a region, a template variant), and the
/// component in it.
/// </summary>
public readonly record struct UIComponentTreeSlot(UIComponentSlotKind Kind, string? Key, IVisualComponent Root);
