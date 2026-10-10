using System;
using System.Collections.Concurrent;
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
    /// <summary>A component's own size tiers, as the stylesheet's <c>width</c>, <c>min-width</c>, … chains read them.</summary>
    public const string WidthVariable = "--ui-width";
    public const string MinWidthVariable = "--ui-min-width";
    public const string MaxWidthVariable = "--ui-max-width";
    public const string HeightVariable = "--ui-height";
    public const string MinHeightVariable = "--ui-min-height";
    public const string MaxHeightVariable = "--ui-max-height";

    /// <summary>The margin's tiers, as the stylesheet's <c>margin</c> chain reads them.</summary>
    public const string MarginVariable = "--ui-margin";

    /// <summary>
    /// Each margin tier's left and right summed, and its top and bottom: what a <c>Fill</c> size leaves out, read by the stylesheet alone
    /// into <c>--ui-fill-width</c> and <c>--ui-fill-height</c>.
    /// </summary>
    public const string MarginAcrossVariable = "--ui-margin-x";
    public const string MarginDownVariable = "--ui-margin-y";

    /// <summary>A surface's padding tiers, as the stylesheet's <c>padding</c> chain reads them.</summary>
    public const string PaddingVariable = "--ui-padding";

    /// <summary>A border's thickness and its corners' tiers, read by the stylesheet's chains on the element that draws the border.</summary>
    public const string BorderThicknessVariable = "--ui-border-thickness";
    public const string BorderRadiusVariable = "--ui-border-radius";

    /// <summary>A placed child's column, row and spans, each with tiers of its own, read by its placement host's grid lines.</summary>
    public const string PlacementColumnVariable = "--ui-placement-column";
    public const string PlacementRowVariable = "--ui-placement-row";
    public const string PlacementColumnSpanVariable = "--ui-placement-column-span";
    public const string PlacementRowSpanVariable = "--ui-placement-row-span";

    private static readonly Func<UILayoutLength, string> WidthFormatter = static value => WebCssValues.ResponsiveSize(value, UIOrientation.Horizontal);
    private static readonly Func<UILayoutLength, string> HeightFormatter = static value => WebCssValues.ResponsiveSize(value, UIOrientation.Vertical);

    // Built once per name: every component writes its sizes and padding through here.
    private static readonly ConcurrentDictionary<string, string[]> TierNamesByName = new(StringComparer.Ordinal);

    // By UIResponsiveTier: the words the stylesheet's bands and the client's engines name the tiers by.
    private static readonly string[] TierWords = ["base", "sm", "md", "xl", "xxl"];

    /// <summary>A tier's own word — <c>base</c>, <c>sm</c>, <c>md</c>, <c>xl</c> or <c>xxl</c> — as a mark listing tiers writes it.</summary>
    public static string TierWord(UIResponsiveTier tier)
    {
        if (tier is < UIResponsiveTier.Base or > UIResponsiveTier.Xxl)
            throw new ArgumentOutOfRangeException(nameof(tier), tier, null);

        return TierWords[(int)tier];
    }

    /// <summary>
    /// The name a tier's value is written under: the name itself for the base tier, <c>-sm</c>, <c>-md</c>, <c>-xl</c> or <c>-xxl</c>
    /// after it for the others — a custom property's, or an attribute's (<c>data-ui-visibility-md</c>).
    /// </summary>
    public static string TierName(string name, UIResponsiveTier tier)
    {
        if (tier is < UIResponsiveTier.Base or > UIResponsiveTier.Xxl)
            throw new ArgumentOutOfRangeException(nameof(tier), tier, null);

        return TierNames(name)[(int)tier];
    }

    private static string[] TierNames(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return TierNamesByName.GetOrAdd(name, static key => [key, key + "-sm", key + "-md", key + "-xl", key + "-xxl"]);
    }

    /// <summary>Writes a margin's tiers beside each tier's sides summed across and down (<see cref="WebCssValues.ThicknessSum"/>).</summary>
    public static void WriteMargin(IHtmlElementBuilder target, UIResponsive<UIThickness> margin)
    {
        WriteTiers(target, margin, MarginVariable, WebCssValues.Thickness);
        WriteTiers(target, margin, MarginAcrossVariable, static side => WebCssValues.ThicknessSum(side, UIOrientation.Horizontal));
        WriteTiers(target, margin, MarginDownVariable, static side => WebCssValues.ThicknessSum(side, UIOrientation.Vertical));
    }

    /// <summary>Writes a component's own width or height, <c>Fill</c> less its margins on that axis (<see cref="WebCssValues.ResponsiveSize"/>).</summary>
    public static void WriteSize(IHtmlElementBuilder target, UIResponsive<UILayoutLength> size, string cssVariableName, UIOrientation axis)
        => WriteTiers(target, size, cssVariableName, SizeFormatter(axis));

    /// <summary>A width or a height tier's value, by axis (<see cref="WebCssValues.ResponsiveSize"/>).</summary>
    public static Func<UILayoutLength, string> SizeFormatter(UIOrientation axis)
        => axis == UIOrientation.Horizontal ? WidthFormatter : HeightFormatter;

    /// <summary>Writes every tier the value carries; a tier formatting to nothing is left unwritten, so the stylesheet's default wins there.</summary>
    public static void WriteTiers<T>(IHtmlElementBuilder target, UIResponsive<T> value, string cssVariableName, Func<T, string> formatter)
        where T : struct
    {
        ArgumentNullException.ThrowIfNull(target);
        ArgumentNullException.ThrowIfNull(formatter);

        var names = TierNames(cssVariableName);

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (value.Get(tier) is T tierValue && formatter(tierValue) is { Length: > 0 } css)
                _ = target.Style(names[(int)tier], css);
        }
    }
}
