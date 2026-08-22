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

        if (!route.StartsWith('/'))
            route = "/" + route;

        return route.Length > 1
            ? route.TrimEnd('/')
            : route;
    }
}
