using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A list of menu entries. Each entry resolves through its own template — the default one, or the caption or
/// rule variant the menu registers — so this renderer owns only the direction and the collapsed state;
/// <see cref="ItemsCollectionRendererBase.RenderItem"/> does the rest.
/// </summary>
public sealed class MenuComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-menu__item";
    private const string SubItemClassName = "ui-menu__item ui-menu__item--sub";
    private const string SubmenuClassName = "ui-menu__submenu";
    private const string GroupAttribute = "data-ui-menu-group";
    private const string OpenAttribute = "data-ui-menu-open";

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

        _ = RenderProperty<bool?>(context, root, MenuComponent.CollapsedProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-menu--collapsed");
        }, [WebDomOperation.ToggleClass("ui-menu--collapsed", condition: WebValueCondition.IsTrue)]);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, MenuComponent.SpacingProperty, "--ui-menu-spacing");

        RenderCollapseToggle(context, root);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>
    /// The switch for the collapsed state, drawn before the entries because it is not one of them — nothing
    /// in the collection stands for it, and a menu is free to have none.
    /// </summary>
    /// <remarks>
    /// Render-time only: the flag decides whether the control exists at all, and a menu that gains one after
    /// the fact is a different menu. The chevron is drawn in CSS rather than taken from an icon pack — this is
    /// the library's own chrome, and it must not depend on which pack the host installed.
    /// </remarks>
    private static void RenderCollapseToggle(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = ResolveRenderValue(context, MenuComponent.ShowCollapseToggleProperty, out bool? show, out _);

        if (show != true)
            return;

        _ = root.Element("button", toggle =>
        {
            _ = toggle.Class("ui-menu__collapse");
            _ = toggle.Attribute("type", "button");
            _ = toggle.Attribute("data-ui-menu-collapse");
            _ = toggle.Attribute("aria-expanded", "true");
        });
    }

    /// <summary>
    /// Entries live in an inner host rather than directly under the root: the client resolves a collection's
    /// host with <c>root.querySelector("[data-ui-items-host]")</c>, which searches descendants only, so a
    /// bound collection whose root *is* the container silently stays empty. Same reasoning as
    /// <c>CommandBarComponentRenderer</c>.
    /// </summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-menu__host");
            _ = host.Attribute("data-ui-items-host");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RenderItemList(context, host, items, ItemClassName, appendItem: (itemRoot, item, _) => RenderSubItems(context, itemRoot, item));
        });
    }

    /// <summary>
    /// An entry's own sub-entries, one level deep, rendered through the same templates as the entries above
    /// them — a sub-entry is an ordinary entry that is drawn indented and hides with its parent.
    /// </summary>
    /// <remarks>
    /// Server-side only, and so only for a menu whose entries are set rather than bound: a bound collection is
    /// rendered by the client from the item template, and the template has no sub-entries in it. Making that
    /// work needs an items host nested in the template and a compiled collection binding under it — see
    /// <c>docs/PLAN.md</c> §2. One level: a second would need a third, and a navigation menu that is three
    /// deep is a different component.
    /// </remarks>
    private static void RenderSubItems(WebRenderContext context, IHtmlElementBuilder itemRoot, object? item)
    {
        if (item is not IMenuItemModel model)
            return;

        List<object?> children = [.. model.Items];

        if (children.Count == 0)
            return;

        // On the wrapper rather than on the entry: the entry is an anchor the engine may not own, and what
        // opens and closes is the wrapper's whole block.
        _ = itemRoot.Attribute(GroupAttribute);

        // Written here so the group is already open in the HTML the server sends. Opened by the client
        // instead — which is what happens for a group the viewer chose — every entry below it moves once the
        // page has already been painted.
        if (model.Expanded == true)
            _ = itemRoot.Attribute(OpenAttribute);

        _ = itemRoot.Element("div", submenu =>
        {
            _ = submenu.Class(SubmenuClassName);

            RenderItemList(context, submenu, children, SubItemClassName);
        });
    }
}
