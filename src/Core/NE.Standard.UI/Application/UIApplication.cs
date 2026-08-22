using System;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Application;

/// <summary>
/// Represents a configured UI application with routes, persistence options, and localization services.
/// </summary>
public sealed class UIApplication
{
    internal UIApplication(UIRouteRegistry routes, UIPersistenceOptions persistence, ITranslator translator, UITheme theme, UIErrorHandlingOptions errorHandling, UISecurityOptions security, UISessionOptions sessions, UIFileOptions files, IUIViewFilter[] viewFilters, IUICommandFilter[] commandFilters)
    {
        ArgumentNullException.ThrowIfNull(routes);
        ArgumentNullException.ThrowIfNull(persistence);
        ArgumentNullException.ThrowIfNull(translator);
        ArgumentNullException.ThrowIfNull(theme);
        ArgumentNullException.ThrowIfNull(errorHandling);
        ArgumentNullException.ThrowIfNull(security);
        ArgumentNullException.ThrowIfNull(sessions);
        ArgumentNullException.ThrowIfNull(files);
        ArgumentNullException.ThrowIfNull(viewFilters);
        ArgumentNullException.ThrowIfNull(commandFilters);

        persistence.Validate();
        theme.Validate();

        Routes = routes;
        Persistence = persistence;
        Translator = translator;
        Theme = theme;
        ErrorHandling = errorHandling;
        Security = security;
        Sessions = sessions;
        Files = files;
        ViewFilters = viewFilters;
        CommandFilters = commandFilters;
    }

    internal UIRouteRegistry Routes { get; }

    /// <summary>
    /// Gets lookup access to registered UI routes.
    /// </summary>
    public IUIRouteRegistry RouteRegistry => Routes;

    /// <summary>
    /// Gets runtime persistence options used by the application.
    /// </summary>
    public UIPersistenceOptions Persistence { get; }

    /// <summary>
    /// Gets the application translator.
    /// </summary>
    public ITranslator Translator { get; }

    /// <summary>
    /// Gets application theme tokens for both light and dark modes.
    /// </summary>
    public UITheme Theme { get; }

    /// <summary>
    /// Gets the not-found/error route configuration used by <see cref="IResolveExceptionViewHandler"/>.
    /// </summary>
    public UIErrorHandlingOptions ErrorHandling { get; }

    /// <summary>
    /// Gets application-wide security configuration.
    /// </summary>
    public UISecurityOptions Security { get; }

    /// <summary>
    /// Gets user session lifetime and transport configuration.
    /// </summary>
    public UISessionOptions Sessions { get; }

    /// <summary>
    /// Gets file transfer limits and lifetimes.
    /// </summary>
    public UIFileOptions Files { get; }

    /// <summary>
    /// Gets view filters that run for every route, already ordered.
    /// </summary>
    public IUIViewFilter[] ViewFilters { get; }

    /// <summary>
    /// Gets command filters that run for every command, already ordered.
    /// </summary>
    public IUICommandFilter[] CommandFilters { get; }
}
