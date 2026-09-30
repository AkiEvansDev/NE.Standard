using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// Writes a responsive value as the custom-property tiers the stylesheet's <c>ui-responsive-property</c> chain reads: base under
/// the variable's own name, others under <c>-sm</c>, <c>-md</c>, <c>-xl</c>, <c>-xxl</c>.
/// </summary>
public static class WebResponsiveCss
{
    /// <summary>The margin's tiers, as the stylesheet's <c>margin</c> chain reads them.</summary>
    public const string MarginVariable = "--ui-margin";

    /// <summary>
    /// Each margin tier's left and right summed, and its top and bottom: what a <c>Fill</c> size leaves out, read by the stylesheet alone
    /// into <c>--ui-fill-width</c> and <c>--ui-fill-height</c>.
    /// </summary>
    public const string MarginAcrossVariable = "--ui-margin-x";
    public const string MarginDownVariable = "--ui-margin-y";

    /// <summary>Writes a margin's tiers beside each tier's sides summed across and down (<see cref="WebCssValues.ThicknessSum"/>).</summary>
    public static void WriteMargin(IHtmlElementBuilder target, UIResponsive<UIThickness> margin)
    {
        WriteTiers(target, margin, MarginVariable, WebCssValues.Thickness);
        WriteTiers(target, margin, MarginAcrossVariable, static side => WebCssValues.ThicknessSum(side, UIOrientation.Horizontal));
        WriteTiers(target, margin, MarginDownVariable, static side => WebCssValues.ThicknessSum(side, UIOrientation.Vertical));
    }

    /// <summary>Writes a component's own width or height, <c>Fill</c> less its margins on that axis (<see cref="WebCssValues.ResponsiveSize"/>).</summary>
    public static void WriteSize(IHtmlElementBuilder target, UIResponsive<UILayoutLength> size, string cssVariableName, UIOrientation axis)
    {
        if (axis == UIOrientation.Horizontal)
            WriteTiers(target, size, cssVariableName, static value => WebCssValues.ResponsiveSize(value, UIOrientation.Horizontal));
        else
            WriteTiers(target, size, cssVariableName, static value => WebCssValues.ResponsiveSize(value, UIOrientation.Vertical));
    }

    /// <summary>Writes every tier the value carries; a tier formatting to nothing is left unwritten, so the stylesheet's default wins there.</summary>
    public static void WriteTiers<T>(IHtmlElementBuilder target, UIResponsive<T> value, string cssVariableName, Func<T, string> formatter)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentException.ThrowIfNullOrWhiteSpace(cssVariableName);
        ArgumentNullException.ThrowIfNull(formatter);

        WriteTier(target, cssVariableName, formatter(value.Base));

        if (value.Sm is T sm)
            WriteTier(target, cssVariableName + "-sm", formatter(sm));

        if (value.Md is T md)
            WriteTier(target, cssVariableName + "-md", formatter(md));

        if (value.Xl is T xl)
            WriteTier(target, cssVariableName + "-xl", formatter(xl));

        if (value.Xxl is T xxl)
            WriteTier(target, cssVariableName + "-xxl", formatter(xxl));
    }

    private static void WriteTier(IHtmlElementBuilder target, string cssVariableName, string value)
    {
        if (!string.IsNullOrEmpty(value))
            _ = target.Style(cssVariableName, value);
    }
}
