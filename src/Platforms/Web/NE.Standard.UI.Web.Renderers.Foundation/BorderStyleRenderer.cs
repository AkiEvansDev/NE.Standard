using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders <see cref="IBorderedComponent"/>'s border colour, thickness and radius onto a component's root element.</summary>
public static class BorderStyleRenderer
{
    private static readonly WebDomOperation[] ColorOperations = [WebDomOperation.Style("border-color", converter: WebDomConverters.ThemeColorCss)];

    private static readonly WebDomOperation[] ThicknessOperations =
    [
        WebDomOperation.Style("border-width", converter: WebDomConverters.ThicknessCss),
        WebDomOperation.Class(converter: WebDomConverters.BorderNoneClass)
    ];

    private static readonly WebDomOperation[] RadiusOperations = [WebDomOperation.Style("border-radius", converter: WebDomConverters.RadiusCss)];

    public static void RenderBorderStyle(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, root, IBorderedComponent.BorderColorProperty, static (target, value) =>
        {
            if (value is UIThemeColor borderColor && WebCssValues.ThemeColor(borderColor) is { Length: > 0 } css)
                _ = target.Style("border-color", css);
        }, ColorOperations);

        _ = WebComponentRendererBase.RenderProperty<UIThickness?>(context, root, IBorderedComponent.BorderThicknessProperty, static (target, value) =>
        {
            if (value is UIThickness borderThickness)
            {
                _ = target.Style("border-width", WebCssValues.Thickness(borderThickness));

                // A component with no edge of its own may lay out differently (a key-value list drops its rows' inset).
                if (WebClassNames.BorderNone(borderThickness) is { Length: > 0 } none)
                    _ = target.Class(none);
            }
        }, ThicknessOperations);

        _ = WebComponentRendererBase.RenderProperty<UICornerRadius?>(context, root, IBorderedComponent.BorderRadiusProperty, static (target, value) =>
        {
            if (value is UICornerRadius borderRadius)
                _ = target.Style("border-radius", WebCssValues.Radius(borderRadius));
        }, RadiusOperations);
    }
}
