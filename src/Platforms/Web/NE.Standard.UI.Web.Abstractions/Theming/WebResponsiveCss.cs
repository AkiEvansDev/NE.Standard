using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// Writes a responsive value as the custom-property tiers the stylesheet's <c>ui-responsive-property</c> chain reads: base under
/// the variable's own name, others under <c>-sm</c>, <c>-md</c>, <c>-xl</c>, <c>-xxl</c>.
/// </summary>
public static class WebResponsiveCss
{
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
