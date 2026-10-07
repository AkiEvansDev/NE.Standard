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
        .. TierOperations(WebResponsiveCss.MarginVariable, WebDomConverters.ResponsiveThicknessCss),
        .. TierOperations(WebResponsiveCss.MarginAcrossVariable, WebDomConverters.ResponsiveThicknessHorizontalCss),
        .. TierOperations(WebResponsiveCss.MarginDownVariable, WebDomConverters.ResponsiveThicknessVerticalCss)
    ];

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveLayoutLength(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveLayoutLength(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UILayoutLength>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.ResponsiveLayoutLength, WebDomConverters.ResponsiveLayoutLengthCss);

    /// <summary>
    /// A component's own width or height: as <see cref="ApplyResponsiveLayoutLength(WebRenderContext, IHtmlElementBuilder, string, UIProperty, string)"/>,
    /// but <c>Fill</c> takes the parent's room less the component's margins on <paramref name="axis"/> (<see cref="ApplyResponsiveMargin"/>).
    /// </summary>
    public static void ApplyResponsiveSize(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName, UIOrientation axis)
        => ApplyResponsive(context, target, propertyOwnerTypeKey, property, cssVariableName, WebResponsiveCss.SizeFormatter(axis),
            axis == UIOrientation.Horizontal ? WebDomConverters.ResponsiveWidthCss : WebDomConverters.ResponsiveHeightCss);

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
        => ApplyResponsive<UIThickness>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.Thickness, WebDomConverters.ResponsiveThicknessCss);

    public static void ApplyResponsiveRadius(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveRadius(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveRadius(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<UICornerRadius>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.Radius, WebDomConverters.ResponsiveRadiusCss);

    public static void ApplyResponsiveSpacing(WebRenderContext context, IHtmlElementBuilder target, UIProperty property, string cssVariableName)
    {
        ArgumentNullException.ThrowIfNull(context);
        ApplyResponsiveSpacing(context, target, context.Node.TypeKey, property, cssVariableName);
    }

    public static void ApplyResponsiveSpacing(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName)
        => ApplyResponsive<double>(context, target, propertyOwnerTypeKey, property, cssVariableName, WebCssValues.Pixels, WebDomConverters.ResponsivePixelsCss);

    private static void ApplyResponsive<T>(WebRenderContext context, IHtmlElementBuilder target, string propertyOwnerTypeKey, UIProperty property, string cssVariableName, Func<T, string> formatter, WebResponsiveConverters converters)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(cssVariableName);
        ArgumentNullException.ThrowIfNull(formatter);

        // Built once per variable and its converters, since a size and a plain length may share a name: every component renders its
        // sizes and padding through here.
        ResponsiveProperty<T> responsive = ResponsiveProperty<T>.ByVariable.GetOrAdd((cssVariableName, converters), static (key, formatter)
            => new ResponsiveProperty<T>(key.Variable, formatter, TierOperations(key.Variable, key.Converters)), formatter);

        _ = WebComponentRendererBase.RenderProperty(context, target, propertyOwnerTypeKey, property, responsive.Write, responsive.Operations);
    }

    /// <summary>The patch operations of one responsive value: a custom property per tier, each through its tier's converter.</summary>
    internal static WebDomOperation[] TierOperations(string cssVariableName, WebResponsiveConverters converters)
        => TierOperations(cssVariableName, converters, WebDomOperation.Style);

    /// <summary>As <see cref="TierOperations(string, WebResponsiveConverters)"/>, but each tier through <paramref name="operation"/>: an attribute per tier.</summary>
    internal static WebDomOperation[] TierOperations(string name, WebResponsiveConverters converters, Func<string, string?, string?, WebDomOperation> operation)
    {
        ArgumentNullException.ThrowIfNull(converters);

        WebDomOperation[] operations = new WebDomOperation[converters.Names.Count];

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
            operations[(int)tier] = operation(WebResponsiveCss.TierName(name, tier), null, converters[tier]);

        return operations;
    }

    /// <summary>One responsive custom property's operations and its static write, shared by every component rendering it.</summary>
    private sealed class ResponsiveProperty<T>(string cssVariableName, Func<T, string> formatter, WebDomOperation[] operations)
        where T : struct
    {
        public static readonly ConcurrentDictionary<(string Variable, WebResponsiveConverters Converters), ResponsiveProperty<T>> ByVariable = new();

        public WebDomOperation[] Operations { get; } = operations;

        public Action<IHtmlElementBuilder, UIResponsive<T>?> Write { get; } = (target, value) =>
        {
            if (value is UIResponsive<T> responsive)
                WebResponsiveCss.WriteTiers(target, responsive, cssVariableName, formatter);
        };
    }
}
