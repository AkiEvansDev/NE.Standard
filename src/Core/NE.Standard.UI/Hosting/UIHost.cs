using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Hosting;

internal sealed partial class UIHost : IUIHost, IDisposable, IAsyncDisposable
{
    private const int MaxResolveViewAttempts = 4;

    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI view resolution failed for route '{Route}'.")]
        public static partial void ViewResolutionFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "UI view resolution exception handler failed for route '{Route}'.")]
        public static partial void ViewResolutionExceptionHandlerFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 3, Level = LogLevel.Debug, Message = "Attaching UI runtime for route '{Route}', session '{SessionId}', tab '{ClientWindowId}', instance '{InstanceId}'.")]
        public static partial void AttachingRuntime(ILogger logger, string route, string sessionId, string clientWindowId, string instanceId);

        [LoggerMessage(EventId = 4, Level = LogLevel.Information, Message = "Created UI runtime for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', active instances '{ActiveInstances}'.")]
        public static partial void CreatedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, int activeInstances);

        [LoggerMessage(EventId = 5, Level = LogLevel.Information, Message = "Reused UI runtime for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', attached '{Attached}', active instances '{ActiveInstances}'.")]
        public static partial void ReusedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, bool attached, int activeInstances);

        [LoggerMessage(EventId = 6, Level = LogLevel.Information, Message = "Detached UI instance for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', detached '{Detached}', active instances '{ActiveInstances}'.")]
        public static partial void DetachedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, bool detached, int activeInstances);

        [LoggerMessage(EventId = 7, Level = LogLevel.Debug, Message = "UI runtime detach skipped because instance '{InstanceId}' is not attached.")]
        public static partial void RuntimeDetachSkipped(ILogger logger, string instanceId);

        [LoggerMessage(EventId = 8, Level = LogLevel.Debug, Message = "Resolved UI runtime key for lifetime '{Lifetime}', route '{Route}', session '{SessionId}', tab '{ClientWindowId}', instance '{InstanceId}', key identity '{KeyIdentity}', key tab '{KeyWindowId}'.")]
        public static partial void RuntimeKeyResolved(ILogger logger, UIRuntimeLifetime lifetime, string route, string sessionId, string clientWindowId, string instanceId, string? keyIdentity, string? keyWindowId);

        [LoggerMessage(EventId = 11, Level = LogLevel.Debug, Message = "Adopted the runtime prepared for page '{PageId}' on route '{Route}', tab '{ClientWindowId}'.")]
        public static partial void AdoptedPreparedRuntime(ILogger logger, string pageId, string route, string clientWindowId);

        [LoggerMessage(EventId = 12, Level = LogLevel.Debug, Message = "Discarded the runtime prepared for page '{PageId}' on route '{Route}': tab '{ClientWindowId}' already had one.")]
        public static partial void DiscardedPreparedRuntime(ILogger logger, string pageId, string route, string clientWindowId);

        [LoggerMessage(EventId = 13, Level = LogLevel.Information, Message = "Dropped '{Count}' per-page runtime(s) tab '{ClientWindowId}' left behind by navigating to route '{Route}'.")]
        public static partial void DroppedLeftPageRuntimes(ILogger logger, int count, string clientWindowId, string route);

        [LoggerMessage(EventId = 9, Level = LogLevel.Debug, Message = "Updating UI runtime connection for route '{Route}', tab '{ClientWindowId}', old instance '{OldInstanceId}', new instance '{NewInstanceId}'.")]
        public static partial void UpdatingRuntimeConnection(ILogger logger, string route, string clientWindowId, string oldInstanceId, string newInstanceId);

        [LoggerMessage(EventId = 10, Level = LogLevel.Information, Message = "Rotated session id '{OldSessionId}' to '{NewSessionId}' after sign-in.")]
        public static partial void SessionIdRotated(ILogger logger, string oldSessionId, string newSessionId);
    }

    private readonly UIRuntimeStore _runtimeStore = new();
    private readonly ConcurrentDictionary<string, IUIViewFilter[]> _filterChains = new(StringComparer.Ordinal);
    private readonly RuntimeScheduler _scheduler;

    private readonly UIApplication _application;
    private readonly IServiceProvider _services;
    private readonly ILogger<UIHost> _logger;

    private readonly IUserSessionResolver _sessionResolver;
    private readonly IUIAuthorizationService _authorization;
    private readonly IResolveExceptionViewHandler _resolveViewExceptionHandler;

    public UIHost(UIApplication application, IServiceProvider services, ILogger<UIHost> logger)
    {
        ArgumentNullException.ThrowIfNull(application);
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(logger);

        _application = application;
        _services = services;
        _logger = logger;

        _sessionResolver = services.GetRequiredService<IUserSessionResolver>();
        _authorization = services.GetRequiredService<IUIAuthorizationService>();
        _resolveViewExceptionHandler = services.GetRequiredService<IResolveExceptionViewHandler>();

        _scheduler = new RuntimeScheduler(logger);

        _scheduler.Add(new UIFlushTask(
            _runtimeStore,
            () => ResolveClientServices().Updates,
            _logger,
            interval: application.Persistence.FlushSchedulerInterval,
            maxParallelFlushes: application.Persistence.MaxParallelFlushes
        ));

        _scheduler.Add(new UISessionCleanupTask(
            () => _services.GetRequiredService<IUserSessionStore>(),
            _logger,
            interval: application.Sessions.CleanupInterval,
            idleTimeout: application.Sessions.IdleTimeout
        ));

        _scheduler.Add(new UIFileCleanupTask(
            () => _services.GetRequiredService<IUIFileStore>(),
            _logger,
            interval: application.Files.CleanupInterval,
            uploadRetention: application.Files.UploadRetention,
            downloadRetention: application.Files.DownloadRetention
        ));

        _scheduler.Add(new UIRuntimeCleanupTask(
            _runtimeStore,
            _logger,
            interval: application.Persistence.CleanupInterval,
            retention: _application.Persistence.DisconnectedRetention
        ));

        _scheduler.Start();
    }

    private UIClientServices ResolveClientServices()
    {
        UIClientServices clientServices = new(
            Updates: _services.GetRequiredService<IUIUpdateSink>(),
            Dialogs: _services.GetRequiredService<IUIDialogService>(),
            Downloads: _services.GetRequiredService<IUIDownloadService>(),
            Uploads: _services.GetRequiredService<IUIUploadService>()
        );

        clientServices.Validate();

        return clientServices;
    }

    /// <inheritdoc />
    public async Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.Attach, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(sessionInit);

        request.Validate();

        UINavigationRequest current = request;
        IUserSessionContext? session = null;

        for (var attempt = 0; attempt < MaxResolveViewAttempts; attempt++)
        {
            UIRouteDefinition? route = null;

            try
            {
                if (session is null)
                {
                    session = await _sessionResolver
                        .ResolveAsync(sessionInit, cancellationToken)
                        .ConfigureAwait(false);

                    ValidateSession(session);

                    session = await RotateSessionIdIfPendingAsync(session, phase, cancellationToken).ConfigureAwait(false);

                    await PersistSessionAsync(session, cancellationToken).ConfigureAwait(false);
                }

                UIRouteEntry entry = _application.Routes.GetRequiredEntry(current.Route);

                route = entry.Definition;

                UIViewFilterContext filterContext = new(current, route, session, _services, phase);
                UIViewResolution? resolution = null;

                await RunViewFilterPipelineAsync(filterContext, () =>
                {
                    resolution = CreateViewResolution(entry, filterContext);
                    filterContext.Resolution = resolution;

                    return Task.CompletedTask;
                }).ConfigureAwait(false);

                // A redirect re-enters the loop from the top, resolving its own authorization and filters, within the same attempt count.
                if (filterContext.RedirectNavigation is UINavigationRequest redirect)
                {
                    current = redirect;
                    continue;
                }

                return resolution
                    ?? throw new InvalidOperationException($"A view filter short-circuited route '{current.Route}' without redirecting.");
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                Log.ViewResolutionFailed(_logger, exception, current.Route);

                UINavigationRequest? next = await TryHandleResolveViewExceptionAsync(
                    exception,
                    current,
                    sessionInit,
                    session,
                    route,
                    attempt,
                    cancellationToken
                ).ConfigureAwait(false);

                if (next is null)
                    throw;

                next.Validate();
                current = next;
            }
        }

        throw new InvalidOperationException($"View resolution exceeded {MaxResolveViewAttempts} attempts for route '{request.Route}'.");
    }

    /// <summary>
    /// Builds the route's view filter chain and runs the view resolution inside it.
    /// </summary>
    private Task RunViewFilterPipelineAsync(UIViewFilterContext context, Func<Task> resolveView)
    {
        IUIViewFilter[] filters = _filterChains.GetOrAdd(context.Route.Route, _ => BuildFilterChain(context.Route));

        Func<Task> next = resolveView;

        for (var i = filters.Length - 1; i >= 0; i--)
        {
            IUIViewFilter filter = filters[i];
            Func<Task> inner = next;

            next = () => filter.InvokeAsync(context, inner);
        }

        return next();
    }

    private IUIViewFilter[] BuildFilterChain(UIRouteDefinition route)
    {
        List<IUIViewFilter> filters = [new AuthorizationViewFilter(_authorization)];

        filters.AddRange(_application.ViewFilters);
        filters.AddRange(route.ViewFilters);

        return [.. filters.OrderBy(static filter => filter.Order)];
    }

    private static UIViewResolution CreateViewResolution(UIRouteEntry entry, UIViewFilterContext context)
    {
        UIViewResolution resolution = new()
        {
            Route = context.Route,
            Navigation = context.Navigation,
            View = entry.GetView(),
            Session = context.Session
        };

        resolution.Validate();

        return resolution;
    }

    /// <summary>
    /// Runs the route's authorization check as the first filter in the pipeline.
    /// </summary>
    private sealed class AuthorizationViewFilter(IUIAuthorizationService authorization) : IUIViewFilter
    {
        public int Order => int.MinValue;

        public Task InvokeAsync(UIViewFilterContext context, Func<Task> next)
        {
            ArgumentNullException.ThrowIfNull(context);
            ArgumentNullException.ThrowIfNull(next);

            EnsureAuthorized(context.Route, context.Session, authorization);

            return next();
        }
    }

    /// <summary>
    /// Replaces the session id once the session has gained an identity, moving its state to a freshly issued id.
    /// </summary>
    /// <remarks>
    /// Defends against session fixation; runs only on <see cref="UIViewRequestPhase.Open"/>, the one request that can hand the client its id.
    /// </remarks>
    private async ValueTask<IUserSessionContext> RotateSessionIdIfPendingAsync(IUserSessionContext session, UIViewRequestPhase phase, CancellationToken cancellationToken)
    {
        if (phase != UIViewRequestPhase.Open)
            return session;

        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        UserSessionState? stored = await store.TryGetAsync(session.SessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null || !stored.PendingIdRotation)
            return session;

        var rotatedId = CreateSessionId();

        await store.SaveAsync(stored with { SessionId = rotatedId, PendingIdRotation = false }, cancellationToken).ConfigureAwait(false);
        await store.RemoveAsync(stored.SessionId, cancellationToken).ConfigureAwait(false);

        Log.SessionIdRotated(_logger, stored.SessionId, rotatedId);

        return new UserSessionContext(
            rotatedId,
            session.Language,
            session.ThemeMode,
            session.IsAuthenticated,
            session.UserId,
            session.Roles,
            session.Permissions
        );
    }

    /// <summary>
    /// Issues an unguessable session id — a predictable one is a session-fixation invitation.
    /// </summary>
    private static string CreateSessionId()
        => Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

    /// <summary>
    /// Writes the resolved session to the store, which is the authority the live command check reads.
    /// </summary>
    /// <remarks>
    /// Done here rather than in the resolver, so it also holds for a custom <see cref="IUserSessionResolver"/>.
    /// </remarks>
    private async ValueTask PersistSessionAsync(IUserSessionContext session, CancellationToken cancellationToken)
    {
        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        UserSessionState? stored = await store.TryGetAsync(session.SessionId, cancellationToken).ConfigureAwait(false);

        DateTime utcNow = DateTime.UtcNow;

        await store.SaveAsync(new UserSessionState
        {
            SessionId = session.SessionId,
            Language = session.Language,
            ThemeMode = session.ThemeMode,
            IsAuthenticated = session.IsAuthenticated,
            UserId = session.UserId,
            Roles = session.Roles,
            Permissions = session.Permissions,
            // Carried over rather than recomputed: dropping it would cancel a pending rotation before it runs.
            PendingIdRotation = stored?.PendingIdRotation == true || IdentityChanged(stored, session),
            CreatedAtUtc = stored?.CreatedAtUtc ?? utcNow,
            LastSeenAtUtc = utcNow
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Whether the request changed who the session belongs to, which is what the id rotation defends.
    /// </summary>
    private static bool IdentityChanged(UserSessionState? stored, IUserSessionContext session)
        => stored is not null
        && (stored.IsAuthenticated != session.IsAuthenticated || !string.Equals(stored.UserId, session.UserId, StringComparison.Ordinal));

    private static void ValidateSession(IUserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.Language);
        ArgumentNullException.ThrowIfNull(session.Roles);
        ArgumentNullException.ThrowIfNull(session.Permissions);
    }

    private static void EnsureAuthorized(UIRouteDefinition route, IUserSessionContext session, IUIAuthorizationService authorization)
    {
        if (route.AllowAnonymous)
            return;

        if (!session.IsAuthenticated)
            throw new UnauthorizedAccessException($"Route '{route.Route}' requires authenticated session.");

        if (route.AccessRules.Length == 0)
            return;

        if (!authorization.IsAuthorized(session, route.AccessRules))
            throw new UIForbiddenAccessException($"Route '{route.Route}' is not authorized.");
    }

    private async ValueTask<UINavigationRequest?> TryHandleResolveViewExceptionAsync(Exception exception, UINavigationRequest navigation, UserSessionInitData sessionInit, IUserSessionContext? session, UIRouteDefinition? route, int attempt, CancellationToken cancellationToken)
    {
        try
        {
            ResolveExceptionViewContext context = new()
            {
                Exception = exception,
                Navigation = navigation,
                SessionInit = sessionInit,
                Session = session,
                Route = route,
                Attempt = attempt
            };

            context.Validate();

            return await _resolveViewExceptionHandler
                .HandleAsync(context, cancellationToken)
                .ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception handlerException)
        {
            Log.ViewResolutionExceptionHandlerFailed(_logger, handlerException, navigation.Route);
            return null;
        }
    }

    /// <inheritdoc />
    public Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, string clientWindowId, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        resolution.Validate();

        UIInstance instance = new()
        {
            Id = Guid.NewGuid().ToString("N"),
            WindowId = clientWindowId,
            Navigation = resolution.Navigation
        };

        return AttachRuntimeAsync(resolution, instance, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, UIInstance instance, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(instance);

        resolution.Validate();
        instance.Validate();

        UIHandle handle = new(instance, resolution.Session);

        Log.AttachingRuntime(_logger, resolution.Route.Route, resolution.Session.SessionId, instance.WindowId, instance.Id);

        if (resolution.Route.ControllerType is null)
        {
            RuntimeResolution staticResolution = new()
            {
                ViewResolution = resolution,
                Handle = handle,
                Runtime = null
            };

            staticResolution.Validate();

            return staticResolution;
        }

        UIRuntimeKey key = CreateRuntimeKey(
            _application.Persistence,
            resolution.Route,
            resolution.Session.SessionId,
            resolution.Navigation,
            handle.Instance.WindowId
        );

        Log.RuntimeKeyResolved(
            _logger,
            _application.Persistence.Lifetime,
            resolution.Route.Route,
            resolution.Session.SessionId,
            handle.Instance.WindowId,
            handle.Instance.Id,
            key.Identity,
            key.WindowId
        );

        await AdoptPreparedRuntimeAsync(key, handle).ConfigureAwait(false);

        UIRuntimeEntry entry = _runtimeStore.GetOrAdd(
            key,
            handle.Instance.Id,
            () => CreateRuntime(handle, resolution.Route, resolution.View),
            DateTime.UtcNow,
            ResolveFlushOptions(resolution.Route),
            out var created,
            out var attached,
            out var activeInstances
        );

        IUIRuntime runtime = entry.Runtime;

        // A real tab is presenting it now, so it stops being the render's provisional entry — see UIRuntimeEntry.IsAdopted.
        if (!string.Equals(handle.Instance.WindowId, handle.Instance.PageId, StringComparison.Ordinal))
            entry.MarkAdopted();

        if (created)
        {
            Log.CreatedRuntime(_logger, resolution.Route.Route, handle.Instance.WindowId, handle.Instance.Id, activeInstances);

            try
            {
                await runtime.InitializeAsync(cancellationToken).ConfigureAwait(false);
                await runtime.StartAsync(cancellationToken).ConfigureAwait(false);

                entry.MarkInitialized();
            }
            catch (Exception error)
            {
                entry.MarkInitializationFailed(error);

                if (_runtimeStore.Remove(key, out IUIRuntime? removed))
                    await removed!.DisposeAsync().ConfigureAwait(false);

                throw;
            }
        }
        else
        {
            // Waits in case the creator is still initializing, so a concurrent attach cannot use an unstarted runtime.
            await entry.Initialization.WaitAsync(cancellationToken).ConfigureAwait(false);

            Log.ReusedRuntime(_logger, resolution.Route.Route, handle.Instance.WindowId, handle.Instance.Id, attached, activeInstances);

            var oldInstanceId = runtime.Handle.Instance.Id;

            if (!StringComparer.Ordinal.Equals(oldInstanceId, handle.Instance.Id))
                Log.UpdatingRuntimeConnection(_logger, resolution.Route.Route, handle.Instance.WindowId, oldInstanceId, handle.Instance.Id);

            UpdateRuntimeConnection(runtime, handle);
        }

        await DropLeftPageRuntimesAsync(key).ConfigureAwait(false);

        RuntimeResolution runtimeResolution = new()
        {
            ViewResolution = resolution,
            Handle = handle,
            Runtime = runtime
        };

        runtimeResolution.Validate();

        return runtimeResolution;
    }

    /// <summary>
    /// Hands this attach the runtime the page render prepared for it, where there is one to hand over.
    /// </summary>
    private async Task AdoptPreparedRuntimeAsync(UIRuntimeKey key, UIHandle handle)
    {
        var pageId = handle.Instance.PageId;

        if (pageId is null || key.WindowId is null)
            return;

        UIRuntimeKey preparedKey = key with { WindowId = pageId };

        if (_runtimeStore.Rekey(preparedKey, key, out IUIRuntime? discarded))
        {
            Log.AdoptedPreparedRuntime(_logger, pageId, key.Route, key.WindowId);
            return;
        }

        if (discarded is null)
            return;

        Log.DiscardedPreparedRuntime(_logger, pageId, key.Route, key.WindowId);

        await discarded.DisposeAsync().ConfigureAwait(false);
    }

    /// <summary>
    /// Ends the runtimes this tab left behind on other addresses, which is what <c>PerPage</c> promises.
    /// </summary>
    private async Task DropLeftPageRuntimesAsync(UIRuntimeKey key)
    {
        if (_application.Persistence.Lifetime is not UIRuntimeLifetime.PerPage || key.WindowId is null)
            return;

        IUIRuntime[] left = _runtimeStore.RemoveWindowEntriesExcept(key.SessionId, key.WindowId, key);

        if (left.Length == 0)
            return;

        Log.DroppedLeftPageRuntimes(_logger, left.Length, key.WindowId, key.Route);

        for (var i = 0; i < left.Length; i++)
            await left[i].DisposeAsync().ConfigureAwait(false);
    }

    private static UIRuntimeKey CreateRuntimeKey(UIPersistenceOptions persistence, UIRouteDefinition route, string sessionId, UINavigationRequest navigation, string clientWindowId)
    {
        ArgumentNullException.ThrowIfNull(persistence);
        ArgumentNullException.ThrowIfNull(route);
        ArgumentNullException.ThrowIfNull(navigation);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        var identity = CreateRouteIdentity(route, navigation);

        return persistence.Lifetime switch
        {
            // Per-page and per-tab share a key; DropLeftPageRuntimesAsync is what tells them apart.
            UIRuntimeLifetime.PerPage or UIRuntimeLifetime.PerWindow => new UIRuntimeKey(sessionId, route.Route, identity, clientWindowId),
            // No tab in the key: one runtime per address for the whole client.
            UIRuntimeLifetime.PerClient => new UIRuntimeKey(sessionId, route.Route, identity, null),
            _ => throw new UnreachableException()
        };
    }

    /// <summary>
    /// The part of the address past the path: the route's declared identity parameters and values, or null when it declares none.
    /// </summary>
    private static string? CreateRouteIdentity(UIRouteDefinition route, UINavigationRequest navigation)
    {
        var names = route.IdentityParameters;

        if (names.Length == 0)
            return null;

        IReadOnlyDictionary<string, object?>? parameters = navigation.Parameters;
        StringBuilder identity = new();

        for (var i = 0; i < names.Length; i++)
        {
            if (i > 0)
                _ = identity.Append('&');

            _ = identity.Append(names[i]).Append('=');

            if (parameters is not null && parameters.TryGetValue(names[i], out var value))
                AppendIdentityValue(identity, value);
        }

        return identity.ToString();
    }

    private static void AppendIdentityValue(StringBuilder identity, object? value)
    {
        switch (value)
        {
            case null:
                break;
            case string text:
                _ = identity.Append(text);
                break;
            case IEnumerable many:
                var first = true;

                foreach (var item in many)
                {
                    if (!first)
                        _ = identity.Append(',');

                    AppendIdentityValue(identity, item);
                    first = false;
                }

                break;
            default:
                _ = identity.Append(Convert.ToString(value, CultureInfo.InvariantCulture));
                break;
        }
    }

    private IUIRuntime CreateRuntime(UIHandle handle, UIRouteDefinition route, CompiledView view)
    {
        Type controllerType = route.ControllerType
            ?? throw new InvalidOperationException($"Route '{route.Route}' does not declare a controller.");

        UIClientServices clientServices = ResolveClientServices();

        IUIController controller = CreateController(controllerType);

        IUIRuntime runtime = IsDirectRuntime(route)
            ? new UIDirectRuntime(handle, view, controller, clientServices, _application)
            : new UIBatchRuntime(handle, view, controller, _application);

        UIContext context = new(_logger, _services, _application.Translator, _application.ContentOrNull, route, handle, clientServices.Dialogs, clientServices.Downloads, clientServices.Uploads);

        context.AttachRuntime(runtime);

        if (controller is IUIContextController contextController)
            contextController.AttachContext(context);
        else
            throw new InvalidOperationException($"Controller '{controller.GetType().Name}' must implement '{nameof(IUIContextController)}'.");

        return runtime;
    }

    private IUIController CreateController(Type controllerType)
    {
        var service = _services.GetService(controllerType);

        if (service is not null)
        {
            return service is IUIController serviceController
                ? serviceController
                : throw new InvalidOperationException($"Registered controller '{controllerType.Name}' must implement '{nameof(IUIController)}'.");
        }

        var instance = ActivatorUtilities.CreateInstance(_services, controllerType);

        return instance is IUIController controller
            ? controller
            : throw new InvalidOperationException($"Controller type '{controllerType.Name}' must implement '{nameof(IUIController)}'.");
    }

    private static bool IsDirectRuntime(UIRouteDefinition route)
        => route.ControllerUpdateMode == UIControllerUpdateMode.Direct;

    private static UIFlushOptions ResolveFlushOptions(UIRouteDefinition route)
    {
        TimeSpan interval = route.FlushInterval ?? TimeSpan.FromMilliseconds(50);

        UIFlushOptions options = new(route.ControllerUpdateMode, interval);
        options.Validate();

        return options;
    }

    private void UpdateRuntimeConnection(IUIRuntime runtime, UIHandle handle)
    {
        if (runtime is not IUIRuntimeConnectionUpdater updater)
            throw new InvalidOperationException($"Runtime '{runtime.GetType().Name}' does not support connection refresh.");

        updater.UpdateConnection(handle, ResolveClientServices());
    }

    /// <inheritdoc />
    public IUIRuntime? TryGetRenderRuntime(UIViewResolution resolution)
    {
        ArgumentNullException.ThrowIfNull(resolution);

        if (resolution.Route.ControllerType is null)
            return null;

        var identity = CreateRouteIdentity(resolution.Route, resolution.Navigation);
        var sessionId = resolution.Session.SessionId;

        // PerClient puts no tab in the key, so the render can build the exact key the client will attach to.
        if (_application.Persistence.Lifetime is UIRuntimeLifetime.PerClient)
        {
            _ = _runtimeStore.TryGet(new UIRuntimeKey(sessionId, resolution.Route.Route, identity, null), out IUIRuntime? shared);
            return shared;
        }

        _ = _runtimeStore.TryGetSingle(sessionId, resolution.Route.Route, identity, out IUIRuntime? single);

        return single;
    }

    /// <inheritdoc />
    public bool DetachRuntime(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        var detached = _runtimeStore.Detach(instanceId, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

        if (runtime is null)
        {
            Log.RuntimeDetachSkipped(_logger, instanceId);
            return false;
        }

        if (runtime is IUIRuntimeConnectionUpdater updater)
            updater.DetachConnection(instanceId);

        UIHandle handle = runtime.Handle;

        Log.DetachedRuntime(_logger, handle.Instance.Navigation.Route, handle.Instance.WindowId, instanceId, detached, activeInstances);

        return detached;
    }

    /// <inheritdoc />
    public bool DetachRuntime(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        handle.Instance.Validate();

        UIRuntimeKey key = CreateRuntimeKey(handle);

        var detached = _runtimeStore.Detach(key, handle.Instance.Id, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

        if (runtime is IUIRuntimeConnectionUpdater updater)
            updater.DetachConnection(handle.Instance.Id);

        Log.DetachedRuntime(_logger, handle.Instance.Navigation.Route, handle.Instance.WindowId, handle.Instance.Id, detached, activeInstances);

        return detached;
    }

    private UIRuntimeKey CreateRuntimeKey(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        handle.Instance.Validate();

        // Uses the definition, not the route string, so a route that has gone missing still yields the same key as at attach.
        UIRouteDefinition route = _application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? entry)
            ? entry.Definition
            : new UIRouteDefinition { Route = UIRoutePath.Normalize(handle.Instance.Navigation.Route), ViewKey = handle.Instance.Navigation.Route };

        return CreateRuntimeKey(
            _application.Persistence,
            route,
            handle.Session.SessionId,
            handle.Instance.Navigation,
            handle.Instance.WindowId
        );
    }

    /// <inheritdoc />
    public Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(changeSet);

        changeSet.Validate();

        IUIRuntime runtime = GetRequiredRuntime(handle);

        return runtime.ProcessChangeSetFromUIAsync(changeSet, cancellationToken);
    }

    private IUIRuntime GetRequiredRuntime(UIHandle handle)
    {
        UIRuntimeKey key = CreateRuntimeKey(handle);

        return _runtimeStore.TryGetAttached(key, handle.Instance.Id, out IUIRuntime? runtime)
            ? runtime!
            : throw new InvalidOperationException($"Attached runtime for instance '{handle.Instance.Id}' was not found.");
    }

    /// <inheritdoc />
    public Task<UICommandExecutionResult> ProcessEventAsync(UIHandle handle, UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        IUIRuntime runtime = GetRequiredRuntime(handle);

        return runtime.ProcessEventAsync(handle, request, cancellationToken);
    }

    /// <inheritdoc />
    public Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        IUIRuntime runtime = GetRequiredRuntime(handle);

        return runtime.RequestItemWindowAsync(request, cancellationToken);
    }

    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(UIHandle handle, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);

        IUIRuntime runtime = GetRequiredRuntime(handle);

        return runtime.FlushAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        await _scheduler.DisposeAsync().ConfigureAwait(false);
        await _runtimeStore.DisposeAsync().ConfigureAwait(false);
    }

    /// <inheritdoc />
    public void Dispose()
    {
        _scheduler.Dispose();
        _runtimeStore.Dispose();
    }
}
