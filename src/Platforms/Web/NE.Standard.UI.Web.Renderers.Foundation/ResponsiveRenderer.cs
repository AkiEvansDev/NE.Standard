using System;
using System.Collections.Concurrent;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a <see cref="UIResponsive{T}"/> property as one CSS custom property per breakpoint tier that is set.</summary>
public static class ResponsiveRenderer
{
    private static readonly WebDomOperation[] MarginOperations =
    [
        .. TierOperations(WebResponsiveCss.MarginVariable, WebDomConverters.ResponsiveThicknessBaseCss, WebDomConverters.ResponsiveThicknessSmCss, WebDomConverters.ResponsiveThicknessMdCss, WebDomConverters.ResponsiveThicknessXlCss, WebDomConverters.ResponsiveThicknessXxlCss),
        .. TierOperations(WebResponsiveCss.MarginAcrossVariable, WebDomConverters.ResponsiveThicknessHorizontalBaseCss, WebDomConverters.ResponsiveThicknessHorizontalSmCss, WebDomConverters.ResponsiveThicknessHorizontalMdCss, WebDomConverters.ResponsiveThicknessHorizontalXlCss, WebDomConverters.ResponsiveThicknessHorizontalXxlCss),
        .. TierOperations(WebResponsiveCss.MarginDownVariable, WebDomConverters.ResponsiveThicknessVerticalBaseCss, WebDomConverters.ResponsiveThicknessVerticalSmCss, WebDomConverters.ResponsiveThicknessVerticalMdCss, WebDomConverters.ResponsiveThicknessVerticalXlCss, WebDomConverters.ResponsiveThicknessVerticalXxlCss)
    ];

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveLayoutLength(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.ResponsiveLayoutLength,
            WebDomConverters.ResponsiveLayoutLengthBaseCss, WebDomConverters.ResponsiveLayoutLengthSmCss, WebDomConverters.ResponsiveLayoutLengthMdCss, WebDomConverters.ResponsiveLayoutLengthXlCss, WebDomConverters.ResponsiveLayoutLengthXxlCss);

    /// <summary>
    /// A component's own width or height: as <see cref="ApplyResponsiveLayoutLength(WebRenderContext, IHtmlElementBuilder, string, UIProperty, string)"/>,
    /// but <c>Fill</c> takes the parent's room less the component's margins on <paramref name="axis"/> (<see cref="ApplyResponsiveMargin"/>).
    /// </summary>
    public static void ApplyResponsiveSize(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName, UIOrientation axis)
    {
        if (axis == UIOrientation.Horizontal)
        {
            ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, static value => WebCssValues.ResponsiveSize(value, UIOrientation.Horizontal),
                WebDomConverters.ResponsiveWidthBaseCss, WebDomConverters.ResponsiveWidthSmCss, WebDomConverters.ResponsiveWidthMdCss, WebDomConverters.ResponsiveWidthXlCss, WebDomConverters.ResponsiveWidthXxlCss);
        }
        else
        {
            ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, static value => WebCssValues.ResponsiveSize(value, UIOrientation.Vertical),
                WebDomConverters.ResponsiveHeightBaseCss, WebDomConverters.ResponsiveHeightSmCss, WebDomConverters.ResponsiveHeightMdCss, WebDomConverters.ResponsiveHeightXlCss, WebDomConverters.ResponsiveHeightXxlCss);
        }
    }

    /// <summary>
    /// A component's margin as <c>--ui-margin</c>'s tiers, beside each tier's sides summed across and down, which is what a <c>Fill</c>
    /// size leaves out (<see cref="ApplyResponsiveSize"/>).
    /// </summary>
    public static void ApplyResponsiveMargin(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property)
        => _ = WebComponentRendererBase.RenderProperty<UIResponsive<UIThickness>?>(context, target, propertyOwnerTypeKey, property, static (element, value) =>
        {
            if (value is UIResponsive<UIThickness> margin)
                WebResponsiveCss.WriteMargin(element, margin);
        }, MarginOperations);

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

        // Built once per variable and its converters, since a size and a plain length may share a name: every component renders its
        // sizes and padding through here.
        ResponsiveProperty<T> responsive = ResponsiveProperty<T>.ByVariable.GetOrAdd((cssVariableName, baseConverter), static (key, arg) => new ResponsiveProperty<T>(key.Variable, arg.formatter,
            TierOperations(key.Variable, key.Converter, arg.smConverter, arg.mdConverter, arg.xlConverter, arg.xxlConverter)
        ), (formatter, smConverter, mdConverter, xlConverter, xxlConverter));

        _ = WebComponentRendererBase.RenderProperty(context, target, propertyOwnerTypeKey, property, responsive.Write, responsive.Operations);
    }

    private static WebDomOperation[] TierOperations(string cssVariableName, string baseConverter, string smConverter, string mdConverter, string xlConverter, string xxlConverter)
        =>
        [
            WebDomOperation.Style(cssVariableName, converter: baseConverter),
            WebDomOperation.Style(cssVariableName + "-sm", converter: smConverter),
            WebDomOperation.Style(cssVariableName + "-md", converter: mdConverter),
            WebDomOperation.Style(cssVariableName + "-xl", converter: xlConverter),
            WebDomOperation.Style(cssVariableName + "-xxl", converter: xxlConverter)
        ];

    /// <summary>One responsive custom property's operations and its static write, shared by every component rendering it.</summary>
    private sealed class ResponsiveProperty<T>(string cssVariableName, Func<T, string> formatter, WebDomOperation[] operations)
        where T : struct
    {
        public static readonly ConcurrentDictionary<(string Variable, string Converter), ResponsiveProperty<T>> ByVariable = new();

        public WebDomOperation[] Operations { get; } = operations;

        public Action<IHtmlElementBuilder, UIResponsive<T>?> Write { get; } = (target, value) =>
        {
            if (value is UIResponsive<T> responsive)
                WebResponsiveCss.WriteTiers(target, responsive, cssVariableName, formatter);
        };
    }
}
