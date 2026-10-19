using System;
using System.Runtime.CompilerServices;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// An address of this site an effect goes to, read as the route registry reads a route: a bare one — <c>"settings"</c>, the constant a
/// route was registered under — gains its leading slash; one with a slash or a scheme is left as written, for the page's own check. The
/// space around it goes. A query or a fragment alone (<c>"?page=2"</c>, <c>"#top"</c>) is refused: the page goes to no such address.
/// </summary>
internal static class UISiteAddress
{
    /// <exception cref="ArgumentException">The address is a query or a fragment alone.</exception>
    public static string Normalize(string address, [CallerArgumentExpression(nameof(address))] string? name = null)
    {
        var trimmed = address.Trim();

        if (trimmed.Length > 0 && trimmed[0] == '?')
            throw new ArgumentException($"'{trimmed}' is a query alone, which names no page to go to: a ReplaceAddressEffect or a PushAddressEffect writes the page's own query.", name);

        if (trimmed.Length > 0 && trimmed[0] == '#')
            throw new ArgumentException($"'{trimmed}' is a fragment alone, which names no page to go to: a ScrollToEffect brings a part of the page into view.", name);

        if (trimmed.Length == 0 || trimmed[0] is '/' or '\\' || HasScheme(trimmed))
            return trimmed;

        return "/" + trimmed;
    }

    /// <summary>Whether the address names a scheme — <c>https:</c>, <c>mailto:</c> — a colon before any slash, query or fragment.</summary>
    private static bool HasScheme(string address)
    {
        var colon = address.IndexOf(':', StringComparison.Ordinal);

        if (colon < 0)
            return false;

        var end = address.IndexOfAny(['/', '?', '#']);

        return end < 0 || colon < end;
    }
}
