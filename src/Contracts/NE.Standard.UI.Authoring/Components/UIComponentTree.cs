using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Walks an authored component tree: children, regions, templates and their variants, the empty and group templates, and the
/// context menu — every slot the compiler reads, in no promised order.
/// </summary>
public static class UIComponentTree
{
    /// <summary>The root and everything under it, each component once.</summary>
    public static IEnumerable<IVisualComponent> EnumerateDescendants(IVisualComponent root)
    {
        ArgumentNullException.ThrowIfNull(root);

        return EnumerateCore(root);
    }

    private static IEnumerable<IVisualComponent> EnumerateCore(IVisualComponent root)
    {
        Stack<IVisualComponent> pending = new();
        pending.Push(root);

        while (pending.Count > 0)
        {
            IVisualComponent component = pending.Pop();

            yield return component;

            if (component is IContainerComponent { HasChildren: true } container)
            {
                foreach (IVisualComponent child in container.Children)
                    pending.Push(child);
            }

            if (component is IRegionContainerComponent { HasRegions: true } regionContainer)
            {
                foreach (KeyValuePair<string, IVisualComponent> region in regionContainer.Regions)
                    pending.Push(region.Value);
            }

            if (component is ITemplatedComponent templated)
            {
                if (templated.HasTemplate)
                    pending.Push(templated.Template!);

                if (templated.HasTemplates)
                {
                    foreach (KeyValuePair<string, IVisualComponent> template in templated.Templates)
                        pending.Push(template.Value);
                }

                if (templated.HasEmptyTemplate)
                    pending.Push(templated.EmptyTemplate!);
            }

            if (component is IGroupedItemsComponent { HasGroupTemplate: true } groupedItems)
                pending.Push(groupedItems.GroupTemplate!);

            if (component.ContextMenu is IVisualComponent contextMenu)
                pending.Push(contextMenu);
        }
    }
}
