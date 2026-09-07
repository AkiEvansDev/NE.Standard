using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// Renders a list of menu entries, owning the direction; an entry's sub-entries are the nested menu in its <c>Submenu</c> slot,
/// rendered under the entry's wrapper — a compiled collection of its own, so a sub-entry is updated like any other row.
/// </summary>
public sealed class MenuComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-menu__item";
    private const string SubmenuClassName = "ui-menu__submenu";
    private const string NestedClassName = "ui-menu--nested";
    // The client's own half of RenderSubmenu, for a row it builds (`menu-row-decorator.ts`).
    private const string RowDecoratorKind = "menu";

    public override string ComponentTypeKey => MenuComponent.ComponentTypeKey;

    protected override string ClassName => "ui-menu";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIOrientation?>(context, root, MenuComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        // Render-time only: a nested menu is its entry's block, folded and flown out by the group engine through the wrapper above it.
        _ = ResolveRenderValue(context, MenuComponent.NestedProperty, out bool? nested, out _);

        if (nested == true)
            _ = root.Class(NestedClassName);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, MenuComponent.SpacingProperty, "--ui-menu-spacing");

        CollapsibleChromeRenderer.RenderCollapsible(context, root);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);
        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName, rowDecorator: RowDecoratorKind);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>Renders the entries into an inner host element, which the client's descendant-only host lookup requires.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-menu__host", items, isBound, ItemClassName,
            configureHost: host => host.Class(CollapsibleChromeRenderer.ContentClassName),
            appendItem: (itemRoot, item, _) => RenderSubmenu(context, itemRoot, item)
        );
    }

    /// <summary>
    /// Renders an entry's sub-entries as the nested menu in the Submenu slot, under the entry's wrapper; the client's row decorator
    /// builds the same block for a row that arrives live, so the two must stay one shape.
    /// </summary>
    private static void RenderSubmenu(WebRenderContext context, IHtmlElementBuilder itemRoot, object? item)
    {
        if (item is not IMenuItemModel model || !HasChildren(model))
            return;

        // On the wrapper, not the entry: what opens and closes is the wrapper's whole block.
        _ = itemRoot.Attribute(WebAttributes.MenuGroup);

        // A select's choices never unfold inline: the engine flies them out beside the entry, folded menu or not.
        if (model.Kind == UIMenuItemKind.Select)
            _ = itemRoot.Attribute(WebAttributes.MenuSelect);

        // Written here so the group arrives open, rather than shifting every entry below it after the first paint.
        if (model.Expanded == true)
            _ = itemRoot.Attribute(WebAttributes.MenuOpen);

        RenderNamedTemplateSlot(context, itemRoot, item, MenuComponent.SubmenuTemplateKey, SubmenuClassName);
    }

    private static bool HasChildren(IMenuItemModel model)
    {
        foreach (IMenuItemModel _ in model.Items)
            return true;

        return false;
    }
}
