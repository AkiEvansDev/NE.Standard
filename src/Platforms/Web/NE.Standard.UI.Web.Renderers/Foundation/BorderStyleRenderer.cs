using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders <see cref="IBorderedComponent"/>'s border-color/thickness/radius properties onto a component's
/// root element. Keyed off the interface-level static property keys (not any single implementing
/// component), so it applies to any component implementing <see cref="IBorderedComponent"/> under its own
/// property state — consumers today: <c>ButtonComponentRenderer</c>, <c>CardComponentRenderer</c>,
/// <c>ExpanderComponentRenderer</c>, <c>ContainerComponentRenderer</c>, <c>CheckboxComponentRenderer</c>,
/// <c>TextInputComponentRenderer</c>.
/// </summary>
public static class BorderStyleRenderer
{
    public static void RenderBorderStyle(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, root, IBorderedComponent.BorderColorProperty, static (target, value) =>
        {
            if (value is UIThemeColor borderColor && WebCssValues.ThemeColor(borderColor) is { Length: > 0 } css)
                _ = target.Style("border-color", css);
        }, [WebDomOperation.Style("border-color", converter: WebDomConverters.ThemeColorCss)]);

        _ = WebComponentRendererBase.RenderProperty<UIThickness?>(context, root, IBorderedComponent.BorderThicknessProperty, static (target, value) =>
        {
            if (value is UIThickness borderThickness)
                _ = target.Style("border-width", WebCssValues.Thickness(borderThickness));
        }, [WebDomOperation.Style("border-width", converter: WebDomConverters.ThicknessCss)]);

        _ = WebComponentRendererBase.RenderProperty<UICornerRadius?>(context, root, IBorderedComponent.BorderRadiusProperty, static (target, value) =>
        {
            if (value is UICornerRadius borderRadius)
                _ = target.Style("border-radius", WebCssValues.Radius(borderRadius));
        }, [WebDomOperation.Style("border-radius", converter: WebDomConverters.RadiusCss)]);
    }
}
