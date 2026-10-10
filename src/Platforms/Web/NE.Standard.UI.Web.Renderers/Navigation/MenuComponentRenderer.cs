using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// Renders a list of menu entries, owning the direction; sub-entries are the nested menu in the entry's <c>Submenu</c> slot, a
/// compiled collection updated like any other row.
/// </summary>
public sealed class MenuComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-menu__item";
    private const string SubmenuClassName = "ui-menu__submenu";
    // The client's own half of RenderSubmenu, for a row it builds (`menu-row-decorator.ts`).
    private const string RowDecoratorKind = "menu";

    /// <summary>
    /// The operation that keeps the popup a menu fills — a right-click menu's host, a split button's list — marked with the menu's
    /// Surface (<see cref="WebAttributes.MenuSurface"/>, <c>menu-surface.ts</c>), run after the Surface's class.
    /// </summary>
    public const string MenuSurfaceOperationKind = "menu-surface";

    private static readonly WebDomOperation[] SurfaceOperations = [SurfaceStyleRenderer.SurfaceClassOperation, WebDomOperation.Custom(MenuSurfaceOperationKind)];

    public override string ComponentTypeKey => MenuComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Menu;

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
            _ = root.Class(WebClassNames.MenuNested);

        // Render-time only: a rail is a shape of the page, drawn by the stylesheet and read by the group engine to fly its groups out.
        _ = ResolveRenderValue(context, MenuComponent.DisplayProperty, out UIMenuDisplay? display, out _);

        var rail = display == UIMenuDisplay.Rail;

        if (rail)
        {
            // Render-time only, as the rail is: its measures are the stylesheet's, picked by the class.
            _ = ResolveRenderValue(context, MenuComponent.SizeProperty, out UIButtonSize? size, out _);
            _ = root.Class(WebClassNames.MenuRail).Class(WebClassNames.MenuRailSize(size ?? UIButtonSize.Medium));
        }

        _ = ResolveRenderValue(context, MenuComponent.ShowSearchProperty, out bool? search, out _);

        if (search == true)
            _ = root.Attribute(WebAttributes.MenuSearch);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, MenuComponent.SpacingProperty, "--ui-menu-spacing");

        // A right-click menu's host already is the menu; a split button's list and a popup's submenu are one of their own.
        if (IsPopupMenu(context, context.Node) && !IsContextMenuRoot(context))
            _ = root.Attribute("role", "menu");

        // A rail has nothing left to fold: no fold, no switch.
        CollapsibleChromeRenderer.RenderCollapsible(context, root, folds: !rail);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);
        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty, SurfaceOperations);
        RenderPopupSurface(context);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName, rowDecorator: RowDecoratorKind);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>
    /// Whether the menu opens as a popup — a right-click menu (the render says so), a split button's list, or a submenu of one — rather
    /// than standing on the page as a sidebar or a bar; only a popup's entries are menu items to a screen reader.
    /// </summary>
    internal static bool IsPopupMenu(WebRenderContext context, UIComponentNode menu)
        => context.IsPopupMenu || IsSplitButtonList(context.ViewResolution.View, menu);

    /// <summary>A split button's list, or a submenu of one: the slot says so, since a split button renders its list as a plain region.</summary>
    private static bool IsSplitButtonList(CompiledView view, UIComponentNode menu)
    {
        if (OwnerSlot(view, menu) is not (UIComponentNode owner, UIComponentSlot slot))
            return false;

        return IsSplitButtonRegion(owner, slot)
            || (slot.Kind == UIComponentSlotKind.TemplateVariant && owner.TypeKey == MenuComponent.ComponentTypeKey && IsSplitButtonList(view, owner));
    }

    private static bool IsSplitButtonRegion(UIComponentNode owner, UIComponentSlot slot)
        => slot.Kind == UIComponentSlotKind.Region && owner.TypeKey == SplitButtonComponent.ComponentTypeKey && slot.Key == RegionNames.Menu;

    /// <summary>The menu a right-click menu's host holds directly, rather than an entry's submenu inside it.</summary>
    private static bool IsContextMenuRoot(WebRenderContext context)
    {
        if (!context.IsPopupMenu)
            return false;

        return OwnerSlot(context.ViewResolution.View, context.Node) is not (UIComponentNode owner, UIComponentSlot slot)
            || slot.Kind != UIComponentSlotKind.TemplateVariant
            || owner.TypeKey != MenuComponent.ComponentTypeKey;
    }

    private static (UIComponentNode Owner, UIComponentSlot Slot)? OwnerSlot(CompiledView view, UIComponentNode node)
    {
        if (node.ParentId is not UIComponentId parentId || !view.Graph.TryGet(parentId, out UIComponentNode? owner))
            return null;

        foreach (UIComponentSlot slot in owner.Slots)
        {
            if (slot.RootComponentId == node.ComponentId)
                return (owner, slot);
        }

        return null;
    }

    /// <summary>
    /// Marks the popup the menu fills — the right-click menu's host, the split button's list, rendered just above it — with the menu's
    /// Surface, which names the popup's ground; a submenu stands in its group instead.
    /// </summary>
    private static void RenderPopupSurface(WebRenderContext context)
    {
        if (!IsContextMenuRoot(context) && !(OwnerSlot(context.ViewResolution.View, context.Node) is (UIComponentNode owner, UIComponentSlot slot) && IsSplitButtonRegion(owner, slot)))
            return;

        _ = ResolveRenderValue(context, ISurfaceStyleComponent.SurfaceProperty, out UISurfaceStyle? surface, out _);

        if (surface is UISurfaceStyle style)
            _ = context.Html.Attribute(WebAttributes.MenuSurface, WebClassNames.SurfaceStyleToken(style));
    }

    /// <summary>Renders the entries into an inner host element, which the client's descendant-only host lookup requires.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);
        var icons = CarriesIcon(items);

        RenderItemsHost(context, root, "ui-menu__host", items, isBound, ItemClassName,
            configureHost: host =>
            {
                _ = host.Class(CollapsibleChromeRenderer.ContentClassName);

                if (icons)
                    _ = host.Attribute(WebAttributes.MenuIcons);
            },
            appendItem: (itemRoot, item, _) => RenderSubmenu(context, itemRoot, item)
        );
    }

    /// <summary>Whether an entry of these, not a caption or a rule, carries an icon: the others keep its room (<c>menu-icons.ts</c>).</summary>
    private static bool CarriesIcon(IReadOnlyList<object?> items)
    {
        foreach (var item in items)
        {
            if (item is IMenuItemModel { Kind: not (UIMenuItemKind.Header or UIMenuItemKind.Separator) } model && IconValueRenderer.Draws(model.Icon))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Marks an entry's wrapper by its kind and renders its sub-entries as the nested menu under it; the client's row decorator builds
    /// the same row for a live one, so the two must match.
    /// </summary>
    private static void RenderSubmenu(WebRenderContext context, IHtmlElementBuilder itemRoot, object? item)
    {
        if (item is not IMenuItemModel model)
            return;

        // A caption's or a rule's row takes its own width along a bar, not an entry's.
        if (model.Kind is UIMenuItemKind.Header or UIMenuItemKind.Separator)
            _ = itemRoot.Attribute(WebAttributes.MenuPassiveRow);

        if (!HasChildren(model))
            return;

        // On the wrapper, not the entry: what opens and closes is the wrapper's whole block.
        _ = itemRoot.Attribute(WebAttributes.MenuGroup);

        // The group's own entry counts too, as the entries render the model's Selected (DefaultMenuItemTemplate).
        if (HoldsCurrent(model))
            _ = itemRoot.Attribute(WebAttributes.MenuHoldsCurrent);

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

    private static bool HoldsCurrent(IMenuItemModel model)
    {
        if (model.Selected == true)
            return true;

        foreach (IMenuItemModel child in model.Items)
        {
            if (HoldsCurrent(child))
                return true;
        }

        return false;
    }
}
