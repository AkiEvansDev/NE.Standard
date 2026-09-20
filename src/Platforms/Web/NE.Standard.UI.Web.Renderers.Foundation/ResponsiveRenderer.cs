using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a <see cref="UIResponsive{T}"/> property as one CSS custom property per breakpoint tier that is set.</summary>
public static class ResponsiveRenderer
{
    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveLayoutLength(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.ResponsiveLayoutLength,
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

    private static void ApplyResponsive<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName, Func<T, string> formatter, string baseConverter, string smConverter, string mdConverter, string xlConverter, string xxlConverter)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(cssVariableName);
        ArgumentNullException.ThrowIfNull(formatter);

        _ = WebComponentRendererBase.RenderProperty<UIResponsive<T>?>(context, target, propertyOwnerTypeKey, property, (t, value) =>
        {
            if (value is UIResponsive<T> responsive)
                WebResponsiveCss.WriteTiers(t, responsive, cssVariableName, formatter);
        }, [
            WebDomOperation.Style(cssVariableName, converter: baseConverter),
            WebDomOperation.Style(cssVariableName + "-sm", converter: smConverter),
            WebDomOperation.Style(cssVariableName + "-md", converter: mdConverter),
            WebDomOperation.Style(cssVariableName + "-xl", converter: xlConverter),
            WebDomOperation.Style(cssVariableName + "-xxl", converter: xxlConverter)
        ]);
    }
}
