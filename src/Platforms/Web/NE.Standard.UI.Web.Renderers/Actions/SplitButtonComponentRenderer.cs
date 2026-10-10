using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>A button-shaped pill with two presses: the label, which fires the component's own click, and the end, which opens the menu.</summary>
/// <remarks>The button chrome lands once, on the root, and both parts inherit it.</remarks>
public sealed class SplitButtonComponentRenderer : ButtonRendererBase
{
    /// <summary>The parts <c>split-button-engine.ts</c> presses and opens.</summary>
    public const string MainClassName = "ui-split-button__main";
    public const string ToggleClassName = "ui-split-button__toggle";
    public const string MenuClassName = "ui-split-button__menu";

    /// <summary>A menu button whose chevron is off: its end part is not drawn, the main part being the whole button.</summary>
    public const string NoChevronClassName = "ui-split-button--no-chevron";

    public override string ComponentTypeKey => SplitButtonComponent.ComponentTypeKey;

    // A span, not a button: a button may not contain the two buttons the parts are.
    protected override string ElementName => "span";

    protected override string ClassName => "ui-split-button";

    protected override bool IsButtonElement => false;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(WebClassNames.Button);

        RenderButtonChrome(context, root);

        _ = ResolveRenderValue(context, SplitButtonComponent.ModeProperty, out UISplitButtonMode? mode, out _);
        var menuButton = mode == UISplitButtonMode.Menu;

        _ = root.Attribute(WebAttributes.SplitMode, menuButton ? "menu" : "split");

        _ = ResolveRenderValue(context, SplitButtonComponent.MenuPlacementProperty, out UIPopupPlacement? placement, out _);

        if (placement is UIPopupPlacement resolved && resolved != UIPopupPlacement.BottomEnd)
            _ = root.Attribute(WebAttributes.SplitPlacement, WebClassNames.PopupPlacement(resolved));

        // A split button's end part is nothing but its chevron, so only a menu button lets it go.
        if (menuButton)
            RenderFlagClass(context, root, SplitButtonComponent.ShowChevronProperty, NoChevronClassName, WebValueCondition.IsFalse);

        _ = root.Element("button", main =>
        {
            _ = main.Class(MainClassName);
            _ = main.Attribute("type", "button");

            // A menu button's label opens the menu and nothing else: its click never reaches the component's own.
            if (menuButton)
                DescribeMenuOpener(context, main, named: !HasTitle(context));

            RenderButtonLabel(context, root, main);
        });

        _ = root.Element("button", toggle =>
        {
            _ = toggle.Class(ToggleClassName);
            _ = toggle.Attribute("type", "button");

            DescribeMenuOpener(context, toggle, named: true);

            _ = toggle.Element("span", chevron => chevron.Class("ui-split-button__chevron"));
        });

        // Inside the root rather than portaled, like a context menu, so closest() paths and the component's inert hold.
        _ = root.Element("div", menu =>
        {
            _ = menu.Class(MenuClassName);
            _ = menu.Attribute("role", "presentation");
            _ = menu.Attribute(WebAttributes.EventBoundary);

            RenderRegion(context, menu, RegionNames.Menu);
        });
    }

    private static bool HasTitle(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, ITextBaseComponent.TitleProperty, out string? title, out _);

        return !string.IsNullOrWhiteSpace(title);
    }

    // An aria-label outranks the words inside, so an opener that carries its own title is left to be called by it.
    private static void DescribeMenuOpener(WebRenderContext context, IHtmlElementBuilder opener, bool named)
    {
        RenderPopupTrigger(opener, "menu");
        _ = opener.Attribute(WebAttributes.EventBoundary);

        if (named)
            WebWords.Write(context, opener, "aria-label", UIStrings.SplitButtonMore);
    }
}
