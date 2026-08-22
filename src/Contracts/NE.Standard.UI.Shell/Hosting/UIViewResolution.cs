using System;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Represents a resolved route, compiled view, and user session.
/// </summary>
public sealed class UIViewResolution
{
    /// <summary>
    /// Gets the resolved route.
    /// </summary>
    public required UIRouteDefinition Route { get; init; }

    /// <summary>
    /// Gets the navigation request.
    /// </summary>
    public required UINavigationRequest Navigation { get; init; }

    /// <summary>
    /// Gets the compiled view.
    /// </summary>
    public required CompiledView View { get; init; }

    /// <summary>
    /// Gets the user session.
    /// </summary>
    public required IUserSessionContext Session { get; init; }

    /// <summary>
    /// Gets whether the resolved route declares a controller.
    /// </summary>
    public bool HasController => Route.ControllerType is not null;

    /// <summary>
    /// Validates the view resolution.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Route);
        ArgumentNullException.ThrowIfNull(Navigation);
        ArgumentNullException.ThrowIfNull(View);
        ArgumentNullException.ThrowIfNull(Session);

        Route.Validate();
        Navigation.Validate();

        ArgumentException.ThrowIfNullOrWhiteSpace(Session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(Session.Language);
        ArgumentNullException.ThrowIfNull(Session.Roles);
        ArgumentNullException.ThrowIfNull(Session.Permissions);
    }
}
