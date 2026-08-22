using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Provides lookup access to registered UI routes.
/// </summary>
public interface IUIRouteRegistry
{
    /// <summary>
    /// Gets all registered route definitions.
    /// </summary>
    IReadOnlyList<UIRouteDefinition> Routes { get; }

    /// <summary>
    /// Attempts to resolve a route by URI string.
    /// </summary>
    bool TryGet(string uri, [NotNullWhen(true)] out UIRouteDefinition? route);

    /// <summary>
    /// Attempts to resolve a route by URI.
    /// </summary>
    bool TryGet(Uri uri, [NotNullWhen(true)] out UIRouteDefinition? route);
}
