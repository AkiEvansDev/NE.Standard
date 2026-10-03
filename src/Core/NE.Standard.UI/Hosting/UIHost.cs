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
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Scheduling;
using NE.Standard.UI.Security;
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

        [LoggerMessage(EventId = 25, Level = LogLevel.Warning, Message = "Disposing the runtime of route '{Route}' failed; the others go on being disposed.")]
        public static partial void RuntimeDisposeFailed(ILogger logger, Exception exception, string route);

        [LoggerMessage(EventId = 26, Level = LogLevel.Debug, Message = "Switching connection '{InstanceId}' to its session's new language or theme failed; it follows at its next render.")]
        public static partial void SessionReachFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 27, Level = LogLevel.Debug, Message = "An attach to route '{Route}' presented no session the store holds; none is issued, since the connection cannot hand the client its key.")]
        public static partial void SessionNotPresented(ILogger logger, string route);

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

    // Set by the first refusal on MaxRuntimesTotal, cleared by the next runtime built: a burst of refusals is logged once.
    private int _runtimesFullReported;

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

        _dispatcher = new UIUpdateDispatcher(() => ResolveClientServices().Updates, _logger, maxQueued: application.Persistence.MaxQueuedChangeSets);

        _metrics = new UIMetrics(services.GetService<IMeterFactory>(), RuntimeStore, _dispatcher, services);

        _scheduler.Add(new UIFlushTask(RuntimeStore, _dispatcher, _logger, interval: application.Persistence.FlushSchedulerInterval, maxParallelFlushes: application.Persistence.MaxParallelFlushes, metrics: _metrics));
        // As often as the unclaimed timeout at least, or a crawler's sessions would wait out the long interval anyway.
        _scheduler.Add(new UISessionCleanupTask(() => _services.GetRequiredService<IUserSessionStore>(), (sessionId, cancellationToken) => EndRemovedSessionAsync(sessionId, except: null, cancellationToken), _logger, interval: Min(application.Sessions.CleanupInterval, application.Sessions.UnclaimedIdleTimeout), application.Sessions));
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
    public Task<UIViewResolution> ResolveViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, UIViewRequestPhase phase = UIViewRequestPhase.Attach, CancellationToken cancellationToken = default)
        // Never null here: only a resolution that asks for a presented session answers none.
        => ResolveViewCoreAsync(request, sessionInit, phase, presentedOnly: false, cancellationToken)!;

    /// <summary>
    /// The view a live connection attaches to, or null where the session it presented is not one the store holds — none, an unknown
    /// one, one gone idle — so that a new session would have to be issued: a connection cannot hand a client its secret, and a session
    /// nobody can present again is only memory held for nothing.
    /// </summary>
    internal Task<UIViewResolution?> ResolvePresentedViewAsync(UINavigationRequest request, UserSessionInitData sessionInit, CancellationToken cancellationToken = default)
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

                IUIViewFilter[] filters = GetFilterChain(route);
                UIViewResolution? resolution = null;
                UINavigationRequest? redirected;

                // A scope of the request's own, so a filter's scoped services are not the root's shared ones and its disposable
                // transients go with the request; the built-in check alone reads no services and is spared the scope.
                AsyncServiceScope? requestServices = filters.Length > 1 ? _services.CreateAsyncScope() : null;

                try
                {
                    UIViewFilterContext filterContext = new(current, route, session.Session, requestServices?.ServiceProvider ?? _services, phase, sessionInit.Connection);

                    await RunViewFilterPipelineAsync(filters, filterContext, () =>
                    {
                        resolution = CreateViewResolution(entry, filterContext, session);
                        filterContext.Resolution = resolution;

                        return Task.CompletedTask;
                    }).ConfigureAwait(false);

                    redirected = filterContext.RedirectNavigation;
                }
                finally
                {
                    if (requestServices is AsyncServiceScope scope)
                        await scope.DisposeAsync().ConfigureAwait(false);
                }

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
    /// Runs the view resolution inside the route's view filter chain.
    /// </summary>
    private static Task RunViewFilterPipelineAsync(IUIViewFilter[] filters, UIViewFilterContext context, Func<Task> resolveView)
    {
        Func<Task> next = resolveView;

        for (var i = filters.Length - 1; i >= 0; i--)
        {
            IUIViewFilter filter = filters[i];
            Func<Task> inner = next;

            next = () => filter.InvokeAsync(context, inner);
        }

        return next();
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

    /// <summary>The session a request goes on with, and the secret of one it issued, for the platform to hand the client.</summary>
    private readonly record struct ResolvedSession(IUserSessionContext Session, UISessionSecret? Issued);

    /// <summary>
    /// Resolves the request's session through the resolver, writes it to the store and moves it to a new id where a sign-in asked;
    /// null, with nothing written, where <paramref name="presentedOnly"/> and the request would go on under a session it issued.
    /// </summary>
    private async Task<ResolvedSession?> ResolveSessionAsync(UserSessionInitData sessionInit, UIViewRequestPhase phase, bool presentedOnly, CancellationToken cancellationToken)
    {
        IUserSessionContext session = await _sessionResolver.ResolveAsync(sessionInit, cancellationToken).ConfigureAwait(false);

        UserSessions.Validate(session);

        UISessionSecret? issued = IssuedSecretOf(sessionInit, session);

        if (presentedOnly && issued is not null)
            return null;

        ResolvedSession? persisted = await PersistSessionAsync(new ResolvedSession(session, issued), sessionInit, phase, presentedOnly, cancellationToken).ConfigureAwait(false);

        if (persisted is not ResolvedSession written)
            return null;

        // After the write, not before: an identity this very request brought (a host's principal) marks the rotation there, and
        // rotating first would leave the id held while anonymous carrying it for the whole page.
        return await RotateSessionIdIfPendingAsync(written, phase, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>The secret this request issued for the session it resolved, where it issued one.</summary>
    /// <remarks>Only where the resolver took the id it was offered: one it made up has no secret to hand out.</remarks>
    private static UISessionSecret? IssuedSecretOf(UserSessionInitData sessionInit, IUserSessionContext session)
        => sessionInit.IssuedSecret is { } secret && string.Equals(secret.SessionId, session.SessionId, StringComparison.Ordinal) ? secret : null;

    /// <summary>Writes the resolved session to the store, which is the authority the live command check reads.</summary>
    /// <remarks>
    /// Done here rather than in the resolver, so it also holds for a custom <see cref="IUserSessionResolver"/>. A session only
    /// a page render has seen, anonymous, stays unclaimed — the short timeout — until a tab attaches: persisted rather than
    /// held back, since an id the store never saw is one the attach must not accept. A write that would move nothing but the
    /// last-seen time, by less than <see cref="UISessionOptions.TouchResolution"/>, is left out. Answers the session the request
    /// goes on with, which is a new anonymous one when the resolved session was removed while this request read it — or none where
    /// <paramref name="presentedOnly"/>, since that new one would be issued.
    /// </remarks>
    private async ValueTask<ResolvedSession?> PersistSessionAsync(ResolvedSession resolved, UserSessionInitData sessionInit, UIViewRequestPhase phase, bool presentedOnly, CancellationToken cancellationToken)
    {
        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        DateTime utcNow = DateTime.UtcNow;
        var reportedZone = ReportedTimeZone(sessionInit);

        IUserSessionContext session = resolved.Session;
        IUserSessionContext current = session;

        // Applied to what the store holds now, not to an earlier read, and never recreating: a stale read written back would
        // undo a sign-out or a role change made meanwhile.
        var updated = await store.TryUpdateAsync(session.SessionId, stored =>
        {
            current = WithTimeZone(AsStoredNow(session, stored), reportedZone ?? stored.TimeZone);
            UserSessionState next = ToStoredSession(current, stored, phase, utcNow);

            return OnlyTouches(stored, next, _application.Sessions) ? stored : next;
        }, cancellationToken).ConfigureAwait(false);

        if (updated)
            return resolved with { Session = current };

        UISessionSecret? issued = resolved.Issued;

        if (WasRemovedMeanwhile(session, sessionInit))
        {
            if (presentedOnly)
                return null;

            issued = UISessionSecret.New();
            session = UserSessionContext.AnonymousAs(session, issued.SessionId);
        }

        session = WithTimeZone(session, reportedZone ?? session.TimeZone);

        await store.SaveAsync(ToStoredSession(session, stored: null, phase, utcNow), cancellationToken).ConfigureAwait(false);

        return new ResolvedSession(session, issued);
    }

    /// <summary>The zone the client reported, where this host knows it; an unknown one leaves the session's as it was.</summary>
    private static string? ReportedTimeZone(UserSessionInitData sessionInit)
        => UITimeZones.TryFind(sessionInit.TimeZone, out _) ? sessionInit.TimeZone : null;

    /// <summary>The session in a time zone, the very one where it already is in it.</summary>
    private static IUserSessionContext WithTimeZone(IUserSessionContext session, string? timeZone)
        => string.Equals(session.TimeZone, timeZone, StringComparison.Ordinal)
            ? session
            : UserSessionContext.Copy(session.SessionId, session, session.Language, session.ThemeMode, timeZone, session.ThemeColors);

    /// <summary>
    /// The session as the store holds it now, where the stock resolver only echoed an earlier read of it: a role revoked or a
    /// language picked since stands. The identity a host's principal brings, and whatever a resolver of the application's own
    /// answered, are the request's; the reader's colours are always the store's, which no resolver is asked about.
    /// </summary>
    private IUserSessionContext AsStoredNow(IUserSessionContext session, UserSessionState stored)
    {
        if (_sessionResolver is not StoredUserSessionResolver)
            return WithThemeColors(session, stored.ThemeColors);

        var claims = _application.Security.IdentitySource == UIIdentitySource.Claims;

        return claims
            ? UserSessionContext.Copy(session.SessionId, session, stored.Language, stored.ThemeMode, stored.TimeZone, stored.ThemeColors)
            : UserSessionContext.WithSessionId(stored, session.SessionId);
    }

    /// <summary>The session in the reader's colours, the very one where it already is in them.</summary>
    private static IUserSessionContext WithThemeColors(IUserSessionContext session, UIThemeColors? colors)
        => Equals(session.ThemeColors, colors)
            ? session
            : UserSessionContext.Copy(session.SessionId, session, session.Language, session.ThemeMode, session.TimeZone, colors);

    private static UserSessionState ToStoredSession(IUserSessionContext session, UserSessionState? stored, UIViewRequestPhase phase, DateTime utcNow)
        => new()
        {
            SessionId = session.SessionId,
            Language = session.Language,
            ThemeMode = session.ThemeMode,
            ThemeColors = session.ThemeColors,
            TimeZone = session.TimeZone,
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
    /// Whether writing <paramref name="next"/> would move nothing but the last-seen time, and that by less than the touch resolution —
    /// at most a tenth of the timeout the stored session is under.
    /// </summary>
    private static bool OnlyTouches(UserSessionState stored, UserSessionState next, UISessionOptions options)
    {
        TimeSpan resolution = LastSeenResolution(options, stored.IsUnclaimed);

        return resolution > TimeSpan.Zero
            && next.LastSeenAtUtc - stored.LastSeenAtUtc < resolution
            && stored.Roles.SetEquals(next.Roles)
            && stored.Permissions.SetEquals(next.Permissions)
            // Compared as records, so a field the session gains later is a change here without a line of its own.
            && next with { LastSeenAtUtc = stored.LastSeenAtUtc, Roles = stored.Roles, Permissions = stored.Permissions } == stored;
    }

    /// <summary>
    /// How far a session's last-seen time may lag behind, the one rule for a page load, an attach and hub traffic alike:
    /// <see cref="UISessionOptions.TouchResolution"/>, at most a tenth of the timeout the session is under; zero writes every time.
    /// </summary>
    private static TimeSpan LastSeenResolution(UISessionOptions options, bool unclaimed)
        => Min(options.TouchResolution, (unclaimed ? options.UnclaimedIdleTimeout : options.IdleTimeout) / 10);

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

    /// <summary>Replaces the session id once the session has gained an identity, moving its state to a freshly issued id.</summary>
    /// <remarks>
    /// Defends against session fixation; runs only on <see cref="UIViewRequestPhase.Open"/>, the one request that can hand the client its
    /// key. The rotation is claimed through <see cref="IUserSessionStore.TryUpdateAsync"/>, so of two loads of one session only one
    /// rotates it — the other goes on with the old id, which is gone once the rotation ends, and is handed no new key — and the new id
    /// is written from what the store holds under the old one, not from a read made before.
    /// </remarks>
    private async ValueTask<ResolvedSession> RotateSessionIdIfPendingAsync(ResolvedSession resolved, UIViewRequestPhase phase, CancellationToken cancellationToken)
    {
        if (phase != UIViewRequestPhase.Open)
            return resolved;

        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        var oldId = resolved.Session.SessionId;

        // A plain read first: nearly every page load has nothing to rotate.
        if (await store.TryGetAsync(oldId, cancellationToken).ConfigureAwait(false) is not { PendingIdRotation: true })
            return resolved;

        return await ClaimRotationAsync(store, oldId, cancellationToken).ConfigureAwait(false) is UserSessionState claimed
            ? await RotateSessionIdAsync(resolved.Session, claimed, store, cancellationToken).ConfigureAwait(false)
            : resolved;
    }

    /// <summary>
    /// Clears the session's pending rotation as one step with reading it, answering the session as cleared, or null where another
    /// request cleared it first or the session is gone.
    /// </summary>
    private static async ValueTask<UserSessionState?> ClaimRotationAsync(IUserSessionStore store, string sessionId, CancellationToken cancellationToken)
    {
        UserSessionState? claimed = null;

        _ = await store.TryUpdateAsync(sessionId, stored =>
        {
            claimed = stored.PendingIdRotation ? stored with { PendingIdRotation = false } : null;
            return claimed ?? stored;
        }, cancellationToken).ConfigureAwait(false);

        return claimed;
    }

    /// <summary>Moves a claimed session to a freshly issued id, answering the session the request goes on with.</summary>
    private async ValueTask<ResolvedSession> RotateSessionIdAsync(IUserSessionContext session, UserSessionState claimed, IUserSessionStore store, CancellationToken cancellationToken)
    {
        var oldId = claimed.SessionId;
        UISessionSecret rotated = UISessionSecret.New();
        var rotatedId = rotated.SessionId;

        await store.SaveAsync(claimed with { SessionId = rotatedId }, cancellationToken).ConfigureAwait(false);

        // Read again once the new id is written: a session ended or changed under the old id meanwhile is ended or changed under
        // the new one too, rather than brought back as it was when the rotation began.
        UserSessionState? latest = await store.TryGetAsync(oldId, cancellationToken).ConfigureAwait(false);

        if (latest is null || !await store.TryUpdateAsync(rotatedId, _ => latest with { SessionId = rotatedId }, cancellationToken).ConfigureAwait(false))
        {
            await store.RemoveAsync(rotatedId, cancellationToken).ConfigureAwait(false);
            await store.RemoveAsync(oldId, cancellationToken).ConfigureAwait(false);
            await _services.GetRequiredService<IUIFileStore>().RemoveSessionAsync(oldId, cancellationToken).ConfigureAwait(false);

            return await RestartEndedSessionAsync(session, store, cancellationToken).ConfigureAwait(false);
        }

        await store.RemoveAsync(oldId, cancellationToken).ConfigureAwait(false);
        await _services.GetRequiredService<IUIFileStore>().MoveSessionAsync(oldId, rotatedId, cancellationToken).ConfigureAwait(false);

        Log.SessionIdRotated(_logger, new UISessionFingerprint(oldId), new UISessionFingerprint(rotatedId));

        IUserSessionContext current = AsStoredNow(session, latest);

        return new ResolvedSession(UserSessionContext.WithSessionId(current, rotatedId), rotated);
    }

    /// <summary>
    /// Goes on as a fresh session where the one being rotated was ended meanwhile: anonymous where the identity lived only in the
    /// store, the principal's under <see cref="UIIdentitySource.Claims"/>, which is the authority there.
    /// </summary>
    private async ValueTask<ResolvedSession> RestartEndedSessionAsync(IUserSessionContext session, IUserSessionStore store, CancellationToken cancellationToken)
    {
        UISessionSecret issued = UISessionSecret.New();

        IUserSessionContext restarted = _application.Security.IdentitySource == UIIdentitySource.Claims
            ? UserSessionContext.WithSessionId(session, issued.SessionId)
            : UserSessionContext.AnonymousAs(session, issued.SessionId);

        await store.SaveAsync(ToStoredSession(restarted, stored: null, UIViewRequestPhase.Open, DateTime.UtcNow), cancellationToken).ConfigureAwait(false);

        return new ResolvedSession(restarted, issued);
    }

    private static void EnsureAuthorized(UIRouteDefinition route, IUserSessionContext session, IUIAuthorizationService authorization)
    {
        UIRouteAccessVerdict verdict = UIRouteAccess.Check(route, session, authorization);

        if (verdict == UIRouteAccessVerdict.SignIn)
            throw new UnauthorizedAccessException($"Route '{route.Route}' requires authenticated session.");

        if (verdict == UIRouteAccessVerdict.Forbidden)
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
    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "The runtimes the store hands back are disposed by DisposeIfAnyAsync, which logs a dispose that throws rather than rethrowing it.")]
    public async Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, UIInstance instance, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentNullException.ThrowIfNull(instance);

        resolution.Validate();
        instance.Validate();

        UIHandle handle = new(instance, resolution.Session, resolution.Connection);
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

        var maxTotal = _application.Persistence.MaxRuntimesTotal ?? 0;
        UIRuntimeEntry? added = RuntimeStore.GetOrAdd(key, handle.Instance.Id, () => CreateRuntime(handle, resolution.Route, resolution.View), DateTime.UtcNow, ResolveFlushOptions(resolution.Route), _application.Persistence.MaxRuntimesPerSession, _application.Persistence.MaxUnclaimedRuntimesPerSession, maxTotal, adopted, out var created, out var attached, out var activeInstances, out IUIRuntime? evicted, out IUIRuntime? unused);

        // Built for a key another attach filled first, or a session or the process that filled meanwhile; never started, so disposing is all of it.
        await DisposeIfAnyAsync(unused).ConfigureAwait(false);
        await DisposeIfAnyAsync(evicted).ConfigureAwait(false);

        UIRuntimeEntry entry = added ?? throw RefuseRuntime(maxTotal);
        IUIRuntime runtime = entry.Runtime;

        try
        {
            if (created)
            {
                if (Volatile.Read(ref _runtimesFullReported) != 0)
                    Volatile.Write(ref _runtimesFullReported, 0);

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
                        await DisposeRuntimeAsync(removed!).ConfigureAwait(false);

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
                await connections.NotifyAttachedAsync(handle, created, cancellationToken).ConfigureAwait(false);

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
            Runtime = runtime,
            RuntimeId = entry.Id
        };

        runtimeResolution.Validate();

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.RuntimeAttached(_logger, resolution.Route.Route, handle.Instance.WindowId, elapsed.TotalMilliseconds);

        return runtimeResolution;
    }

    /// <summary>
    /// The refusal of a runtime the store found no room for: the process's where its limit is reached — reported once a burst — else
    /// the session's.
    /// </summary>
    private InvalidOperationException RefuseRuntime(int maxTotal)
    {
        if (!RuntimeStore.IsProcessFull(maxTotal))
            return UIRuntimeStore.SessionFull(_application.Persistence.MaxRuntimesPerSession);

        if (Interlocked.Exchange(ref _runtimesFullReported, 1) == 0)
            Log.RuntimesFull(_logger, maxTotal);

        return UIRuntimeStore.ProcessFull(maxTotal);
    }

    private ValueTask DisposeIfAnyAsync(IUIRuntime? runtime)
        => runtime is null ? ValueTask.CompletedTask : DisposeRuntimeAsync(runtime);

    /// <summary>Disposes a runtime the host let go of, logging a failure rather than throwing it.</summary>
    /// <remarks>
    /// A controller's or a scoped service's dispose is application code: one that throws must not keep the runtimes after it from
    /// being disposed, a session's other pages from being sent away, or the operation that let it go from finishing.
    /// </remarks>
    private async ValueTask DisposeRuntimeAsync(IUIRuntime runtime)
    {
        try
        {
            await runtime.DisposeAsync().ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            Log.RuntimeDisposeFailed(_logger, exception, runtime.Handle.Instance.Navigation.Route);
        }
    }

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

        await DisposeRuntimeAsync(discarded).ConfigureAwait(false);
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
            await DisposeRuntimeAsync(left[i]).ConfigureAwait(false);
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
            runtime.JoinBroadcast(Broadcast);

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

    private UIFlushOptions ResolveFlushOptions(UIRouteDefinition route)
    {
        // The scheduler's own tick by default: a fixed gate would hold a runtime back past a tick set shorter than it.
        TimeSpan interval = route.FlushInterval ?? _application.Persistence.FlushSchedulerInterval;

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

    /// <summary>
    /// Tells a kept runtime a page render is about to paint what moved in its session since it last heard, as a command runs, so the
    /// paint is already in it; one that heard it all is left alone.
    /// </summary>
    /// <remarks>
    /// The render's own connection is the hook's handle, as it is for a render that builds a runtime: no tab, so what the hook
    /// sends goes nowhere, while what it writes is what the render reads.
    /// </remarks>
    internal static Task HearBeforeRenderAsync(IUIRuntime runtime, UIViewResolution resolution, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        ArgumentNullException.ThrowIfNull(resolution);

        if (runtime is not IUIRuntimeConnectionUpdater updater || !updater.HasSessionMoved(resolution.Session))
            return Task.CompletedTask;

        var pageId = Guid.NewGuid().ToString("N");

        UIInstance instance = new()
        {
            Id = pageId,
            WindowId = pageId,
            Navigation = resolution.Navigation,
            PageId = pageId
        };

        return updater.NotifySessionChangedAsync(new UIHandle(instance, resolution.Session, resolution.Connection), cancellationToken);
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

        return CreateRuntimeKey(handle, handle.Instance.Navigation);
    }

    /// <summary>The key of the runtime <paramref name="navigation"/> names on the handle's route, from the handle's session and tab.</summary>
    private UIRuntimeKey CreateRuntimeKey(UIHandle handle, UINavigationRequest navigation)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(navigation);

        handle.Instance.Validate();

        // Uses the definition, not the route string, so a route that has gone missing still yields the same key as at attach.
        UIRouteDefinition route = _application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? entry)
            ? entry.Definition
            : new UIRouteDefinition { Route = UIRoutePath.Normalize(handle.Instance.Navigation.Route), ViewKey = handle.Instance.Navigation.Route };

        return CreateRuntimeKey(_application.Persistence, route, handle.Session.SessionId, navigation, handle.Instance.WindowId);
    }

    /// <summary>Whether an attach from <paramref name="clientWindowId"/> resolved to the very runtime <paramref name="handle"/> is attached to.</summary>
    internal bool NamesRuntimeOf(UIHandle handle, UIViewResolution resolution, string clientWindowId)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(resolution);
        ArgumentException.ThrowIfNullOrWhiteSpace(clientWindowId);

        return string.Equals(handle.Instance.WindowId, clientWindowId, StringComparison.Ordinal)
            && resolution.Route.ControllerType is not null
            && CreateRuntimeKey(handle).Equals(CreateRuntimeKey(_application.Persistence, resolution.Route, resolution.Session.SessionId, resolution.Navigation, clientWindowId));
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(changeSet);

        changeSet.Validate();

        var started = Stopwatch.GetTimestamp();
        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return ServerChangeSet.Empty;

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
    /// Refreshes the session's last-seen time from hub traffic, throttled by the rule a page load's is (<see cref="LastSeenResolution"/>),
    /// so a chatty tab isn't a write per message.
    /// </summary>
    /// <remarks>
    /// Otherwise a tab that only sends events, never reloading, would idle out while the connection stays alive and lose
    /// uploads to a 401. Only the time is touched, and never on a session that is gone: the handle's session is the one the tab
    /// attached with, and saving it would bring back a session signed out since, or roles revoked since. A session the touch
    /// finds gone — ended from another process, purged — ends here as <see cref="EndSessionAsync"/> ends one, and the call is
    /// answered with nothing: false.
    /// </remarks>
    private async Task<bool> RefreshSessionActivityAsync(UIHandle handle, UIRuntimeEntry entry, CancellationToken cancellationToken)
    {
        // An attached tab's session is claimed: it is under the full idle timeout.
        TimeSpan throttle = LastSeenResolution(_application.Sessions, unclaimed: false);

        if (!entry.ShouldPersistSessionActivity(DateTime.UtcNow, throttle))
            return true;

        if (await _services.GetRequiredService<IUserSessionStore>().TouchAsync(handle.Session.SessionId, DateTime.UtcNow, cancellationToken).ConfigureAwait(false))
            return true;

        await EndSessionAsync(handle.Session.SessionId, except: null, cancellationToken).ConfigureAwait(false);

        return false;
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UIHandle handle, UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return SessionEndedResult();

        // Tagged with the route's template, not the address, so a route with parameters is one series and not one per id.
        var route = _application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? routeEntry)
            ? routeEntry.Definition.Route
            : UIRoutePath.Normalize(handle.Instance.Navigation.Route);

        Activity? activity = UIMetrics.Activities.StartActivity("ui.command");
        _ = activity?.SetTag("ne.ui.route", route);

        // The name is looked up only for the debug line; the metric is tagged with the route alone.
        // An offered action names no event: its command is the runtime's to know, and the line goes without it.
        var command = _logger.IsEnabled(LogLevel.Debug) && request.Action is null && entry.Runtime.View.Events.TryGet(request.EventId, out CompiledUIEvent? compiledEvent)
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

    /// <summary>The answer to a call whose session ended before it ran: nothing done, nothing changed.</summary>
    private static UICommandExecutionResult SessionEndedResult()
        => new()
        {
            Command = UICommandResult.Fail("The session has ended."),
            Changes = ServerChangeSet.Empty
        };

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> RequestLeaveAsync(UIHandle handle, string target, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);

        if (!UIRoutePath.IsLocal(target))
            throw new ArgumentException("A leave names an address of this site.", nameof(target));

        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return SessionEndedResult();

        return await entry.Runtime.RequestLeaveAsync(handle, target, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    /// <remarks>
    /// Not a navigation: the route's access was checked when the page arrived, so the view filters are not run again. An entry whose
    /// parameters name another runtime (the route's identity) is that runtime's page, and is answered with a navigation to it.
    /// </remarks>
    public async Task<UICommandExecutionResult> NavigateInPlaceAsync(UIHandle handle, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);

        UINavigationRequest navigation = new()
        {
            Route = handle.Instance.Navigation.Route,
            Parameters = parameters
        };

        navigation.Validate();

        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return SessionEndedResult();

        if (!CreateRuntimeKey(handle, navigation).Equals(CreateRuntimeKey(handle)))
        {
            return new UICommandExecutionResult
            {
                Command = UICommandResult.Ok([new NavigateEffect(UINavigationAddress.Format(navigation))]),
                Changes = ServerChangeSet.Empty
            };
        }

        return await entry.Runtime.NavigateInPlaceAsync(handle, navigation, cancellationToken).ConfigureAwait(false);
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
        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return ServerChangeSet.Empty;

        IUIRuntime runtime = entry.Runtime;

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
    /// Makes a session the page itself stored (its language or theme switcher, its colours) this connection's, tells its controller
    /// what moved as a command runs, and reaches the session's other pages (<see cref="ReachSessionAsync"/>).
    /// </summary>
    /// <remarks>
    /// The hub's half of what <see cref="UIContext.UpdateSessionAsync"/> does inside a command, where the page, having asked,
    /// switches itself: no effect is sent back to it.
    /// </remarks>
    internal async Task ApplySessionChangeAsync(UIHandle handle, UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(session);

        IUserSessionContext previous = handle.Session;

        handle.RefreshSession(session);

        if (!UISessionMoves.Any(previous, session))
            return;

        IUIRuntime? own = null;

        if (RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out UIRuntimeEntry? entry) && entry!.Runtime is IUIRuntimeConnectionUpdater updater)
        {
            own = entry.Runtime;

            await updater.NotifySessionChangedAsync(handle, cancellationToken).ConfigureAwait(false);
        }

        await ReachSessionAsync(session, handle, own, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Brings every page open under a session's runtimes, but <paramref name="origin"/>, to the session as stored — its handle
    /// refreshed and the effects that switch it sent — and tells each of those runtimes' controllers, but
    /// <paramref name="originRuntime"/>'s, what moved, queued as a command runs.
    /// </summary>
    /// <remarks>
    /// A runtime no page shows is told at its next attach, where its session is weighed against the one it last heard; a page with
    /// no controller is not reached and follows at its next render. A send that fails leaves the rest to go.
    /// </remarks>
    internal async Task ReachSessionAsync(UserSessionState session, UIHandle? origin, IUIRuntime? originRuntime, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        UIRuntimeKey[] keys = RuntimeStore.GetSessionKeys(session.SessionId);
        IUIUpdateSink? updates = null;

        for (var i = 0; i < keys.Length; i++)
        {
            if (!RuntimeStore.TryGet(keys[i], out IUIRuntime? runtime) || runtime is not IUIRuntimeConnectionUpdater connections)
                continue;

            UIHandle? reached = null;

            foreach (UIHandle viewer in connections.ViewerHandles)
            {
                if (origin is not null && StringComparer.Ordinal.Equals(viewer.Instance.Id, origin.Instance.Id))
                    continue;

                ClientEffect[] effects = UISessionMoves.Effects(viewer.Session, session);

                viewer.RefreshSession(session);

                // A page already in the session heard it with its runtime: whatever refreshed its handle told the controller too.
                if (effects.Length == 0)
                    continue;

                reached ??= viewer;
                updates ??= _services.GetRequiredService<IUIUpdateSink>();

                UICommandExecutionResult result = new()
                {
                    Command = UICommandResult.Ok(effects),
                    Changes = ServerChangeSet.Empty
                };

                await SendToViewerAsync(updates, viewer, result, Log.SessionReachFailed, cancellationToken).ConfigureAwait(false);
            }

            if (reached is not null && !ReferenceEquals(runtime, originRuntime))
                connections.PostSessionChanged(reached);
        }
    }

    /// <summary>
    /// Pushes a result to one page, logging rather than throwing a send that fails: the page is told again, or goes, when it next
    /// reaches the server, and one page's lost connection must not stop the rest being told.
    /// </summary>
    private async Task SendToViewerAsync(IUIUpdateSink updates, UIHandle viewer, UICommandExecutionResult result, Action<ILogger, Exception, string> failed, CancellationToken cancellationToken)
    {
        try
        {
            await updates.SendCommandResultAsync(viewer, result, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
        {
            failed(_logger, exception, viewer.Instance.Id);
        }
    }

    /// <inheritdoc />
    public async Task EndSessionAsync(string sessionId, UIHandle? except = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        await _services.GetRequiredService<IUserSessionStore>().RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);

        var count = await EndRemovedSessionAsync(sessionId, except, cancellationToken).ConfigureAwait(false);

        Log.SessionEnded(_logger, new UISessionFingerprint(sessionId), count);
    }

    /// <summary>
    /// What a session's end does apart from the store, to a session gone from it — a sign-out's or the cleanup's purge: its files
    /// go, since they are reachable only through it, and so do its pages, which would otherwise go on being pushed to and written
    /// from as nobody. Answers how many runtimes ended.
    /// </summary>
    private async Task<int> EndRemovedSessionAsync(string sessionId, UIHandle? except, CancellationToken cancellationToken)
    {
        await _services.GetRequiredService<IUIFileStore>().RemoveSessionAsync(sessionId, cancellationToken).ConfigureAwait(false);

        return await EndSessionRuntimesAsync(sessionId, except).ConfigureAwait(false);
    }

    /// <summary>
    /// Ends every runtime a session holds but the asking page's, and sends the pages open under them away; answers how many ended.
    /// </summary>
    private async Task<int> EndSessionRuntimesAsync(string sessionId, UIHandle? except)
    {
        UIRuntimeKey? keep = except is null ? null : CreateRuntimeKey(except);
        IUIRuntime[] ended = RuntimeStore.RemoveSession(sessionId, keep);

        // The asking page's runtime stays to finish its answer, but under PerClient other tabs share it; they go as well.
        if (except is not null && keep is UIRuntimeKey kept && RuntimeStore.TryGet(kept, out IUIRuntime? shared) && shared is not null)
        {
            // Nothing it holds can be saved under an ended session: the sign-out's own navigation leaves unasked.
            if (shared.Controller is UIControllerBase controller)
                controller.ReleaseUnsavedWork();

            await SendViewersAwayAsync(shared, signIn: true, except).ConfigureAwait(false);
        }

        for (var i = 0; i < ended.Length; i++)
            await EndRuntimeAsync(ended[i], signIn: true).ConfigureAwait(false);

        return ended.Length;
    }

    /// <summary>Sends an ended runtime's pages away and disposes it — deferred by the runtime itself while a command still runs for it.</summary>
    private async Task EndRuntimeAsync(IUIRuntime runtime, bool signIn)
    {
        await SendViewersAwayAsync(runtime, signIn).ConfigureAwait(false);
        await DisposeRuntimeAsync(runtime).ConfigureAwait(false);
    }

    /// <summary>
    /// Sends every page of a runtime but <paramref name="except"/> away — a page left on screen would answer nothing, its runtime
    /// or its session gone: to sign in where <paramref name="signIn"/> and the page was signed in, else back to its own address,
    /// whose resolution then decides.
    /// </summary>
    /// <remarks>An anonymous page is reloaded rather than sent to sign in: it had no identity to lose.</remarks>
    private async Task SendViewersAwayAsync(IUIRuntime runtime, bool signIn, UIHandle? except = null)
    {
        if (runtime is not IUIRuntimeConnectionUpdater connections)
            return;

        IUIUpdateSink updates = _services.GetRequiredService<IUIUpdateSink>();

        foreach (UIHandle viewer in connections.ViewerHandles)
        {
            if (except is not null && StringComparer.Ordinal.Equals(viewer.Instance.Id, except.Instance.Id))
                continue;

            UINavigationRequest page = viewer.Instance.Navigation;

            // Ahead of the navigation: its runtime is gone, so nothing the page held can be saved, and nothing is asked.
            UICommandExecutionResult result = new()
            {
                Command = UICommandResult.Ok([new NavigateEffect(signIn && viewer.Session.IsAuthenticated ? SignInOrReload(page) : page)]),
                Changes = new ServerChangeSet { Updates = [new ServerPageUIUpdate { HoldsUnsavedWork = false }] }
            };

            await SendToViewerAsync(updates, viewer, result, Log.SessionEndNoticeFailed, CancellationToken.None).ConfigureAwait(false);
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
            if (!await store.TryUpdateAsync(sessions[i], update, cancellationToken).ConfigureAwait(false))
                continue;

            updated++;

            // Read back rather than taken from the update, which a store may run more than once.
            if (await store.TryGetAsync(sessions[i], cancellationToken).ConfigureAwait(false) is UserSessionState current)
            {
                await EndRefusedRuntimesAsync(current).ConfigureAwait(false);
                await ReachSessionAsync(current, origin: null, originRuntime: null, cancellationToken).ConfigureAwait(false);
            }
        }

        return updated;
    }

    /// <summary>
    /// Ends the session's open pages whose route the changed session no longer passes, sending each back to its own address: its
    /// resolution then refuses it the way any request is refused, to sign in or to the forbidden page.
    /// </summary>
    private async Task EndRefusedRuntimesAsync(UserSessionState session)
    {
        UIRuntimeKey[] keys = RuntimeStore.GetSessionKeys(session.SessionId);

        for (var i = 0; i < keys.Length; i++)
        {
            if (!_application.Routes.TryGetEntry(keys[i].Route, out UIRouteEntry? entry) || Passes(entry.Definition, session) || !RuntimeStore.Remove(keys[i], out IUIRuntime? runtime))
                continue;

            await EndRuntimeAsync(runtime!, signIn: false).ConfigureAwait(false);
        }
    }

    /// <summary>Whether a session may open a route: the check a page's resolution makes, as an answer rather than a refusal.</summary>
    private bool Passes(UIRouteDefinition route, UserSessionState session)
        => UIRouteAccess.Check(route, session, _authorization) == UIRouteAccessVerdict.Pass;

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        await _scheduler.DisposeAsync().ConfigureAwait(false);
        _dispatcher.Dispose();

        try
        {
            await RuntimeStore.DisposeAsync().ConfigureAwait(false);
        }
        finally
        {
            _metrics.Dispose();
        }
    }

    /// <inheritdoc />
    public void Dispose()
    {
        _scheduler.Dispose();
        _dispatcher.Dispose();

        try
        {
            RuntimeStore.Dispose();
        }
        finally
        {
            _metrics.Dispose();
        }
    }
}
