using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace NE.Standard.UI.Navigation;

/// <summary>
/// Normalizes route path strings to a canonical form.
/// </summary>
public static class UIRoutePath
{
    /// <summary>
    /// Normalizes a route to a lowercase, leading-slash, no-trailing-slash form (e.g. <c>"/"</c> for a
    /// blank route, <c>"/foo"</c> for <c>"Foo/"</c>).
    /// </summary>
    public static string Normalize(string? route)
    {
        if (string.IsNullOrWhiteSpace(route))
            return "/";

        route = route.Trim().ToLowerInvariant();

        route = route.TrimEnd('/');

        // Trimmed first, so a route of slashes alone ("//") is the root rather than nothing.
        return route.StartsWith('/') ? route : "/" + route;
    }

    /// <summary>
    /// Whether an address is a path of this site — what a return address read off a query string must be before a command
    /// navigates to it.
    /// </summary>
    /// <remarks>
    /// <c>//host</c> and <c>/\host</c> start with a slash too, and a browser reads both as another site. A control character is refused
    /// anywhere: a browser drops a tab or a line break from a URL, so <c>/\t/host</c> is <c>//host</c> by the time it navigates. The
    /// client refuses a <c>NavigateEffect</c> to anything else as well (<c>isLocalRoute</c> in <c>url-safety.ts</c>).
    /// </remarks>
    public static bool IsLocal([NotNullWhen(true)] string? route)
        => route is { Length: > 0 } && route[0] == '/' && (route.Length == 1 || (route[1] != '/' && route[1] != '\\')) && !route.Any(char.IsControl);
}
