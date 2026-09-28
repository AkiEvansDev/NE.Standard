using System;
using System.Collections.Concurrent;
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

        // Built once per variable: every component renders its margin, sizes and padding through here.
        ResponsiveProperty<T> responsive = ResponsiveProperty<T>.ByVariable.GetOrAdd(cssVariableName, static (name, arg) => new ResponsiveProperty<T>(name, arg.formatter, [
            WebDomOperation.Style(name, converter: arg.baseConverter),
            WebDomOperation.Style(name + "-sm", converter: arg.smConverter),
            WebDomOperation.Style(name + "-md", converter: arg.mdConverter),
            WebDomOperation.Style(name + "-xl", converter: arg.xlConverter),
            WebDomOperation.Style(name + "-xxl", converter: arg.xxlConverter)
        ]), (formatter, baseConverter, smConverter, mdConverter, xlConverter, xxlConverter));

        _ = WebComponentRendererBase.RenderProperty(context, target, propertyOwnerTypeKey, property, responsive.Write, responsive.Operations);
    }

    /// <summary>One responsive custom property's operations and its static write, shared by every component rendering it.</summary>
    private sealed class ResponsiveProperty<T>(string cssVariableName, Func<T, string> formatter, WebDomOperation[] operations)
        where T : struct
    {
        public static readonly ConcurrentDictionary<string, ResponsiveProperty<T>> ByVariable = new(StringComparer.Ordinal);

        public WebDomOperation[] Operations { get; } = operations;

        public Action<IHtmlElementBuilder, UIResponsive<T>?> Write { get; } = (target, value) =>
        {
            if (value is UIResponsive<T> responsive)
                WebResponsiveCss.WriteTiers(target, responsive, cssVariableName, formatter);
        };
    }
}
