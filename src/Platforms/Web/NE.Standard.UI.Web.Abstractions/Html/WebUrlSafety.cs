using System;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Web.Abstractions.Html;

/// <summary>
/// The single check every renderer uses before writing a bound value as a URL, so an authored <c>javascript:</c>
/// or otherwise unsafe scheme never reaches the DOM, and an address is judged as the browser will read it.
/// </summary>
public static class WebUrlSafety
{
    /// <summary>Whether a string may be safely rendered as a link target — an <c>a href</c>.</summary>
    public static bool IsSafeLink(string? candidate)
        => UIInlineMarkup.IsSafeUrl(candidate);

    /// <summary>
    /// Whether a link leaves the application, so it opens beside it: a web, mail or phone address, or one the browser reads as
    /// another host — <c>//host</c>, <c>/\host</c>, <c>\\host</c>, behind a stripped control character or a tab; mirrors
    /// <c>isExternalLink</c> in <c>url-safety.ts</c>.
    /// </summary>
    public static bool IsExternalLink(string? candidate)
    {
        if (candidate is null)
            return false;

        ReadOnlySpan<char> reading = ReadAsBrowser(candidate);

        return (reading.Length > 1 && reading[0] is '/' or '\\' && reading[1] is '/' or '\\')
            || reading.StartsWith("http:", StringComparison.OrdinalIgnoreCase)
            || reading.StartsWith("https:", StringComparison.OrdinalIgnoreCase)
            || reading.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase)
            || reading.StartsWith("tel:", StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Whether a picture may be fetched from a string — an <c>img src</c> or a CSS <c>url()</c>; the rule is
    /// <see cref="UIUrlSafety.IsSafeImageSource"/>, which an effect carrying a picture asks too.
    /// </summary>
    public static bool IsSafeImageSource(string? candidate)
        => UIUrlSafety.IsSafeImageSource(candidate);

    /// <summary>The address as the browser reads it, when a picture may be fetched from it (<see cref="UIUrlSafety.TryReadImageSource"/>).</summary>
    internal static bool TryReadImageSource(ReadOnlySpan<char> candidate, out ReadOnlySpan<char> source)
        => UIUrlSafety.TryReadImageSource(candidate, out source);

    /// <summary>An address as the browser's URL parser reads it (<see cref="UIUrlSafety.ReadAsBrowser"/>).</summary>
    internal static ReadOnlySpan<char> ReadAsBrowser(ReadOnlySpan<char> address)
        => UIUrlSafety.ReadAsBrowser(address);
}
