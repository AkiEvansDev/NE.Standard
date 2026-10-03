using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
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
    private readonly UITemporalOptions _temporal = new();
    private readonly List<ITranslationSource> _translationSources = [];
    private readonly List<string> _frameworkLanguages = [];
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
    /// Registers a view filter resolved on every request from a service scope of the request's own, disposed when the page has
    /// been resolved.
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
    /// Registers a command filter resolved on every invocation from the page's service scope — the one its controller was built
    /// from.
    /// </summary>
    /// <remarks>
    /// Registered transient, a filter is built per command; registered scoped, it is the page's own, one for as long as the page
    /// lives, sharing the controller's scoped services (its <c>DbContext</c>). A disposable transient is held by that scope until
    /// the page ends, so a filter built per command is better not disposable.
    /// </remarks>
    public UIApplicationBuilder AddCommandFilter<TFilter>(int order = 0)
        where TFilter : class, IUICommandFilter
    {
        _commandFilters.Add(new UICommandFilterServiceAdapter<TFilter>(order));

        return this;
    }

    /// <summary>
    /// Configures the runtimes: their lifetime and retention, the flush and cleanup schedules, and the caps on what a session holds.
    /// </summary>
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
    /// Configures the application's dates and times where a field says nothing of its own: the framework's <c>yyyy-MM-dd</c> and
    /// <c>HH:mm</c> or the culture's patterns, how a clock counts its hours, and a date or time pattern for every language.
    /// </summary>
    /// <exception cref="InvalidOperationException">A pattern is outside the shared tokens, or it and the hour cycle disagree.</exception>
    public UIApplicationBuilder ConfigureTemporal(Action<UITemporalOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        configure(_temporal);
        _temporal.Validate();

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
    /// Turns on the framework's own words in the languages given — the core's and those of every package registered — ranked below
    /// the application's own sources, so any word of theirs overrides one.
    /// </summary>
    /// <remarks>
    /// English needs nothing: it is the floor every word falls back to. A language turned on here is not one the page can switch to
    /// until a source of the application names it. Ignored when an <see cref="ITranslator"/> is registered.
    /// </remarks>
    /// <exception cref="ArgumentException">A language is blank; one no source ships throws when the application is built.</exception>
    public UIApplicationBuilder AddFrameworkWords(params string[] languages)
    {
        ArgumentNullException.ThrowIfNull(languages);

        foreach (var language in languages)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(language, nameof(languages));

            if (!_frameworkLanguages.Contains(language, StringComparer.Ordinal))
                _frameworkLanguages.Add(language);
        }

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

        // The pages an application gets when it registered none are ordinary views, shipped once here rather than by each platform.
        if (!HasNotFoundView)
            _ = NotFoundView<DefaultNotFoundView>();

        if (!HasErrorView)
            _ = ErrorView<DefaultErrorView, DefaultErrorController>();

        _persistence.Validate();
        _localization.Validate();
        _temporal.Validate();
        _sessions.Validate();
        _files.Validate();

        UILocalizationOptions localization = CloneLocalizationOptions(_localization);
        UIMissingWords? missingWords = BuildMissingWords(services, localization);

        // Under key prefixes the report also names a view's static text that starts with none, which every language shows as written.
        UIUnkeyedWords? unkeyed = missingWords is null || localization.KeyPrefixes.Count == 0 ? null : new UIUnkeyedWords([.. localization.KeyPrefixes], missingWords);
        UIRouteRegistry routeRegistry = Routes.Build(services, _security, unkeyed is null ? null : unkeyed.Inspect);

        return new UIApplication(
            routeRegistry,
            ClonePersistenceOptions(_persistence),
            BuildTranslator(services, localization, missingWords),
            _theme.Build(),
            CloneErrorHandlingOptions(_errorHandling),
            CloneSecurityOptions(_security),
            CloneSessionOptions(_sessions),
            CloneFileOptions(_files),
            localization,
            CloneTemporalOptions(_temporal),
            missingWords,
            services.GetService<IUIContentAddressResolver>(),
            [.. _viewFilters.OrderBy(static filter => filter.Order)],
            [.. _commandFilters.OrderBy(static filter => filter.Order)]
        );
    }

    /// <inheritdoc cref="CloneSecurityOptions" />
    private static UILocalizationOptions CloneLocalizationOptions(UILocalizationOptions source)
    {
        UILocalizationOptions copy = new()
        {
            DefaultLanguage = source.DefaultLanguage,
            NegotiateLanguage = source.NegotiateLanguage,
            ReportMissingWords = source.ReportMissingWords
        };

        foreach (var prefix in source.KeyPrefixes)
            copy.KeyPrefixes.Add(prefix);

        return copy;
    }

    /// <inheritdoc cref="CloneSecurityOptions" />
    private static UITemporalOptions CloneTemporalOptions(UITemporalOptions source)
        => new()
        {
            FollowCulture = source.FollowCulture,
            HourCycle = source.HourCycle,
            DateFormat = source.DateFormat,
            TimeFormat = source.TimeFormat
        };

    /// <summary>
    /// The collector of missing words when the options turn it on, or, left to the platform, when the platform's defaults do.
    /// </summary>
    private static UIMissingWords? BuildMissingWords(IServiceProvider services, UILocalizationOptions localization)
    {
        var report = localization.ReportMissingWords ?? services.GetService<UIPlatformDefaults>()?.ReportMissingWords ?? false;

        if (!report)
            return null;

        ILoggerFactory? loggers = services.GetService<ILoggerFactory>();

        return new UIMissingWords(loggers is null ? NullLogger.Instance : loggers.CreateLogger<UIMissingWords>());
    }

    private static UIPersistenceOptions ClonePersistenceOptions(UIPersistenceOptions source)
        => new()
        {
            Lifetime = source.Lifetime,
            DisconnectedRetention = source.DisconnectedRetention,
            UnclaimedRenderRetention = source.UnclaimedRenderRetention,
            FlushSchedulerInterval = source.FlushSchedulerInterval,
            MaxParallelFlushes = source.MaxParallelFlushes,
            MaxQueuedChangeSets = source.MaxQueuedChangeSets,
            MaxRuntimesPerSession = source.MaxRuntimesPerSession,
            MaxUnclaimedRuntimesPerSession = source.MaxUnclaimedRuntimesPerSession,
            MaxRuntimesTotal = source.MaxRuntimesTotal,
            CleanupInterval = source.CleanupInterval
        };

    /// <summary>
    /// A registered <see cref="ITranslator"/> wins outright; only when none is registered is one built from the
    /// builder's own sources and default language.
    /// </summary>
    private ITranslator BuildTranslator(IServiceProvider services, UILocalizationOptions localization, UIMissingWords? missingWords)
    {
        if (services.GetService<ITranslator>() is ITranslator registered)
            return registered;

        List<ITranslationSource> sources = [];

        foreach (ITranslationSource source in services.GetServices<ITranslationSource>())
            sources.Add(source);

        sources.AddRange(_translationSources);

        return new UITranslationRegistry(localization.DefaultLanguage, sources, [.. services.GetServices<IUIStringsSource>()], [.. localization.KeyPrefixes], missingWords, [.. _frameworkLanguages]);
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
            CommandBusyMessage = source.CommandBusyMessage,
            CommandFailedMessage = source.CommandFailedMessage,
            ErrorPageMessage = source.ErrorPageMessage
        };

    /// <summary>
    /// Copies every option field by field, so a caller keeping the builder cannot mutate a built application —
    /// a field left out here is silently dropped at runtime.
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

    private static UISessionOptions CloneSessionOptions(UISessionOptions source)
        => new()
        {
            IdleTimeout = source.IdleTimeout,
            UnclaimedIdleTimeout = source.UnclaimedIdleTimeout,
            TouchResolution = source.TouchResolution,
            CleanupInterval = source.CleanupInterval,
            ClientKey = source.ClientKey,
            ClientKeyLifetime = source.ClientKeyLifetime
        };

    /// <inheritdoc cref="CloneSecurityOptions" />
    private static UIFileOptions CloneFileOptions(UIFileOptions source)
        => new()
        {
            MaxFileSize = source.MaxFileSize,
            MaxFilesPerSelection = source.MaxFilesPerSelection,
            MaxUploadBytesPerSession = source.MaxUploadBytesPerSession,
            MaxUploadBytesTotal = source.MaxUploadBytesTotal,
            UploadRetention = source.UploadRetention,
            DownloadRetention = source.DownloadRetention,
            CleanupInterval = source.CleanupInterval,
            StorageRoot = source.StorageRoot
        };
}
