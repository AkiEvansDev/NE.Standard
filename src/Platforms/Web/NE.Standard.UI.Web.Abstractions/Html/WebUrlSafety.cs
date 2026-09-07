using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Abstractions.Html;

/// <summary>
/// The single check every renderer uses before writing a bound value as a URL, so an authored <c>javascript:</c>
/// or otherwise unsafe scheme never reaches the DOM.
/// </summary>
public static class WebUrlSafety
{
    /// <summary>Whether a string may be safely rendered as a link target — an <c>a href</c>.</summary>
    public static bool IsSafeLink(string? candidate)
        => UIInlineMarkup.IsSafeUrl(candidate);

    /// <summary>Whether a string may be safely rendered as an image source — an <c>img src</c> or a CSS <c>url()</c>.</summary>
    public static bool IsSafeImageSource(string? candidate)
        => WebIconValue.IsAllowedSource(candidate);
}
