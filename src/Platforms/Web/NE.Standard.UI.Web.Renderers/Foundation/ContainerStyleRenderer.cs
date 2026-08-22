using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders <see cref="IContainerComponent"/>'s Padding/Background/Overflow plus <see cref="IBorderedComponent"/>'s
/// border styling onto a component's root element. Keyed off the interface-level static property keys (not
/// any single implementing component), so it applies to any <see cref="IContainerComponent"/> under its own
/// property state — consumers today: <c>Container</c>, <c>StackPanel</c>, <c>WrapPanel</c>, <c>ScrollContainer</c>
/// (the latter passes <c>includeOverflow: false</c> — it manages its own overflow via
/// <c>HorizontalScroll</c>/<c>VerticalScroll</c>, which an unconditional inline <c>overflow: hidden</c> default
/// would clobber).
/// </summary>
public static class ContainerStyleRenderer
{
    public static void RenderContainerStyle(WebRenderContext context, IHtmlElementBuilder root, bool includeOverflow = true)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, IContainerComponent.PaddingProperty, "--ui-padding");

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, root, IContainerComponent.BackgroundProperty, static (target, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
                _ = target.Style("background", css);
        }, [WebDomOperation.Style("background", converter: WebDomConverters.ThemeColorCss)]);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        if (!includeOverflow)
            return;

        _ = WebComponentRendererBase.RenderProperty<UIOverflow?>(context, root, IContainerComponent.OverflowProperty, static (target, value) =>
        {
            if (value is UIOverflow overflow)
                _ = target.Style("overflow", WebCssValues.Overflow(overflow));
        }, [WebDomOperation.Style("overflow", converter: WebDomConverters.OverflowCss)]);
    }
}
