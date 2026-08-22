using System;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A menu entry: the button chrome on an anchor rather than a button, so an entry that navigates has a real
/// URL to middle-click or copy. Wears <c>ui-button</c> next to its own <c>ui-menu-item</c>.
/// </summary>
public sealed class MenuItemComponentRenderer : ButtonRendererBase
{
    private const string KindAttribute = "data-ui-menu-item-kind";
    private const string ShortcutAttribute = "data-ui-menu-shortcut";
    private const string ShortcutClass = "ui-menu-item__shortcut";

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

        // Render-time only, so it needs no DOM operation and no enum converter: see MenuItemComponent.Kind.
        // An attribute rather than a class because it gates the *content* too — a separator still renders its
        // own content region, and only CSS can take that back out of the flow.
        _ = ResolveRenderValue(context, MenuItemComponent.KindProperty, out UIMenuItemKind? kind, out _);
        _ = root.Attribute(KindAttribute, (kind ?? UIMenuItemKind.Item).ToString().ToLowerInvariant());

        _ = RenderProperty<string?>(context, root, MenuItemComponent.UrlProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("href", value);
        }, [WebDomOperation.Attribute("href")]);

        // aria-current is the accessible half of the same state the modifier class paints.
        _ = RenderProperty<bool?>(context, root, MenuItemComponent.SelectedProperty, static (target, value) =>
        {
            if (value == true)
            {
                _ = target.Class("ui-menu-item--selected");
                _ = target.Attribute("aria-current", "page");
            }
        }, [
            WebDomOperation.ToggleClass("ui-menu-item--selected", condition: WebValueCondition.IsTrue),
            WebDomOperation.ToggleAttribute("aria-current", condition: WebValueCondition.IsTrue)
        ]);

        RenderRegion(context, root, RegionNames.Content);
        RenderShortcut(context, root);
    }

    /// <summary>
    /// The combination, muted on the trailing edge. The same value rides on the root as an attribute, which
    /// is what <c>menu-engine.ts</c> builds its registry from — the text alone would tie the match to markup.
    /// </summary>
    private static void RenderShortcut(WebRenderContext context, IHtmlElementBuilder root)
    {
        // The span is emitted whether or not there is a combination — a bound Shortcut has no value at render
        // time, and a DOM operation patches text, never adds an element. Empty, CSS takes it back out.
        IHtmlElementBuilder? shortcut = null;

        _ = root.Element("span", span =>
        {
            _ = span.Class(ShortcutClass);
            shortcut = span;
        });

        // One registration carrying both operations, not two: a property may be registered once, and the two
        // halves are the same value anyway — the attribute the engine matches on, and the text the user reads.
        _ = RenderProperty<string?>(context, root, MenuItemComponent.ShortcutProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(ShortcutAttribute, value);

            _ = shortcut!.Text(value ?? string.Empty);
        }, [
            WebDomOperation.Attribute(ShortcutAttribute, target: "root"),
            WebDomOperation.Text(target: "." + ShortcutClass)
        ]);
    }
}
