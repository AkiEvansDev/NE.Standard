using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>Renders a menu entry as button chrome on an anchor, so an entry that navigates has a real URL.</summary>
public sealed class MenuItemComponentRenderer : ButtonRendererBase
{
    private const string ShortcutClass = "ui-menu-item__shortcut";
    private const string ValueClass = "ui-menu-item__value";
    private const string CheckedClass = "ui-menu-item--checked";

    private static readonly WebDomOperation[] UrlOperations = [WebDomOperation.Attribute("href", converter: WebDomConverters.SafeUrl)];

    private static readonly WebDomOperation[] SelectedOperations =
    [
        WebDomOperation.ToggleClass("ui-menu-item--selected", condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute("aria-current", condition: WebValueCondition.IsTrue, value: "page")
    ];

    private static readonly WebDomOperation[] ValueOperations = [WebDomOperation.Text(target: "." + ValueClass)];
    private static readonly WebDomOperation[] CheckedOperations = [WebDomOperation.ToggleClass(CheckedClass, condition: WebValueCondition.IsTrue), WebDomOperation.Attribute("aria-checked")];
    private static readonly WebDomOperation[] ShortcutOperations = [WebDomOperation.Attribute(WebAttributes.MenuShortcut, target: "root"), WebDomOperation.Text(target: "." + ShortcutClass)];

    public override string ComponentTypeKey => MenuItemComponent.ComponentTypeKey;

    protected override string ElementName => "a";

    protected override string ClassName => "ui-menu-item";

    protected override bool IsButtonElement => false;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-button");

        RenderButtonChrome(context, root);

        // Render-time only, and an attribute rather than a class because it also gates the content a separator still renders.
        _ = ResolveRenderValue(context, MenuItemComponent.KindProperty, out UIMenuItemKind? kind, out _);
        _ = root.Attribute(WebAttributes.MenuItemKind, (kind ?? UIMenuItemKind.Item).ToString().ToLowerInvariant());

        var popup = InPopupMenu(context);

        if (popup)
            RenderPopupRole(root, kind);

        _ = RenderProperty<string?>(context, root, MenuItemComponent.UrlProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeLink(value))
                _ = target.Attribute("href", value);
        }, UrlOperations);

        // aria-current is the accessible half of the same state the modifier class paints.
        _ = RenderProperty<bool?>(context, root, MenuItemComponent.SelectedProperty, static (target, value) =>
        {
            if (value == true)
            {
                _ = target.Class("ui-menu-item--selected");
                _ = target.Attribute("aria-current", "page");
            }
        }, SelectedOperations);

        RenderButtonLabel(context, root);
        RenderShortcut(context, root);
        RenderValue(context, root);
        RenderChecked(context, root, kind, popup);
    }

    /// <summary>Whether the entry stands in a popup menu, where its role is a menu item's rather than a link's.</summary>
    private static bool InPopupMenu(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;

        return context.Node.ParentId is UIComponentId parentId
            && view.Graph.TryGet(parentId, out UIComponentNode? menu)
            && menu.TypeKey == MenuComponent.ComponentTypeKey
            && MenuComponentRenderer.IsPopupMenu(context, menu);
    }

    // A caption is words between entries and takes no role; a check's role is its own (RenderChecked).
    private static void RenderPopupRole(IHtmlElementBuilder root, UIMenuItemKind? kind)
    {
        if (kind == UIMenuItemKind.Separator)
            _ = root.Attribute("role", "separator");
        else if (kind is null or UIMenuItemKind.Item or UIMenuItemKind.Select)
            _ = root.Attribute("role", "menuitem");
    }

    /// <summary>A select's current value at the row's end; the span is always there, a DOM operation only patches text.</summary>
    private static void RenderValue(WebRenderContext context, IHtmlElementBuilder root)
    {
        IHtmlElementBuilder? value = null;

        _ = root.Element("span", span =>
        {
            _ = span.Class(ValueClass);
            value = span;
        });

        _ = RenderProperty<string?>(context, root, MenuItemComponent.ValueProperty, (target, text) => _ = value!.Text(text ?? string.Empty),
            ValueOperations);
    }

    /// <summary>
    /// A check's state: the class paints the mark, aria-checked says it; a check entry is a menuitemcheckbox in a popup menu and a
    /// checkbox on the page, the two roles that may carry aria-checked here.
    /// </summary>
    private static void RenderChecked(WebRenderContext context, IHtmlElementBuilder root, UIMenuItemKind? kind, bool popup)
    {
        if (kind != UIMenuItemKind.Check)
            return;

        _ = root.Attribute("role", popup ? "menuitemcheckbox" : "checkbox");

        _ = RenderProperty<bool?>(context, root, MenuItemComponent.CheckedProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class(CheckedClass);

            _ = target.Attribute("aria-checked", value == true ? "true" : "false");
        }, CheckedOperations);
    }

    /// <summary>Renders the shortcut combination, both as text and as the attribute <c>menu-engine.ts</c> matches on.</summary>
    private static void RenderShortcut(WebRenderContext context, IHtmlElementBuilder root)
    {
        // The span is emitted even when empty: a DOM operation patches text, never adds an element.
        IHtmlElementBuilder? shortcut = null;

        _ = root.Element("span", span =>
        {
            _ = span.Class(ShortcutClass);
            shortcut = span;
        });

        // One registration carrying both operations: a property may be registered only once.
        _ = RenderProperty<string?>(context, root, MenuItemComponent.ShortcutProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.MenuShortcut, value);

            _ = shortcut!.Text(value ?? string.Empty);
        }, ShortcutOperations);
    }
}
