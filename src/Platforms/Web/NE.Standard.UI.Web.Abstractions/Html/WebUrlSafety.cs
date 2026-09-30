using System;
using System.Buffers;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Web.Abstractions.Html;

/// <summary>
/// The single check every renderer uses before writing a bound value as a URL, so an authored <c>javascript:</c>
/// or otherwise unsafe scheme never reaches the DOM, and an address is judged as the browser will read it.
/// </summary>
public static class WebUrlSafety
{
    // What the browser's URL parser removes from anywhere in an address before reading it.
    private static readonly SearchValues<char> TabsAndBreaks = SearchValues.Create("\t\n\r");

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
    /// Whether a picture may be fetched from a string — an <c>img src</c> or a CSS <c>url()</c>: a path of this site, http(s), or
    /// an image data URL, as the browser reads the address, so neither <c>/\host</c> nor <c>/&lt;tab&gt;/host</c> passes as a path.
    /// </summary>
    public static bool IsSafeImageSource(string? candidate)
        => candidate is not null && TryReadImageSource(candidate, out _);

    /// <summary>
    /// The address as the browser reads it (<see cref="ReadAsBrowser"/>), when a picture may be fetched from it; mirrors
    /// <c>readImageSource</c> in <c>url-safety.ts</c>.
    /// </summary>
    internal static bool TryReadImageSource(ReadOnlySpan<char> candidate, out ReadOnlySpan<char> source)
    {
        ReadOnlySpan<char> reading = ReadAsBrowser(candidate);

        // `data:` is narrowed to images, since a blanket `data:` would carry whatever an author was handed by a third party.
        var allowed = IsSitePath(reading)
            || reading.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            || reading.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            || reading.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase);

        source = allowed ? reading : default;
        return allowed;
    }

    /// <summary>
    /// An address as the browser's URL parser reads it: the controls and spaces at either end (U+0000 to U+0020) stripped, and every
    /// tab and line break inside removed; mirrors <c>asBrowserReads</c> in <c>url-safety.ts</c>.
    /// </summary>
    internal static ReadOnlySpan<char> ReadAsBrowser(ReadOnlySpan<char> address)
    {
        var start = 0;
        var end = address.Length;

        while (start < end && address[start] <= ' ')
            start++;

        while (end > start && address[end - 1] <= ' ')
            end--;

        ReadOnlySpan<char> trimmed = address[start..end];

        // A copy only for the rare address with a tab or a break inside; any other is read in place.
        return trimmed.ContainsAny(TabsAndBreaks) ? WithoutTabsAndBreaks(trimmed) : trimmed;
    }

    private static string WithoutTabsAndBreaks(ReadOnlySpan<char> address)
    {
        Span<char> kept = address.Length <= 256 ? stackalloc char[address.Length] : new char[address.Length];
        var length = 0;

        foreach (var c in address)
        {
            if (!TabsAndBreaks.Contains(c))
                kept[length++] = c;
        }

        return kept[..length].ToString();
    }

    /// <summary>Whether an address as the browser reads it is a path under this site's root: one slash, then anything but a second one.</summary>
    private static bool IsSitePath(ReadOnlySpan<char> reading)
        // `//host` and `/\host` start with one slash too, and a browser reads both as another site: a backslash reads as a slash.
        => reading.Length > 1 && reading[0] == '/' && reading[1] is not '/' and not '\\';
}
