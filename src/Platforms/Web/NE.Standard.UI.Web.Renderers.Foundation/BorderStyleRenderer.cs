using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders <see cref="IBorderedComponent"/>'s border colour, thickness and radius onto the element that draws the border: the
/// thickness and the radius as their breakpoint tiers, which the stylesheet's chains on that element read with its own defaults.
/// </summary>
public static class BorderStyleRenderer
{
    private static readonly WebDomOperation[] ColorOperations = [WebDomOperation.Style("border-color", converter: WebDomConverters.ThemeColorCss)];

    private static readonly WebDomOperation[] ThicknessOperations =
    [
        .. ResponsiveRenderer.TierOperations(WebResponsiveCss.BorderThicknessVariable, WebDomConverters.ResponsiveThicknessCss),
        WebDomOperation.Class(converter: WebDomConverters.BorderNoneClass)
    ];

    public static void RenderBorderStyle(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, root, IBorderedComponent.BorderColorProperty, static (target, value) =>
        {
            if (value is UIThemeColor borderColor && WebCssValues.ThemeColor(borderColor) is { Length: > 0 } css)
                _ = target.Style("border-color", css);
        }, ColorOperations);

        _ = WebComponentRendererBase.RenderProperty<UIResponsive<UIThickness>?>(context, root, IBorderedComponent.BorderThicknessProperty, static (target, value) =>
        {
            if (value is UIResponsive<UIThickness> borderThickness)
            {
                WebResponsiveCss.WriteTiers(target, borderThickness, WebResponsiveCss.BorderThicknessVariable, WebCssValues.Thickness);

                // A component with no edge of its own may lay out differently (a key-value list drops its rows' inset).
                if (WebClassNames.BorderNone(borderThickness) is { Length: > 0 } none)
                    _ = target.Class(none);
            }
        }, ThicknessOperations);

        ResponsiveRenderer.ApplyResponsiveRadius(context, root, IBorderedComponent.BorderRadiusProperty, WebResponsiveCss.BorderRadiusVariable);
    }
}
