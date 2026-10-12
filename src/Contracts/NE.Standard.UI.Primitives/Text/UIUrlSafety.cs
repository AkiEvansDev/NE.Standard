using System;
using System.Buffers;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// The platform-neutral half of the picture address rule: whether a picture may be fetched from an address, judged as the browser's
/// URL parser reads it; a platform's renderer and an effect that carries a picture (<c>ShowImageEffect</c>) ask the same check.
/// </summary>
public static class UIUrlSafety
{
    // What the browser's URL parser removes from anywhere in an address before reading it.
    private static readonly SearchValues<char> TabsAndBreaks = SearchValues.Create("\t\n\r");

    /// <summary>
    /// Whether a picture may be fetched from a string — an <c>img src</c> or a CSS <c>url()</c>: a path of this site, absolute or
    /// relative to the page (<c>img/x.png</c>), http(s), or an image data URL, as the browser reads the address, so neither
    /// <c>/\host</c> nor <c>/&lt;tab&gt;/host</c> passes as a path.
    /// </summary>
    public static bool IsSafeImageSource(string? candidate)
        => candidate is not null && TryReadImageSource(candidate, out _);

    /// <summary>
    /// The address as the browser reads it (<see cref="ReadAsBrowser"/>), when a picture may be fetched from it; mirrors
    /// <c>readImageSource</c> in <c>url-safety.ts</c>.
    /// </summary>
    public static bool TryReadImageSource(ReadOnlySpan<char> candidate, out ReadOnlySpan<char> source)
    {
        ReadOnlySpan<char> reading = ReadAsBrowser(candidate);

        // `data:` is narrowed to images, since a blanket `data:` would carry whatever an author was handed by a third party.
        var allowed = IsSitePath(reading)
            || IsRelativePath(reading)
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
    public static ReadOnlySpan<char> ReadAsBrowser(ReadOnlySpan<char> address)
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

    /// <summary>
    /// Whether an address as the browser reads it is a path relative to the page — <c>img/x.png</c>, <c>./x.png</c>, <c>x.png</c>:
    /// no scheme, and no slash or backslash first, which only a path of this site or another host starts with.
    /// </summary>
    private static bool IsRelativePath(ReadOnlySpan<char> reading)
        => reading.Length > 0 && reading[0] is not '/' and not '\\' && !HasScheme(reading);

    /// <summary>Whether the address starts with a scheme as the URL parser reads one: a letter, then letters, digits, <c>+</c>, <c>-</c> or <c>.</c>, then a colon.</summary>
    private static bool HasScheme(ReadOnlySpan<char> reading)
    {
        var colon = reading.IndexOf(':');

        if (colon <= 0 || !char.IsAsciiLetter(reading[0]))
            return false;

        foreach (var c in reading[1..colon])
        {
            if (!char.IsAsciiLetterOrDigit(c) && c is not '+' and not '-' and not '.')
                return false;
        }

        return true;
    }
}
