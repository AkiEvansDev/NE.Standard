using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Metrics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Models;
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

internal sealed partial class UIHost : IUIHost, IUISessions, IDisposable, IAsyncDisposable
{
    private const int MaxResolveViewAttempts = 4;

    private static partial class Log
    {
        [LoggerMessage(EventId = 21, Level = LogLevel.Information, Message = "Ended session '{SessionFingerprint}' and {RuntimeCount} page runtime(s) open under it.")]
        public static partial void SessionEnded(ILogger logger, UISessionFingerprint sessionFingerprint, int runtimeCount);

        [LoggerMessage(EventId = 22, Level = LogLevel.Debug, Message = "Telling connection '{InstanceId}' its session ended failed; it goes when it next reaches the server.")]
        public static partial void SessionEndNoticeFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 24, Level = LogLevel.Warning, Message = "Disposing the services of a runtime whose controller could not be built failed.")]
        public static partial void AbandonedScopeDisposeFailed(ILogger logger, Exception exception);

        [LoggerMessage(EventId = 23, Level = LogLevel.Debug, Message = "Telling a tab that shares the runtime of connection '{InstanceId}' its session ended failed; it goes when it next reaches the server.")]
        public static partial void SharedSessionEndNoticeFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI view resolution failed for route '{Route}'.")]
        public static partial void ViewResolutionFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 14, Level = LogLevel.Debug, Message = "UI view resolution for route '{Route}' was refused ({Reason}) and answered with route '{Answer}'.")]
        public static partial void ViewResolutionAnswered(ILogger logger, string route, string reason, string answer);

        [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "UI view resolution exception handler failed for route '{Route}'.")]
        public static partial void ViewResolutionExceptionHandlerFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 3, Level = LogLevel.Debug, Message = "Attaching UI runtime for route '{Route}', session '{SessionFingerprint}', tab '{ClientWindowId}', instance '{InstanceId}'.")]
        public static partial void AttachingRuntime(ILogger logger, string route, UISessionFingerprint sessionFingerprint, string clientWindowId, string instanceId);

        [LoggerMessage(EventId = 4, Level = LogLevel.Debug, Message = "Created UI runtime for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', active instances '{ActiveInstances}'.")]
        public static partial void CreatedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, int activeInstances);

        [LoggerMessage(EventId = 5, Level = LogLevel.Debug, Message = "Reused UI runtime for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', attached '{Attached}', active instances '{ActiveInstances}'.")]
        public static partial void ReusedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, bool attached, int activeInstances);

        [LoggerMessage(EventId = 6, Level = LogLevel.Debug, Message = "Detached UI instance for route '{Route}', tab '{ClientWindowId}', instance '{InstanceId}', detached '{Detached}', active instances '{ActiveInstances}'.")]
        public static partial void DetachedRuntime(ILogger logger, string route, string clientWindowId, string instanceId, bool detached, int activeInstances);

        [LoggerMessage(EventId = 7, Level = LogLevel.Debug, Message = "UI runtime detach skipped because instance '{InstanceId}' is not attached.")]
        public static partial void RuntimeDetachSkipped(ILogger logger, string instanceId);

        [LoggerMessage(EventId = 8, Level = LogLevel.Debug, Message = "Resolved UI runtime key for lifetime '{Lifetime}', route '{Route}', session '{SessionFingerprint}', tab '{ClientWindowId}', instance '{InstanceId}', key identity '{KeyIdentity}', key tab '{KeyWindowId}'.")]
        public static partial void RuntimeKeyResolved(ILogger logger, UIRuntimeLifetime lifetime, string route, UISessionFingerprint sessionFingerprint, string clientWindowId, string instanceId, string? keyIdentity, string? keyWindowId);

        [LoggerMessage(EventId = 11, Level = LogLevel.Debug, Message = "Adopted the runtime prepared for page '{PageId}' on route '{Route}', tab '{ClientWindowId}'.")]
        public static partial void AdoptedPreparedRuntime(ILogger logger, string pageId, string route, string clientWindowId);

        [LoggerMessage(EventId = 12, Level = LogLevel.Debug, Message = "Discarded the runtime prepared for page '{PageId}' on route '{Route}': tab '{ClientWindowId}' already had one.")]
        public static partial void DiscardedPreparedRuntime(ILogger logger, string pageId, string route, string clientWindowId);

        [LoggerMessage(EventId = 13, Level = LogLevel.Debug, Message = "Dropped '{Count}' per-page runtime(s) tab '{ClientWindowId}' left behind by navigating to route '{Route}'.")]
        public static partial void DroppedLeftPageRuntimes(ILogger logger, int count, string clientWindowId, string route);

        [LoggerMessage(EventId = 9, Level = LogLevel.Debug, Message = "Updating UI runtime connection for route '{Route}', tab '{ClientWindowId}', old instance '{OldInstanceId}', new instance '{NewInstanceId}'.")]
        public static partial void UpdatingRuntimeConnection(ILogger logger, string route, string clientWindowId, string oldInstanceId, string newInstanceId);

        [LoggerMessage(EventId = 10, Level = LogLevel.Information, Message = "Rotated session id '{OldSessionFingerprint}' to '{NewSessionFingerprint}' after sign-in.")]
        public static partial void SessionIdRotated(ILogger logger, UISessionFingerprint oldSessionFingerprint, UISessionFingerprint newSessionFingerprint);

        [LoggerMessage(EventId = 15, Level = LogLevel.Debug, Message = "Resolved route '{Route}' ({Phase}) in {ElapsedMs:F1} ms.")]
        public static partial void ViewResolved(ILogger logger, string route, UIViewRequestPhase phase, double elapsedMs);

        [LoggerMessage(EventId = 16, Level = LogLevel.Debug, Message = "Started the controller of route '{Route}' in {ElapsedMs:F1} ms.")]
        public static partial void RuntimeStarted(ILogger logger, string route, double elapsedMs);

        [LoggerMessage(EventId = 17, Level = LogLevel.Debug, Message = "Attached route '{Route}' to tab '{ClientWindowId}' in {ElapsedMs:F1} ms.")]
        public static partial void RuntimeAttached(ILogger logger, string route, string clientWindowId, double elapsedMs);

        [LoggerMessage(EventId = 18, Level = LogLevel.Debug, Message = "Applied {UpdateCount} client value(s) on route '{Route}' in {ElapsedMs:F1} ms, answering {ChangeCount} change(s).")]
        public static partial void ChangeSetProcessed(ILogger logger, int updateCount, string route, double elapsedMs, int changeCount);

        [LoggerMessage(EventId = 19, Level = LogLevel.Debug, Message = "Command '{Command}' on route '{Route}' {Outcome} in {ElapsedMs:F1} ms.")]
        public static partial void CommandCompleted(ILogger logger, string command, string route, string outcome, double elapsedMs);

        [LoggerMessage(EventId = 20, Level = LogLevel.Debug, Message = "Read an item window of {Count} ({Mode}) on route '{Route}' in {ElapsedMs:F1} ms, answering {ChangeCount} change(s).")]
        public static partial void ItemWindowRead(ILogger logger, int count, UIItemWindowMode mode, string route, double elapsedMs, int changeCount);
    }

    /// <summary>The store the flush pass walks; reachable so a benchmark can measure that walk without a host of its own.</summary>
    internal UIRuntimeStore RuntimeStore { get; } = new();

    private readonly UIUpdateDispatcher _dispatcher;
    private readonly ConcurrentDictionary<string, IUIViewFilter[]> _filterChains = new(StringComparer.Ordinal);
    private readonly RuntimeScheduler _scheduler;

    private readonly UIApplication _application;
    private readonly IServiceProvider _services;
    private readonly ILogger<UIHost> _logger;

    private readonly IUserSessionResolver _sessionResolver;
    private readonly IUIAuthorizationService _authorization;
    private readonly IResolveExceptionViewHandler _resolveViewExceptionHandler;
    private readonly UIMetrics _metrics;

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

        _dispatcher = new UIUpdateDispatcher(() => ResolveClientServices().Updates, _logger, maxQueued: application.Persistence.MaxQueuedChangeSets);

        _metrics = new UIMetrics(services.GetService<IMeterFactory>(), RuntimeStore, _dispatcher, services);

        _scheduler.Add(new UIFlushTask(RuntimeStore, _dispatcher, _logger, interval: application.Persistence.FlushSchedulerInterval, maxParallelFlushes: application.Persistence.MaxParallelFlushes, metrics: _metrics));
        // As often as the unclaimed timeout at least, or a crawler's sessions would wait out the long interval anyway.
        _scheduler.Add(new UISessionCleanupTask(() => _services.GetRequiredService<IUserSessionStore>(), () => _services.GetRequiredService<IUIFileStore>(), _logger, interval: Min(application.Sessions.CleanupInterval, application.Sessions.UnclaimedIdleTimeout), application.Sessions));
        _scheduler.Add(new UIFileCleanupTask(() => _services.GetRequiredService<IUIFileStore>(), _logger, interval: application.Files.CleanupInterval, uploadRetention: application.Files.UploadRetention, downloadRetention: application.Files.DownloadRetention));

        // The sweep runs as often as the shorter of the two retentions, or an unclaimed render would wait out the long interval
        // anyway and the short retention would buy nothing.
        TimeSpan runtimeSweep = Min(application.Persistence.CleanupInterval, application.Persistence.UnclaimedRenderRetention);

        _scheduler.Add(new UIRuntimeCleanupTask(RuntimeStore, _logger, interval: runtimeSweep, retention: _application.Persistence.DisconnectedRetention, unclaimedRetention: _application.Persistence.UnclaimedRenderRetention));

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

    /// <summary>The shorter of the two, ignoring a zero: a scheduled task's interval has to be positive.</summary>
    private static TimeSpan Min(TimeSpan first, TimeSpan second)
        => second > TimeSpan.Zero && second < first ? second : first;

    /// <inheritdoc />
    public async Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.Attach, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(sessionInit);

        request.Validate();

        UINavigationRequest current = request;
        IUserSessionContext? session = null;
        var started = Stopwatch.GetTimestamp();

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

                    UserSessions.Validate(session);

                    session = await PersistSessionAsync(session, sessionInit, phase, cancellationToken).ConfigureAwait(false);

                    // After the write, not before: an identity this very request brought (a host's principal) marks the rotation
                    // there, and rotating first would leave the id held while anonymous carrying it for the whole page.
                    session = await RotateSessionIdIfPendingAsync(session, phase, cancellationToken).ConfigureAwait(false);
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

                if (resolution is null)
                    throw new InvalidOperationException($"A view filter short-circuited route '{current.Route}' without redirecting.");

                TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

                Log.ViewResolved(_logger, current.Route, phase, elapsed.TotalMilliseconds);

                return resolution;
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                UINavigationRequest? next = await TryHandleResolveViewExceptionAsync(exception, current, sessionInit, session, route, attempt, cancellationToken).ConfigureAwait(false);

                // A reader sent to sign in, or an address that names no route, is the application working as meant once the
                // handler has answered it: a line for a debugging session, not a failure with a stack trace in every log.
                if (next is not null && exception is UnauthorizedAccessException or UIRouteNotFoundException)
                    Log.ViewResolutionAnswered(_logger, current.Route, exception is UIRouteNotFoundException ? "no such route" : "not authorized", next.Route);
                else
                    Log.ViewResolutionFailed(_logger, exception, current.Route);

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

    /// <summary>Replaces the session id once the session has gained an identity, moving its state to a freshly issued id.</summary>
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

        var rotatedId = UserSessions.NewId();

        await store.SaveAsync(stored with { SessionId = rotatedId, PendingIdRotation = false }, cancellationToken).ConfigureAwait(false);
        await store.RemoveAsync(stored.SessionId, cancellationToken).ConfigureAwait(false);
        await _services.GetRequiredService<IUIFileStore>().MoveSessionAsync(stored.SessionId, rotatedId, cancellationToken).ConfigureAwait(false);

        Log.SessionIdRotated(_logger, new UISessionFingerprint(stored.SessionId), new UISessionFingerprint(rotatedId));

        return new UserSessionContext(rotatedId, session.Language, session.ThemeMode, session.IsAuthenticated, session.UserId, session.Roles, session.Permissions);
    }

    /// <summary>Writes the resolved session to the store, which is the authority the live command check reads.</summary>
    /// <remarks>
    /// Done here rather than in the resolver, so it also holds for a custom <see cref="IUserSessionResolver"/>. A session only
    /// a page render has seen, anonymous, stays unclaimed — the short timeout — until a tab attaches: persisted rather than
    /// held back, since an id the store never saw is one the attach must not accept. Answers the session the request goes on
    /// with, which is a new anonymous one when the resolved session was removed while this request read it.
    /// </remarks>
    private async ValueTask<IUserSessionContext> PersistSessionAsync(IUserSessionContext session, UserSessionInitData sessionInit, UIViewRequestPhase phase, CancellationToken cancellationToken)
    {
        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        DateTime utcNow = DateTime.UtcNow;

        IUserSessionContext current = session;

        // Applied to what the store holds now, not to an earlier read, and never recreating: a stale read written back would
        // undo a sign-out or a role change made meanwhile.
        var updated = await store.TryUpdateAsync(session.SessionId, stored =>
        {
            current = AsStoredNow(session, stored);
            return ToStoredSession(current, stored, phase, utcNow);
        }, cancellationToken).ConfigureAwait(false);

        if (updated)
            return current;

        if (WasRemovedMeanwhile(session, sessionInit))
            session = new UserSessionContext(UserSessions.NewId(), session.Language, session.ThemeMode, isAuthenticated: false);

        await store.SaveAsync(ToStoredSession(session, stored: null, phase, utcNow), cancellationToken).ConfigureAwait(false);

        return session;
    }

    /// <summary>
    /// The session as the store holds it now, where the stock resolver only echoed an earlier read of it: a role revoked or a
    /// language picked since stands. The identity a host's principal brings, and whatever a resolver of the application's own
    /// answered, are the request's.
    /// </summary>
    private IUserSessionContext AsStoredNow(IUserSessionContext session, UserSessionState stored)
    {
        if (_sessionResolver is not StoredUserSessionResolver)
            return session;

        var claims = _application.Security.IdentitySource == UIIdentitySource.Claims;

        return claims
            ? new UserSessionContext(session.SessionId, stored.Language, stored.ThemeMode, session.IsAuthenticated, session.UserId, session.Roles, session.Permissions)
            : new UserSessionContext(session.SessionId, stored.Language, stored.ThemeMode, stored.IsAuthenticated, stored.UserId, stored.Roles, stored.Permissions);
    }

    private static UserSessionState ToStoredSession(IUserSessionContext session, UserSessionState? stored, UIViewRequestPhase phase, DateTime utcNow)
        => new()
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
            IsUnclaimed = phase == UIViewRequestPhase.Open && !session.IsAuthenticated && (stored is null || stored.IsUnclaimed),
            CreatedAtUtc = stored?.CreatedAtUtc ?? utcNow,
            LastSeenAtUtc = utcNow
        };

    /// <summary>
    /// Whether the request changed who the session belongs to, which is what the id rotation defends.
    /// </summary>
    private static bool IdentityChanged(UserSessionState? stored, IUserSessionContext session)
        => stored is not null
        && (stored.IsAuthenticated != session.IsAuthenticated || !string.Equals(stored.UserId, session.UserId, StringComparison.Ordinal));

    /// <summary>
    /// Whether the identity the request resolved came from a stored session that has been removed since — signed out, or ended
    /// from elsewhere — so it must not be brought back.
    /// </summary>
    /// <remarks>
    /// Under <see cref="UIIdentitySource.Session"/> an identity lives only in the store, so a presented id the store no longer
    /// holds cannot carry one; under <see cref="UIIdentitySource.Claims"/> the principal is the authority and is kept.
    /// </remarks>
    private bool WasRemovedMeanwhile(IUserSessionContext session, UserSessionInitData sessionInit)
        => session.IsAuthenticated
        && _application.Security.IdentitySource == UIIdentitySource.Session
        && string.Equals(sessionInit.SessionId, session.SessionId, StringComparison.Ordinal);

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
        var started = Stopwatch.GetTimestamp();

        Log.AttachingRuntime(_logger, resolution.Route.Route, new UISessionFingerprint(resolution.Session.SessionId), instance.WindowId, instance.Id);

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

        UIRuntimeKey key = CreateRuntimeKey(_application.Persistence, resolution.Route, resolution.Session.SessionId, resolution.Navigation, handle.Instance.WindowId);

        Log.RuntimeKeyResolved(
            _logger,
            _application.Persistence.Lifetime,
            resolution.Route.Route,
            new UISessionFingerprint(resolution.Session.SessionId),
            handle.Instance.WindowId,
            handle.Instance.Id,
            key.Identity,
            key.WindowId
        );

        await AdoptPreparedRuntimeAsync(key, handle).ConfigureAwait(false);

        // A page render's own attach names its page as its window; anything else is a real tab presenting the runtime.
        var adopted = !string.Equals(handle.Instance.WindowId, handle.Instance.PageId, StringComparison.Ordinal);

        UIRuntimeEntry? added = RuntimeStore.GetOrAdd(key, handle.Instance.Id, () => CreateRuntime(handle, resolution.Route, resolution.View), DateTime.UtcNow, ResolveFlushOptions(resolution.Route), _application.Persistence.MaxRuntimesPerSession, _application.Persistence.MaxUnclaimedRuntimesPerSession, adopted, out var created, out var attached, out var activeInstances, out IUIRuntime? evicted, out IUIRuntime? unused);

        // Built for a key another attach filled first, or a session that filled meanwhile; never started, so disposing is all of it.
        await DisposeIfAnyAsync(unused).ConfigureAwait(false);
        await DisposeIfAnyAsync(evicted).ConfigureAwait(false);

        UIRuntimeEntry entry = added ?? throw UIRuntimeStore.SessionFull(_application.Persistence.MaxRuntimesPerSession);
        IUIRuntime runtime = entry.Runtime;

        try
        {
            if (created)
            {
                _metrics.RuntimeCreated();

                Log.CreatedRuntime(_logger, resolution.Route.Route, handle.Instance.WindowId, handle.Instance.Id, activeInstances);

                try
                {
                    var starting = Stopwatch.GetTimestamp();

                    await runtime.InitializeAsync(cancellationToken).ConfigureAwait(false);
                    await runtime.StartAsync(cancellationToken).ConfigureAwait(false);

                    entry.MarkInitialized();

                    TimeSpan startElapsed = Stopwatch.GetElapsedTime(starting);

                    _metrics.RuntimeStarted(startElapsed);
                    Log.RuntimeStarted(_logger, resolution.Route.Route, startElapsed.TotalMilliseconds);
                }
                catch (Exception error)
                {
                    entry.MarkInitializationFailed(error);

                    if (RuntimeStore.Remove(key, out IUIRuntime? removed))
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

            if (runtime is IUIRuntimeConnectionUpdater connections)
                await connections.NotifyAttachedAsync(handle, cancellationToken).ConfigureAwait(false);

            // A connection that closed while this attach was under way may have had its disconnect handled before the store knew
            // of it; nothing would ever detach it then, and the runtime would count as connected for good.
            cancellationToken.ThrowIfCancellationRequested();
        }
        catch
        {
            ReleaseInstance(key, runtime, handle.Instance.Id);
            throw;
        }

        await DropLeftPageRuntimesAsync(key).ConfigureAwait(false);

        RuntimeResolution runtimeResolution = new()
        {
            ViewResolution = resolution,
            Handle = handle,
            Runtime = runtime
        };

        runtimeResolution.Validate();

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.RuntimeAttached(_logger, resolution.Route.Route, handle.Instance.WindowId, elapsed.TotalMilliseconds);

        return runtimeResolution;
    }

    private static ValueTask DisposeIfAnyAsync(IUIRuntime? runtime)
        => runtime?.DisposeAsync() ?? ValueTask.CompletedTask;

    /// <summary>Undoes an attach that failed after the store took it, in the store and on the runtime alike.</summary>
    private void ReleaseInstance(UIRuntimeKey key, IUIRuntime runtime, string instanceId)
    {
        _ = RuntimeStore.Detach(key, instanceId, DateTime.UtcNow, out _, out _);

        if (runtime is IUIRuntimeConnectionUpdater updater)
            updater.DetachConnection(instanceId);
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

        if (RuntimeStore.Rekey(preparedKey, key, out IUIRuntime? discarded))
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

        IUIRuntime[] left = RuntimeStore.RemoveWindowEntriesExcept(key.SessionId, key.WindowId, key);

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

    [SuppressMessage("Reliability", "CA2025:Ensure tasks using 'IDisposable' instances complete before the instances are disposed", Justification = "The abandoned scope is disposed by that task alone; nothing else disposes it.")]
    private UIRuntimeBase CreateRuntime(UIHandle handle, UIRouteDefinition route, CompiledView view)
    {
        Type controllerType = route.ControllerType
            ?? throw new InvalidOperationException($"Route '{route.Route}' does not declare a controller.");

        UIClientServices clientServices = ResolveClientServices();

        // A scope per runtime, gone with it: a controller's scoped dependencies (a DbContext) are its page's own, and a disposable
        // transient the root provider built would be tracked by the root until the host stops.
        AsyncServiceScope scope = _services.CreateAsyncScope();

        try
        {
            IUIController controller = CreateController(scope.ServiceProvider, controllerType);

            // Refused before a runtime is built around it, so nothing but the controller and its scope is left to let go of.
            if (controller is not IUIContextController contextController)
            {
                controller.Dispose();
                throw new InvalidOperationException($"Controller '{controller.GetType().Name}' must implement '{nameof(IUIContextController)}'.");
            }

            UIRuntimeBase runtime = IsDirectRuntime(route)
                ? new UIDirectRuntime(handle, view, controller, clientServices, _application)
                : new UIBatchRuntime(handle, view, controller, clientServices, _application);

            runtime.OwnServices(scope);

            UIContext context = new(_logger, scope.ServiceProvider, _application.Translator, _application.ContentOrNull, route, handle, clientServices.Dialogs, clientServices.Downloads, clientServices.Uploads);

            context.AttachRuntime(runtime);
            contextController.AttachContext(context);

            return runtime;
        }
        catch
        {
            // Not awaited, since the store's factory is synchronous; asynchronously all the same, because a scope holding a
            // service that is only IAsyncDisposable refuses a synchronous dispose.
            _ = DisposeAbandonedScopeAsync(scope);
            throw;
        }
    }

    private async Task DisposeAbandonedScopeAsync(AsyncServiceScope scope)
    {
        try
        {
            await scope.DisposeAsync().ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            Log.AbandonedScopeDisposeFailed(_logger, exception);
        }
    }

    private static IUIController CreateController(IServiceProvider services, Type controllerType)
    {
        var service = services.GetService(controllerType);

        if (service is not null)
        {
            return service is IUIController serviceController
                ? serviceController
                : throw new InvalidOperationException($"Registered controller '{controllerType.Name}' must implement '{nameof(IUIController)}'.");
        }

        var instance = ActivatorUtilities.CreateInstance(services, controllerType);

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

        // PerClient puts no tab in the key, so the render can build the exact key the client will attach to. One still
        // initializing is not read: the render then attaches to it, which waits for its start.
        if (_application.Persistence.Lifetime is UIRuntimeLifetime.PerClient)
        {
            _ = RuntimeStore.TryGetStarted(new UIRuntimeKey(sessionId, resolution.Route.Route, identity, null), out IUIRuntime? shared);
            return shared;
        }

        _ = RuntimeStore.TryGetSingle(sessionId, resolution.Route.Route, identity, out IUIRuntime? single);

        return single;
    }

    /// <inheritdoc />
    public bool DetachRuntime(string instanceId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        var detached = RuntimeStore.Detach(instanceId, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

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

        var detached = RuntimeStore.Detach(key, handle.Instance.Id, DateTime.UtcNow, out IUIRuntime? runtime, out var activeInstances);

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

        return CreateRuntimeKey(_application.Persistence, route, handle.Session.SessionId, handle.Instance.Navigation, handle.Instance.WindowId);
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(changeSet);

        changeSet.Validate();

        var started = Stopwatch.GetTimestamp();
        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false);

        ServerChangeSet changes = await entry.Runtime.ProcessChangeSetFromUIAsync(handle, changeSet, cancellationToken).ConfigureAwait(false);

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.ChangeSetProcessed(_logger, changeSet.Updates.Length, handle.Instance.Navigation.Route, elapsed.TotalMilliseconds, changes.Updates.Length);

        return changes;
    }

    private UIRuntimeEntry GetRequiredRuntimeEntry(UIHandle handle)
    {
        UIRuntimeKey key = CreateRuntimeKey(handle);

        return RuntimeStore.TryGetAttachedEntry(key, handle.Instance.Id, out UIRuntimeEntry? entry)
            ? entry!
            : throw new InvalidOperationException($"Attached runtime for instance '{handle.Instance.Id}' was not found.");
    }

    /// <summary>
    /// Refreshes the session's last-seen time from hub traffic, throttled to a tenth of the idle timeout, so a chatty tab
    /// isn't a write per message.
    /// </summary>
    /// <remarks>
    /// Otherwise a tab that only sends events, never reloading, would idle out while the connection stays alive and lose
    /// uploads to a 401. Only the time is touched, and never on a session that is gone: the handle's session is the one the tab
    /// attached with, and saving it would bring back a session signed out since, or roles revoked since.
    /// </remarks>
    private async Task RefreshSessionActivityAsync(UIHandle handle, UIRuntimeEntry entry, CancellationToken cancellationToken)
    {
        TimeSpan throttle = TimeSpan.FromTicks(_application.Sessions.IdleTimeout.Ticks / 10);

        if (!entry.ShouldPersistSessionActivity(DateTime.UtcNow, throttle))
            return;

        _ = await _services.GetRequiredService<IUserSessionStore>().TouchAsync(handle.Session.SessionId, DateTime.UtcNow, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UIHandle handle, UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false);

        // Tagged with the route's template, not the address, so a route with parameters is one series and not one per id.
        var route = _application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? routeEntry)
            ? routeEntry.Definition.Route
            : UIRoutePath.Normalize(handle.Instance.Navigation.Route);

        Activity? activity = UIMetrics.Activities.StartActivity("ui.command");
        _ = activity?.SetTag("ne.ui.route", route);

        // The name is looked up only for the debug line; the metric is tagged with the route alone.
        var command = _logger.IsEnabled(LogLevel.Debug) && entry.Runtime.View.Events.TryGet(request.EventId, out CompiledUIEvent? compiledEvent)
            ? compiledEvent.Command
            : null;

        var started = Stopwatch.GetTimestamp();
        var succeeded = false;
        Task<bool>? completion = null;

        try
        {
            UICommandExecutionResult result = await entry.Runtime.ProcessEventAsync(handle, request, cancellationToken).ConfigureAwait(false);
            succeeded = result.Command.Success;
            completion = result.Completion;

            return result;
        }
        finally
        {
            // An accepted background command is measured to its pushed result, not to the answer that it was accepted.
            if (completion is null)
                CompleteCommand(activity, route, command, succeeded, started);
            else
                _ = CompleteDetachedCommandAsync(completion, activity, route, command, started);
        }
    }

    private void CompleteCommand(Activity? activity, string route, string? command, bool succeeded, long started)
    {
        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        _metrics.CommandCompleted(route, succeeded, elapsed);
        _ = activity?.SetStatus(succeeded ? ActivityStatusCode.Ok : ActivityStatusCode.Error);
        activity?.Dispose();

        if (command is not null)
            Log.CommandCompleted(_logger, command, route, succeeded ? "succeeded" : "failed", elapsed.TotalMilliseconds);
    }

    private async Task CompleteDetachedCommandAsync(Task<bool> completion, Activity? activity, string route, string? command, long started)
    {
        // The run never faults: its failures are its result.
        var succeeded = await completion.ConfigureAwait(false);

        CompleteCommand(activity, route, command, succeeded, started);
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        var started = Stopwatch.GetTimestamp();
        IUIRuntime runtime = GetRequiredRuntimeEntry(handle).Runtime;

        // Answered to the tab that asked, not the runtime's connection: under PerClient another tab may be the one it answers for.
        ServerChangeSet changes = runtime is IUIRuntimeConnectionUpdater connections
            ? await connections.RequestItemWindowAsync(handle, request, cancellationToken).ConfigureAwait(false)
            : await runtime.RequestItemWindowAsync(request, cancellationToken).ConfigureAwait(false);

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.ItemWindowRead(_logger, request.Count, request.Mode, handle.Instance.Navigation.Route, elapsed.TotalMilliseconds, changes.Updates.Length);

        return changes;
    }

    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(UIHandle handle, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return GetRequiredRuntimeEntry(handle).Runtime.FlushAsync(cancellationToken);
    }

    /// <summary>
    /// Makes a session the page itself stored (its language switcher) this connection's, and on a new language tells the
    /// controller as a command runs; a page with no controller only has its handle refreshed.
    /// </summary>
    /// <remarks>
    /// The hub's half of what <see cref="UIContext.UpdateSessionAsync"/> does inside a command, where the page, having asked,
    /// switches itself: no effect is sent back.
    /// </remarks>
    internal async Task ApplySessionChangeAsync(UIHandle handle, UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(session);

        var previousLanguage = handle.Session.Language;

        handle.RefreshSession(session);

        if (string.Equals(previousLanguage, session.Language, StringComparison.Ordinal))
            return;

        if (RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out UIRuntimeEntry? entry) && entry!.Runtime is IUIRuntimeConnectionUpdater updater)
            await updater.NotifyLanguageChangedAsync(handle, previousLanguage, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task EndSessionAsync(string sessionId, UIHandle? except = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        await _services.GetRequiredService<IUserSessionStore>().RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);
        await _services.GetRequiredService<IUIFileStore>().RemoveSessionAsync(sessionId, cancellationToken).ConfigureAwait(false);

        UIRuntimeKey? keep = except is null ? null : CreateRuntimeKey(except);
        IUIRuntime[] ended = RuntimeStore.RemoveSession(sessionId, keep);

        // The asking page's runtime stays to finish its answer, but under PerClient other tabs share it; they go to sign in too.
        if (except is not null && keep is UIRuntimeKey kept && RuntimeStore.TryGet(kept, out IUIRuntime? shared) && shared is not null)
            await SendOthersAwayAsync(shared, except).ConfigureAwait(false);

        for (var i = 0; i < ended.Length; i++)
        {
            await SendViewersAwayAsync(ended[i]).ConfigureAwait(false);

            // Deferred by the runtime itself while a command still runs for it.
            await ended[i].DisposeAsync().ConfigureAwait(false);
        }

        Log.SessionEnded(_logger, new UISessionFingerprint(sessionId), ended.Length);
    }

    /// <summary>
    /// Sends every page of an ended runtime to sign in, or reloads it where no sign-in route is configured — a page left on
    /// screen would answer nothing, its runtime gone.
    /// </summary>
    private async Task SendViewersAwayAsync(IUIRuntime runtime)
    {
        if (runtime is not IUIRuntimeConnectionUpdater connections)
            return;

        IUIUpdateSink updates = _services.GetRequiredService<IUIUpdateSink>();

        foreach (UIHandle viewer in connections.ViewerHandles)
        {
            UICommandExecutionResult result = new()
            {
                Command = UICommandResult.Ok([new NavigateEffect(SignInOrReload(viewer.Instance.Navigation))]),
                Changes = ServerChangeSet.Empty
            };

            try
            {
                await updates.SendCommandResultAsync(viewer, result, CancellationToken.None).ConfigureAwait(false);
            }
            catch (Exception exception)
            {
                Log.SessionEndNoticeFailed(_logger, exception, viewer.Instance.Id);
            }
        }
    }

    private async Task SendOthersAwayAsync(IUIRuntime runtime, UIHandle except)
    {
        try
        {
            await runtime.SendEffectsToAllAsync([new NavigateEffect(SignInOrReload(except.Instance.Navigation))], except, CancellationToken.None).ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            Log.SharedSessionEndNoticeFailed(_logger, exception, except.Instance.Id);
        }
    }

    private UINavigationRequest SignInOrReload(UINavigationRequest page)
        => _application.Security.SignInRoute is { } signIn && _application.Routes.TryGetEntry(signIn, out _)
            ? new UINavigationRequest { Route = signIn, Parameters = new Dictionary<string, object?> { ["returnUrl"] = UINavigationAddress.Format(page) } }
            : page;

    /// <inheritdoc />
    public async Task<int> EndUserSessionsAsync(string userId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        IReadOnlyList<string> sessions = await _services.GetRequiredService<IUserSessionStore>().FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);

        for (var i = 0; i < sessions.Count; i++)
            await EndSessionAsync(sessions[i], except: null, cancellationToken).ConfigureAwait(false);

        return sessions.Count;
    }

    /// <inheritdoc />
    public async Task<int> UpdateUserSessionsAsync(string userId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(update);

        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        IReadOnlyList<string> sessions = await store.FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);
        var updated = 0;

        for (var i = 0; i < sessions.Count; i++)
        {
            if (await store.TryUpdateAsync(sessions[i], update, cancellationToken).ConfigureAwait(false))
                updated++;
        }

        return updated;
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        await _scheduler.DisposeAsync().ConfigureAwait(false);
        _dispatcher.Dispose();
        await RuntimeStore.DisposeAsync().ConfigureAwait(false);
        _metrics.Dispose();
    }

    /// <inheritdoc />
    public void Dispose()
    {
        _scheduler.Dispose();
        _dispatcher.Dispose();
        RuntimeStore.Dispose();
        _metrics.Dispose();
    }
}
