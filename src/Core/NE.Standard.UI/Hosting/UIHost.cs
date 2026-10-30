using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Filters;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Security;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;

namespace NE.Standard.UI.Hosting;

internal sealed partial class UIHost : IUIHost, IUISessions, IUISessionSignIn, IDisposable, IAsyncDisposable
{
    private const int MaxResolveViewAttempts = 4;

    /// <summary>The shortest flush tick: a route asking for less would wake the scheduler on every thread-pool pass for nothing.</summary>
    private static readonly TimeSpan MinFlushTick = TimeSpan.FromMilliseconds(10);

    private static partial class Log
    {
        [LoggerMessage(EventId = 21, Level = LogLevel.Information, Message = "Ended session '{SessionFingerprint}' and {RuntimeCount} page runtime(s) open under it.")]
        public static partial void SessionEnded(ILogger logger, UISessionFingerprint sessionFingerprint, int runtimeCount);

        [LoggerMessage(EventId = 22, Level = LogLevel.Debug, Message = "Telling connection '{InstanceId}' its session ended failed; it goes when it next reaches the server.")]
        public static partial void SessionEndNoticeFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 24, Level = LogLevel.Warning, Message = "Disposing the services of a runtime whose controller could not be built failed.")]
        public static partial void AbandonedScopeDisposeFailed(ILogger logger, Exception exception);

        [LoggerMessage(EventId = 25, Level = LogLevel.Warning, Message = "Disposing the runtime of route '{Route}' failed; the others go on being disposed.")]
        public static partial void RuntimeDisposeFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 26, Level = LogLevel.Debug, Message = "Switching connection '{InstanceId}' to its session's new language or theme failed; it follows at its next render.")]
        public static partial void SessionReachFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 27, Level = LogLevel.Debug, Message = "An attach to route '{Route}' presented no session the store holds; none is issued, since the connection cannot hand the client its key.")]
        public static partial void SessionNotPresented(ILogger logger, string route);

        [LoggerMessage(EventId = 29, Level = LogLevel.Debug, Message = "An in-place navigation of route '{Route}' was refused by its view filters ({Reason}); the page loads the address instead.")]
        public static partial void InPlaceNavigationRefused(ILogger logger, string route, string reason);

        [LoggerMessage(EventId = 30, Level = LogLevel.Debug, Message = "The page of route '{Route}' no longer passes its rules for the session as stored; its runtime ends.")]
        public static partial void RouteNoLongerPasses(ILogger logger, string route);

        [LoggerMessage(EventId = 28, Level = LogLevel.Warning, Message = "The process holds {Limit} runtimes, every one with a page connected or a command running (UIPersistenceOptions.MaxRuntimesTotal); a new page's runtime is refused. Refusals in this burst are not logged again.")]
        public static partial void RuntimesFull(ILogger logger, int limit);

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

    /// <summary>The topics the host's runtimes take and the posts to them and to a user's pages, registered as <see cref="IUIBroadcast"/>.</summary>
    internal UIBroadcast Broadcast { get; }

    /// <summary>The queue every runtime's change sets go out through, the flush's and the answers' alike, one runtime's in order.</summary>
    internal UIUpdateDispatcher Dispatcher { get; }

    /// <summary>The host's instruments, for a runtime to record what only it sees.</summary>
    internal UIMetrics Metrics { get; }

    private readonly ConcurrentDictionary<string, IUIViewFilter[]> _filterChains = new(StringComparer.Ordinal);
    private readonly RuntimeScheduler _scheduler;

    private readonly UIApplication _application;
    private readonly IServiceProvider _services;
    private readonly ILogger<UIHost> _logger;

    private readonly IUserSessionResolver _sessionResolver;
    private readonly IUIAuthorizationService _authorization;
    private readonly IResolveExceptionViewHandler _resolveViewExceptionHandler;

    // Set by the first refusal on MaxRuntimesTotal, cleared by the next runtime built: a burst of refusals is logged once.
    private int _runtimesFullReported;

    // The key of a sign-in a page render's controller code made, until that render takes it; gone with the render's handle otherwise.
    private readonly ConditionalWeakTable<UIHandle, UISessionSecret> _renderKeys = [];

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

        Broadcast = new UIBroadcast(RuntimeStore, services);

        _scheduler = new RuntimeScheduler(logger);

        Dispatcher = new UIUpdateDispatcher(() => ResolveClientServices().Updates, _logger, maxQueued: application.Persistence.MaxQueuedChangeSets, maxQueuedBytes: application.Persistence.MaxQueuedChangeBytes ?? 0, sendTimeout: application.Persistence.SendTimeout ?? Timeout.InfiniteTimeSpan, maxTotalQueuedBytes: application.Persistence.MaxQueuedChangeBytesTotal ?? 0);

        Metrics = new UIMetrics(services.GetService<IMeterFactory>(), RuntimeStore, Dispatcher, services);

        if (application.Persistence.FlushSchedulerInterval != Timeout.InfiniteTimeSpan)
            _scheduler.Add(new UIFlushTask(RuntimeStore, _logger, interval: FlushTick(application), maxParallelFlushes: application.Persistence.MaxParallelFlushes, metrics: Metrics));

        // As often as the unclaimed timeout at least, or a crawler's sessions would wait out the long interval anyway.
        _scheduler.Add(new UISessionCleanupTask(() => _services.GetRequiredService<IUserSessionStore>(), (sessionId, _) => EndRemovedSessionAsync(sessionId, except: null), _logger, interval: Min(application.Sessions.CleanupInterval, application.Sessions.UnclaimedIdleTimeout), application.Sessions));
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
            Downloads: _services.GetRequiredService<IUIDownloadStager>(),
            Uploads: _services.GetRequiredService<IUIUploadService>()
        );

        clientServices.Validate();

        return clientServices;
    }

    /// <summary>
    /// How often the scheduled flush looks for a runtime due: the scheduler's interval, or a route's or controller's own where shorter,
    /// which the tick would otherwise round up to itself — never under <see cref="MinFlushTick"/>.
    /// </summary>
    internal static TimeSpan FlushTick(UIApplication application)
    {
        TimeSpan tick = application.Persistence.FlushSchedulerInterval;
        IReadOnlyList<UIRouteDefinition> routes = application.Routes.Routes;

        for (var i = 0; i < routes.Count; i++)
        {
            if (routes[i].FlushInterval is { } interval)
                tick = Min(tick, interval);
        }

        return tick < MinFlushTick ? MinFlushTick : tick;
    }

    /// <summary>The shorter of the two, ignoring a zero: a scheduled task's interval has to be positive.</summary>
    private static TimeSpan Min(TimeSpan first, TimeSpan second)
        => second > TimeSpan.Zero && second < first ? second : first;

    /// <inheritdoc />
    // Never null here: only a resolution that asks for a presented session answers none.
    public Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.Attach, CancellationToken cancellationToken = default)
        => ResolveViewCoreAsync(request, sessionInit, phase, presentedOnly: false, cancellationToken)!;

    /// <inheritdoc />
    /// <remarks>
    /// None presented, an unknown one, one gone idle: a connection cannot hand a client its secret, and a session nobody can present
    /// again is only memory held for nothing.
    /// </remarks>
    public Task<UIViewResolution?> ResolvePresentedViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, CancellationToken cancellationToken = default)
        => ResolveViewCoreAsync(request, sessionInit, UIViewRequestPhase.Attach, presentedOnly: true, cancellationToken);

    private async Task<UIViewResolution?> ResolveViewCoreAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase, bool presentedOnly, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(sessionInit);

        request.Validate();

        UINavigationRequest current = request;
        ResolvedSession? resolved = null;
        var started = Stopwatch.GetTimestamp();

        for (var attempt = 0; attempt < MaxResolveViewAttempts; attempt++)
        {
            UIRouteDefinition? route = null;

            try
            {
                if (resolved is null)
                {
                    resolved = await ResolveSessionAsync(sessionInit, phase, presentedOnly, cancellationToken).ConfigureAwait(false);

                    if (resolved is null)
                    {
                        Log.SessionNotPresented(_logger, request.Route);
                        return null;
                    }
                }

                ResolvedSession session = resolved.Value;

                UIRouteEntry entry = _application.Routes.GetRequiredEntry(current.Route);

                route = entry.Definition;

                (UIViewResolution? resolution, UINavigationRequest? redirected) = await RunViewFiltersAsync(entry, current, session, phase, sessionInit.Connection, cancellationToken).ConfigureAwait(false);

                // A redirect re-enters the loop from the top, resolving its own authorization and filters, within the same attempt count.
                if (redirected is UINavigationRequest redirect)
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
                UINavigationRequest? next = await TryHandleResolveViewExceptionAsync(exception, current, sessionInit, resolved?.Session, route, attempt, cancellationToken).ConfigureAwait(false);

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

    /// <summary>Runs the route's view filter chain around the view's resolution: answers the resolution, or where a filter redirected.</summary>
    private async Task<(UIViewResolution? Resolution, UINavigationRequest? Redirected)> RunViewFiltersAsync(UIRouteEntry entry, UINavigationRequest navigation, ResolvedSession session, UIViewRequestPhase phase, UIConnectionInfo connection, CancellationToken cancellationToken)
    {
        IUIViewFilter[] filters = GetFilterChain(entry.Definition);
        UIViewResolution? resolution = null;

        // A scope of the request's own, so a filter's scoped services are not the root's shared ones and its disposable
        // transients go with the request; the built-in check alone reads no services and is spared the scope.
        AsyncServiceScope? requestServices = filters.Length > 1 ? _services.CreateAsyncScope() : null;

        try
        {
            UIViewFilterContext filterContext = new(navigation, entry.Definition, session.Session, requestServices?.ServiceProvider ?? _services, phase, connection)
            {
                CancellationToken = cancellationToken
            };

            Func<Task> chain = UIFilterChain.Fold(filters, filterContext, () =>
            {
                resolution = CreateViewResolution(entry, filterContext, session);
                filterContext.Resolution = resolution;

                return Task.CompletedTask;
            });

            await chain().ConfigureAwait(false);

            return (resolution, filterContext.RedirectNavigation);
        }
        finally
        {
            if (requestServices is AsyncServiceScope scope)
                await scope.DisposeAsync().ConfigureAwait(false);
        }
    }

    private IUIViewFilter[] GetFilterChain(UIRouteDefinition route)
        => _filterChains.GetOrAdd(route.Route, static (_, state) => state.Host.BuildFilterChain(state.Route), (Host: this, Route: route));

    private IUIViewFilter[] BuildFilterChain(UIRouteDefinition route)
    {
        List<IUIViewFilter> filters = [new AuthorizationViewFilter(_authorization)];

        filters.AddRange(_application.ViewFilters);
        filters.AddRange(route.ViewFilters);

        return [.. filters.OrderBy(static filter => filter.Order)];
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

    private static void EnsureAuthorized(UIRouteDefinition route, IUserSessionContext session, IUIAuthorizationService authorization)
    {
        UIRouteAccessVerdict verdict = UIRouteAccess.Check(route, session, authorization);

        if (verdict == UIRouteAccessVerdict.SignIn)
            throw new UnauthorizedAccessException($"Route '{route.Route}' requires authenticated session.");

        if (verdict == UIRouteAccessVerdict.Forbidden)
            throw new UIForbiddenAccessException($"Route '{route.Route}' is not authorized.");
    }

    private static UIViewResolution CreateViewResolution(UIRouteEntry entry, UIViewFilterContext context, ResolvedSession session)
    {
        UIViewResolution resolution = new()
        {
            Route = context.Route,
            Navigation = context.Navigation,
            View = entry.GetView(),
            Session = context.Session,
            Connection = context.Connection,
            IssuedSecret = session.Issued
        };

        resolution.Validate();

        return resolution;
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
    public async ValueTask DisposeAsync()
    {
        await _scheduler.DisposeAsync().ConfigureAwait(false);
        Dispatcher.Dispose();

        try
        {
            await RuntimeStore.DisposeAsync().ConfigureAwait(false);
        }
        finally
        {
            Metrics.Dispose();
        }
    }

    /// <inheritdoc />
    public void Dispose()
    {
        _scheduler.Dispose();
        Dispatcher.Dispose();

        try
        {
            RuntimeStore.Dispose();
        }
        finally
        {
            Metrics.Dispose();
        }
    }
}
