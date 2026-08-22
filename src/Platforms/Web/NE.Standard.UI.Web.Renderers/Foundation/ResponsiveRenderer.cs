using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders a <see cref="UIResponsive{T}"/>-typed property as a set of up to 5 CSS custom properties
/// (base always, <c>-sm</c>/<c>-md</c>/<c>-xl</c>/<c>-xxl</c> only for tiers actually set) under the given
/// variable name — the consuming stylesheet rule resolves the real CSS property from those variables via
/// a mobile-first <c>var()</c> fallback chain (see the <c>.ui-responsive-property</c> mixin). Exposes one
/// wrapper per value type currently used with <see cref="UIResponsive{T}"/> (<see cref="UILayoutLength"/>,
/// <see cref="UIThickness"/>, <see langword="double"/>) so call sites don't repeat the 5 converter names —
/// each wrapper reuses that type's existing single-value formatter/converter
/// (<see cref="WebCssValues.LayoutLength"/>/<see cref="WebCssValues.Thickness"/>/<see cref="WebCssValues.Pixels(double)"/>),
/// so adding a responsive property never needs a new formatter, only a new CSS variable name.
/// </summary>
public static class ResponsiveRenderer
{
    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveLayoutLength(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.LayoutLength,
            WebDomConverters.ResponsiveLayoutLengthBaseCss, WebDomConverters.ResponsiveLayoutLengthSmCss, WebDomConverters.ResponsiveLayoutLengthMdCss, WebDomConverters.ResponsiveLayoutLengthXlCss, WebDomConverters.ResponsiveLayoutLengthXxlCss);

    public static void ApplyResponsiveThickness(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveThickness(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveThickness(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UIThickness>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.Thickness,
            WebDomConverters.ResponsiveThicknessBaseCss, WebDomConverters.ResponsiveThicknessSmCss, WebDomConverters.ResponsiveThicknessMdCss, WebDomConverters.ResponsiveThicknessXlCss, WebDomConverters.ResponsiveThicknessXxlCss);

    public static void ApplyResponsiveSpacing(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveSpacing(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveSpacing(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<double>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.Pixels,
            WebDomConverters.ResponsivePixelsBaseCss, WebDomConverters.ResponsivePixelsSmCss, WebDomConverters.ResponsivePixelsMdCss, WebDomConverters.ResponsivePixelsXlCss, WebDomConverters.ResponsivePixelsXxlCss);

    private static void ApplyResponsive<T>(
        WebRenderContext context,
        IHtmlElementBuilder target,
        string propertyOwnerTypeKey,
        UIProperty property,
        string cssVariableName,
        Func<T, string> formatter,
        string baseConverter,
        string smConverter,
        string mdConverter,
        string xlConverter,
        string xxlConverter)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(cssVariableName);
        ArgumentNullException.ThrowIfNull(formatter);

        _ = WebComponentRendererBase.RenderProperty<UIResponsive<T>?>(context, target, propertyOwnerTypeKey, property, (t, value) =>
        {
            if (value is not UIResponsive<T> responsive)
                return;

            _ = t.Style(cssVariableName, formatter(responsive.Base));

            if (responsive.Sm is T sm)
                _ = t.Style(cssVariableName + "-sm", formatter(sm));

            if (responsive.Md is T md)
                _ = t.Style(cssVariableName + "-md", formatter(md));

            if (responsive.Xl is T xl)
                _ = t.Style(cssVariableName + "-xl", formatter(xl));

            if (responsive.Xxl is T xxl)
                _ = t.Style(cssVariableName + "-xxl", formatter(xxl));
        }, [
            WebDomOperation.Style(cssVariableName, converter: baseConverter),
            WebDomOperation.Style(cssVariableName + "-sm", converter: smConverter),
            WebDomOperation.Style(cssVariableName + "-md", converter: mdConverter),
            WebDomOperation.Style(cssVariableName + "-xl", converter: xlConverter),
            WebDomOperation.Style(cssVariableName + "-xxl", converter: xxlConverter)
        ]);
    }
}
