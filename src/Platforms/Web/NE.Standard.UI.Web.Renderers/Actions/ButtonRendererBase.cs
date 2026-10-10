using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Actions;

/// <summary>The chrome every button-shaped control draws: type class, submit form id, padding, background and border.</summary>
public abstract class ButtonRendererBase : WebComponentRendererBase
{
    // Every button, menu entry, breadcrumb and tab caption registers these, so they are built once.
    private static readonly WebDomOperation[] TypeOperations = [WebDomOperation.Class(converter: WebDomConverters.ButtonClass)];
    private static readonly WebDomOperation[] SizeOperations = [WebDomOperation.Class(converter: WebDomConverters.ButtonSizeClass)];
    private static readonly WebDomOperation[] ShortcutOperations = [WebDomOperation.Attribute(WebAttributes.Shortcut)];

    protected override string ElementName => "button";

    /// <summary>Whether a real <c>button</c> is rendered, and so needs <c>type="button"</c> to never submit an enclosing form.</summary>
    protected virtual bool IsButtonElement => true;

    /// <summary>Whether the button writes its Overflow inline; a caption that draws outside its box says no and leaves it to the stylesheet.</summary>
    protected virtual bool RendersOverflow => true;

    /// <summary>Writes the shared chrome; the <c>ui-button</c> class itself is the caller's to add.</summary>
    protected void RenderButtonChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        if (IsButtonElement)
            _ = root.Attribute("type", "button");

        // On the button, not on its label; an icon-only button's name follows it too (RenderButtonLabel marks the named element).
        RenderTooltip(context, root, TextContentRendererBase.TooltipNameOperation);

        if (RendersOverflow)
            OverflowStyleRenderer.RenderOverflow(context, root);

        RenderButtonLook(context, root);

        RenderShortcut(context, root);

        // The form the button submits (OnSubmit): the framework's, and a real button joins the browser's own by `form`, as its fields do.
        NativeInputRendererBase.RenderFormId(context, root, ButtonComponent.SubmitFormIdProperty, WebAttributes.SubmitFormId, joinsForm: IsButtonElement);

        RenderDrawerOpener(context, root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ButtonComponent.PaddingProperty, WebResponsiveCss.PaddingVariable);

        SurfaceStyleRenderer.RenderBackground(context, root, ButtonComponent.BackgroundProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);
    }

    /// <summary>
    /// A button's look on <paramref name="root"/>, kept in step with its <c>Type</c> and <c>Size</c>: the classes <c>ui-button.less</c>
    /// draws by — every button-shaped control's, the page switchers' among them.
    /// </summary>
    public static void RenderButtonLook(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<UIButtonType?>(context, root, ButtonComponent.TypeProperty, static (target, value) =>
        {
            if (value is UIButtonType type)
                _ = target.Class(WebClassNames.ButtonClass(type));
        }, TypeOperations);

        _ = RenderProperty<UIButtonSize?>(context, root, ButtonComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIButtonSize size)
                _ = target.Class(WebClassNames.ButtonSize(size));
        }, SizeOperations);
    }

    /// <summary>
    /// The chord that presses the control, as the attribute the page's shortcut registry reads (<c>shortcut-engine.ts</c>); the client
    /// writes it in the control's tooltip, and a menu entry's at its end, in the reader's platform's words.
    /// </summary>
    private static void RenderShortcut(WebRenderContext context, IHtmlElementBuilder root)
        => _ = RenderProperty<string?>(context, root, ButtonComponent.ShortcutProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.Shortcut, value);
        }, ShortcutOperations);

    /// <summary>
    /// A button that opens a side's drawer (<see cref="ButtonComponent{T}.OpensDrawer"/>) wears the shell's own button's marks, which
    /// side-drawer-engine.ts presses, marks expanded and gives the keyboard back to; nothing where the side is no drawer.
    /// </summary>
    private static void RenderDrawerOpener(WebRenderContext context, IHtmlElementBuilder root)
    {
        CompiledView view = context.ViewResolution.View;

        _ = ResolveRenderValue(context, ButtonComponent.OpensDrawerProperty, out UISide? side, out _);

        var region = side switch
        {
            UISide.Left => RegionNames.LeftSide,
            UISide.Right => RegionNames.RightSide,
            _ => null
        };

        if (region is null || !view.Options.SideDrawers || view.FindRegion(region) is null)
            return;

        _ = root
            .Attribute(WebAttributes.DrawerToggle, region)
            .Attribute("aria-expanded", "false")
            .Attribute("aria-controls", WebAttributes.DrawerId(region));
    }

    /// <summary>
    /// Draws the button's label (icon, title, description, badge) into a box the chrome can address; a titleless control takes
    /// the tooltip as its accessible name.
    /// </summary>
    protected static void RenderButtonLabel(WebRenderContext context, IHtmlElementBuilder root)
        => RenderButtonLabel(context, root, root);

    /// <summary>
    /// The same label inside <paramref name="host"/> — the press a composite control draws inside its root, which is what takes the name.
    /// </summary>
    protected static void RenderButtonLabel(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder host)
        => RenderButtonLabel(context, root, host, null);

    /// <summary>The label with <paramref name="partsShown"/> run after its parts' own operations, as a text body's.</summary>
    protected static void RenderButtonLabel(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder host, WebDomOperation? partsShown)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(host);

        _ = host.Element("span", label =>
        {
            _ = label.Class("ui-button__content");

            TextContentRendererBase.RenderTextBody(context, root, label, new WebTextBodyOptions
            {
                IncludeTextLayout = true,
                DefaultBadgePlacement = UITextBadgePlacement.Trailing,
                TooltipNamesHost = true,
                AlignsRoot = true,
                PartsShownOperation = partsShown
            });
        });

        // An icon-only control is named by its tooltip; a titled control keeps its title regardless. The mark lets the tooltip's
        // pushes and a language switch rename it, and a bound title that arrives unname it — so a bound title wears it even while
        // it shows, for the day it is pushed empty.
        WebRenderValueKind titled = ResolveRenderValue(context, ITextBaseComponent.TitleProperty, out string? title, out _);

        // Words the button does not show outrank both: a switch drawn as "Aa" is "Match case" to a screen reader.
        WebRenderValueKind named = ResolveRenderValue(context, IAccessibleNameComponent.AccessibleNameProperty, out string? name, out _);

        var untitled = string.IsNullOrWhiteSpace(title);

        if ((untitled || titled == WebRenderValueKind.Binding) && named != WebRenderValueKind.Binding && string.IsNullOrWhiteSpace(name))
        {
            _ = host.Attribute(TextContentRendererBase.TooltipNamedAttribute);

            // The words a reader sees, not the Markdown source; unmarked, since a switch writes it through the tooltip's own name
            // operation, which the tooltip's recorded word or binding drives.
            _ = ResolveRenderValue(context, ITooltipComponent.TooltipProperty, out string? tooltip, out _);

            if (untitled && !string.IsNullOrWhiteSpace(tooltip))
                _ = host.Attribute("aria-label", UIInlineMarkup.ToPlainText(tooltip));
        }

        RenderAccessibleName(context, host);
    }
}
