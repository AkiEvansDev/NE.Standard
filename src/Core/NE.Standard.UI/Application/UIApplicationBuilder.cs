using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Localization;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Views;

namespace NE.Standard.UI.Application;

/// <summary>
/// Builds UI application configuration, including routes, persistence, and localization.
/// </summary>
public sealed class UIApplicationBuilder
{
    private readonly UIPersistenceOptions _persistence = new();
    private readonly UIErrorHandlingOptions _errorHandling = new();
    private readonly UISecurityOptions _security = new();
    private readonly UISessionOptions _sessions = new();
    private readonly UIFileOptions _files = new();
    private readonly List<IUIViewFilter> _viewFilters = [];
    private readonly List<IUICommandFilter> _commandFilters = [];
    private readonly UILocalizationOptions _localization = new();
    private readonly List<ITranslationSource> _translationSources = [];
    private readonly UIApplicationThemeBuilder _theme = new();

    private string? _signInRoute;
    private string? _forbiddenRoute;

    /// <summary>
    /// Gets the route registry builder.
    /// </summary>
    public UIRouteRegistryBuilder Routes { get; } = new();

    /// <summary>
    /// Gets whether a not-found view has been configured.
    /// </summary>
    public bool HasNotFoundView => _errorHandling.NotFoundRoute is not null;

    /// <summary>
    /// Gets whether an error view has been configured.
    /// </summary>
    public bool HasErrorView => _errorHandling.ErrorRoute is not null;

    /// <summary>
    /// Gets whether a sign-in view has been configured.
    /// </summary>
    public bool HasSignInView => _signInRoute is not null;

    /// <summary>
    /// Gets whether a forbidden view has been configured.
    /// </summary>
    public bool HasForbiddenView => _forbiddenRoute is not null;

    /// <summary>
    /// Configures how long user sessions live and how the client carries its session id.
    /// </summary>
    public UIApplicationBuilder ConfigureSessions(Action<UISessionOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_sessions);

        return this;
    }

    /// <summary>
    /// Configures file transfer limits, retention and storage.
    /// </summary>
    public UIApplicationBuilder ConfigureFiles(Action<UIFileOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_files);
        _files.Validate();

        return this;
    }

    /// <summary>
    /// Configures how failures are surfaced, including what a failed command tells the user.
    /// </summary>
    public UIApplicationBuilder ConfigureErrorHandling(Action<UIErrorHandlingOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_errorHandling);

        return this;
    }

    /// <summary>
    /// Configures application-wide security, including what a route with no authorization attribute means.
    /// </summary>
    public UIApplicationBuilder ConfigureSecurity(Action<UISecurityOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_security);

        return this;
    }

    /// <summary>
    /// Registers a view filter that runs for every route, before the filters attached to it.
    /// </summary>
    public UIApplicationBuilder AddViewFilter(IUIViewFilter filter)
    {
        ArgumentNullException.ThrowIfNull(filter);

        _viewFilters.Add(filter);

        return this;
    }

    /// <summary>
    /// Registers a view filter resolved from the service provider on every request.
    /// </summary>
    public UIApplicationBuilder AddViewFilter<TFilter>(int order = 0)
        where TFilter : class, IUIViewFilter
    {
        _viewFilters.Add(new UIViewFilterServiceAdapter<TFilter>(order));

        return this;
    }

    /// <summary>
    /// Registers a command filter that runs for every command, before the filters attached to it.
    /// </summary>
    public UIApplicationBuilder AddCommandFilter(IUICommandFilter filter)
    {
        ArgumentNullException.ThrowIfNull(filter);

        _commandFilters.Add(filter);

        return this;
    }

    /// <summary>
    /// Registers a command filter resolved from the service provider on every invocation.
    /// </summary>
    public UIApplicationBuilder AddCommandFilter<TFilter>(int order = 0)
        where TFilter : class, IUICommandFilter
    {
        _commandFilters.Add(new UICommandFilterServiceAdapter<TFilter>(order));

        return this;
    }

    public UIApplicationBuilder ConfigurePersistence(Action<UIPersistenceOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_persistence);
        _persistence.Validate();

        return this;
    }

    /// <summary>
    /// Configures localization options.
    /// </summary>
    public UIApplicationBuilder ConfigureLocalization(Action<UILocalizationOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_localization);
        _localization.Validate();

        return this;
    }

    /// <summary>
    /// Adds an in-memory localization source.
    /// </summary>
    public UIApplicationBuilder AddLocalizationSource(IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> translations)
        => AddLocalizationSource(new DictionaryTranslationSource(translations));

    /// <summary>
    /// Adds a localization source.
    /// </summary>
    public UIApplicationBuilder AddLocalizationSource(ITranslationSource source)
    {
        ArgumentNullException.ThrowIfNull(source);

        _translationSources.Add(source);
        return this;
    }

    /// <summary>
    /// Configures application theme tokens.
    /// </summary>
    public UIApplicationBuilder ConfigureTheme(Action<UIApplicationThemeBuilder> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_theme);
        _ = _theme.Build();

        return this;
    }

    /// <summary>
    /// Registers a view route.
    /// </summary>
    public UIApplicationBuilder Route<TView>(string route)
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route<TView>(route);
        return this;
    }

    /// <summary>
    /// Registers a view route and configures its route metadata.
    /// </summary>
    public UIApplicationBuilder Route<TView>(string route, Action<UIRouteDefinitionBuilder> configure)
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route<TView>(route, configure);
        return this;
    }

    /// <summary>
    /// Registers a view route using a service-provider-based view factory.
    /// </summary>
    public UIApplicationBuilder Route<TView>(string route, Func<IServiceProvider, TView> factory, Action<UIRouteDefinitionBuilder>? configure = null)
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route(route, factory, configure);
        return this;
    }

    /// <summary>
    /// Registers a controller-backed view route.
    /// </summary>
    public UIApplicationBuilder Route<TView, TController>(string route)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route);
        return this;
    }

    /// <summary>
    /// Registers a controller-backed view route and configures its route metadata.
    /// </summary>
    public UIApplicationBuilder Route<TView, TController>(string route, Action<UIRouteDefinitionBuilder> configure)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, configure);
        return this;
    }

    /// <summary>
    /// Registers a controller-backed view route using a service-provider-based view factory.
    /// </summary>
    public UIApplicationBuilder Route<TView, TController>(string route, Func<IServiceProvider, TView> factory, Action<UIRouteDefinitionBuilder>? configure = null)
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, factory, configure);
        return this;
    }

    /// <summary>
    /// Registers a not-found view, shown when a requested route was not registered.
    /// </summary>
    public UIApplicationBuilder NotFoundView<TView>(string route = "/not-found")
        where TView : IUIView, IUIViewDefinition
        => NotFoundView<TView>(route, factory: null);

    /// <summary>
    /// Registers a not-found view using a service-provider-based view factory.
    /// </summary>
    public UIApplicationBuilder NotFoundView<TView>(string route, Func<IServiceProvider, TView>? factory)
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route(route, factory, configure: cfg => cfg.AllowAnonymous());
        _errorHandling.NotFoundRoute = UIRoutePath.Normalize(route);

        return this;
    }

    /// <summary>
    /// Registers a controller-backed not-found view, for a page that shows what was asked for.
    /// </summary>
    public UIApplicationBuilder NotFoundView<TView, TController>(string route = "/not-found")
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, configure: cfg => cfg.AllowAnonymous());
        _errorHandling.NotFoundRoute = UIRoutePath.Normalize(route);

        return this;
    }

    /// <summary>
    /// Registers an error view, shown when an unhandled exception occurs while resolving a view.
    /// </summary>
    public UIApplicationBuilder ErrorView<TView>(string route = "/error")
        where TView : IUIView, IUIViewDefinition
        => ErrorView<TView>(route, factory: null);

    /// <summary>
    /// Registers an error view using a service-provider-based view factory.
    /// </summary>
    public UIApplicationBuilder ErrorView<TView>(string route, Func<IServiceProvider, TView>? factory)
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route(route, factory, configure: cfg => cfg.AllowAnonymous());
        _errorHandling.ErrorRoute = UIRoutePath.Normalize(route);

        return this;
    }

    /// <summary>
    /// Registers a controller-backed error view, for a page that shows what failed.
    /// </summary>
    public UIApplicationBuilder ErrorView<TView, TController>(string route = "/error")
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, configure: cfg => cfg.AllowAnonymous());
        _errorHandling.ErrorRoute = UIRoutePath.Normalize(route);

        return this;
    }

    /// <summary>
    /// Registers a sign-in view, shown when a route refuses the current session.
    /// </summary>
    public UIApplicationBuilder SignInView<TView>(string route = "/sign-in")
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route<TView>(route, configure: cfg => cfg.AllowAnonymous());

        return SetSignInRoute(route);
    }

    /// <summary>
    /// Registers a controller-backed sign-in view, shown when a route refuses the current session.
    /// </summary>
    public UIApplicationBuilder SignInView<TView, TController>(string route = "/sign-in")
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, configure: cfg => cfg.AllowAnonymous());

        return SetSignInRoute(route);
    }

    /// <summary>
    /// Registered anonymous in both overloads above: a sign-in page that itself requires a session can only
    /// bounce a refused request back to itself.
    /// </summary>
    private UIApplicationBuilder SetSignInRoute(string route)
    {
        _signInRoute = UIRoutePath.Normalize(route);
        _security.SignInRoute = _signInRoute;

        return this;
    }

    /// <summary>
    /// Registers a forbidden view, shown when an authenticated session lacks the rights a route requires.
    /// </summary>
    public UIApplicationBuilder ForbiddenView<TView>(string route = "/forbidden")
        where TView : IUIView, IUIViewDefinition
    {
        _ = Routes.Route<TView>(route, configure: cfg => cfg.AllowAnonymous());

        return SetForbiddenRoute(route);
    }

    /// <summary>
    /// Registers a controller-backed forbidden view.
    /// </summary>
    public UIApplicationBuilder ForbiddenView<TView, TController>(string route = "/forbidden")
        where TView : IUIView, IUIViewDefinition
        where TController : IUIController, IUIContextController
    {
        _ = Routes.Route<TView, TController>(route, configure: cfg => cfg.AllowAnonymous());

        return SetForbiddenRoute(route);
    }

    /// <summary>
    /// Anonymous for the same reason the sign-in page is: the page that explains a refusal must not be able to
    /// refuse anyone itself.
    /// </summary>
    private UIApplicationBuilder SetForbiddenRoute(string route)
    {
        _forbiddenRoute = UIRoutePath.Normalize(route);
        _security.ForbiddenRoute = _forbiddenRoute;

        return this;
    }

    /// <summary>
    /// Builds the UI application using services from the specified provider.
    /// </summary>
    public UIApplication Build(IServiceProvider services)
    {
        ArgumentNullException.ThrowIfNull(services);

        services.GetService<IUIDefaultErrorPagesProvider>()?.ConfigureDefaultPages(this);

        _persistence.Validate();
        _localization.Validate();
        _sessions.Validate();
        _files.Validate();

        UIRouteRegistry routeRegistry = Routes.Build(services, _security);

        return new UIApplication(
            routeRegistry,
            ClonePersistenceOptions(_persistence),
            BuildTranslator(services),
            _theme.Build(),
            CloneErrorHandlingOptions(_errorHandling),
            CloneSecurityOptions(_security),
            CloneSessionOptions(_sessions),
            CloneFileOptions(_files),
            [.. _viewFilters.OrderBy(static filter => filter.Order)],
            [.. _commandFilters.OrderBy(static filter => filter.Order)]
        );
    }

    /// <inheritdoc cref="CloneSecurityOptions" />
    private static UIErrorHandlingOptions CloneErrorHandlingOptions(UIErrorHandlingOptions source)
        => new()
        {
            NotFoundRoute = source.NotFoundRoute,
            ErrorRoute = source.ErrorRoute,
            NotifyOnCommandFailure = source.NotifyOnCommandFailure,
            IncludeExceptionDetail = source.IncludeExceptionDetail,
            CommandRefusedMessage = source.CommandRefusedMessage,
            CommandFailedMessage = source.CommandFailedMessage
        };

    /// <summary>
    /// Copied field by field rather than handed over, so a caller keeping the builder cannot mutate a built
    /// application. Every option belongs here — one left out is silently ignored at runtime, which is exactly
    /// how <c>IdentitySource</c> first shipped broken.
    /// </summary>
    private static UISecurityOptions CloneSecurityOptions(UISecurityOptions source)
        => new()
        {
            DefaultPolicy = source.DefaultPolicy,
            SignInRoute = source.SignInRoute,
            ForbiddenRoute = source.ForbiddenRoute,
            IdentitySource = source.IdentitySource,
            PermissionClaimType = source.PermissionClaimType
        };

    /// <inheritdoc cref="CloneSecurityOptions" />
    private static UIFileOptions CloneFileOptions(UIFileOptions source)
        => new()
        {
            MaxFileSize = source.MaxFileSize,
            MaxFilesPerSelection = source.MaxFilesPerSelection,
            UploadRetention = source.UploadRetention,
            DownloadRetention = source.DownloadRetention,
            CleanupInterval = source.CleanupInterval,
            StorageRoot = source.StorageRoot
        };

    private static UISessionOptions CloneSessionOptions(UISessionOptions source)
        => new()
        {
            IdleTimeout = source.IdleTimeout,
            CleanupInterval = source.CleanupInterval,
            ClientKey = source.ClientKey
        };

    private static UIPersistenceOptions ClonePersistenceOptions(UIPersistenceOptions source)
        => new()
        {
            Lifetime = source.Lifetime,
            DisconnectedRetention = source.DisconnectedRetention,
            FlushSchedulerInterval = source.FlushSchedulerInterval,
            CleanupInterval = source.CleanupInterval
        };

    private UITranslationRegistry BuildTranslator(IServiceProvider services)
    {
        List<ITranslationSource> sources = [];

        foreach (ITranslationSource source in services.GetServices<ITranslationSource>())
            sources.Add(source);

        sources.AddRange(_translationSources);

        return new UITranslationRegistry(_localization.DefaultLanguage, sources);
    }
}
