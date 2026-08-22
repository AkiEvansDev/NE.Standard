using System;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Navigation;

/// <summary>
/// What a view filter is given about the request it is intercepting.
/// </summary>
public sealed class UIViewFilterContext
{
    /// <summary>
    /// Creates a filter context for one view resolution attempt.
    /// </summary>
    public UIViewFilterContext(UINavigationRequest navigation, UIRouteDefinition route, IUserSessionContext session, IServiceProvider services, UIViewRequestPhase phase)
    {
        ArgumentNullException.ThrowIfNull(navigation);
        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(session);
        ArgumentNullException.ThrowIfNull(services);

        Navigation = navigation;
        Route = route;
        Session = session;
        Services = services;
        Phase = phase;
    }

    /// <summary>
    /// Gets the navigation being resolved.
    /// </summary>
    public UINavigationRequest Navigation { get; }

    /// <summary>
    /// Gets the route the navigation matched.
    /// </summary>
    public UIRouteDefinition Route { get; }

    /// <summary>
    /// Gets the resolved user session.
    /// </summary>
    public IUserSessionContext Session { get; }

    /// <summary>
    /// Gets the application service provider.
    /// </summary>
    public IServiceProvider Services { get; }

    /// <summary>
    /// Gets which half of the page request this is — see <see cref="UIViewRequestPhase"/>. A filter with a
    /// side effect has to test this, because one page load resolves the view twice.
    /// </summary>
    public UIViewRequestPhase Phase { get; }

    /// <summary>
    /// Gets the resolved view, available to a filter after it has awaited the rest of the pipeline.
    /// </summary>
    /// <remarks>
    /// Observation only. The host keeps its own result, so assigning this does not change what the request
    /// returns — to divert a request, use <see cref="Redirect"/> and do not call the next filter.
    /// </remarks>
    public UIViewResolution? Resolution { get; set; }

    /// <summary>
    /// Gets the navigation this request was diverted to, if any.
    /// </summary>
    public UINavigationRequest? RedirectNavigation { get; private set; }

    /// <summary>
    /// Diverts the request to another route. The host re-resolves from the start, so a redirect chain is
    /// bounded the same way the error handler's is.
    /// </summary>
    public void Redirect(UINavigationRequest navigation)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        navigation.Validate();

        RedirectNavigation = navigation;
    }
}
