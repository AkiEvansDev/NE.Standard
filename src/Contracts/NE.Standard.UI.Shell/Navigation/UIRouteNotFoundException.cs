using System;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// Thrown when a requested route has not been registered.
/// </summary>
[SuppressMessage("Design", "CA1032:Implement standard exception constructors", Justification = "This exception always carries the missing route; a route-less instance would not be meaningful.")]
public sealed class UIRouteNotFoundException : InvalidOperationException
{
    /// <summary>
    /// Gets the route that was not registered.
    /// </summary>
    public string Route { get; }

    /// <summary>
    /// Initializes a new instance for the specified route.
    /// </summary>
    public UIRouteNotFoundException(string route)
        : base($"Route '{route}' was not registered.")
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(route);
        Route = route;
    }
}
