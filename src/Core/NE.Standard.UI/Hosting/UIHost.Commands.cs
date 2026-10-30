using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Hosting;

internal sealed partial class UIHost
{
    /// <inheritdoc />
    public async Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(changeSet);

        changeSet.Validate();

        // It waits for the runtime's state lock, which an action holds until it returns.
        UIRuntime.ThrowIfInsideAction(nameof(ProcessChangeSetAsync));

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
        // Asked again on a miss: a sign-in moves the handle and its runtime to the new id as one step under the store's lock, so a key
        // read just before it names nothing, and the handle read again names the runtime.
        return RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out UIRuntimeEntry? entry) || RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out entry)
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
    /// attached with, and saving it would bring back a session signed out since, or roles revoked since. A session found gone —
    /// ended from another process, purged, or idle past its timeout and not yet purged — ends here as <see cref="EndSessionAsync"/>
    /// ends one, and the call is answered with nothing: false. Under <see cref="Shell.Security.UISecurityOptions.RecheckRouteOnActivity"/> the same
    /// read ends the runtime of a page whose route the session as stored no longer passes, as a changed session's event does.
    /// </remarks>
    private async Task<bool> RefreshSessionActivityAsync(UIHandle handle, UIRuntimeEntry entry, CancellationToken cancellationToken)
    {
        // An attached tab's session is claimed: it is under the full idle timeout.
        TimeSpan throttle = LastSeenResolution(_application.Sessions, unclaimed: false);

        if (!entry.ShouldPersistSessionActivity(DateTime.UtcNow, throttle))
            return true;

        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();

        // Read before the touch, as every other reader of the store reads it: a session idle past its timeout is gone, and a touch
        // would bring it back for a tab that merely stayed attached.
        if (await store.TryGetAsync(handle.Session.SessionId, cancellationToken).ConfigureAwait(false) is UserSessionState stored && !stored.IsIdle(_application.Sessions, DateTime.UtcNow))
        {
            if (_application.Security.RecheckRouteOnActivity && !await StillPassesRouteAsync(handle, stored).ConfigureAwait(false))
                return false;

            if (await store.TouchAsync(handle.Session.SessionId, DateTime.UtcNow, cancellationToken).ConfigureAwait(false))
                return true;
        }

        await EndSessionAsync(handle.Session.SessionId, except: null, cancellationToken).ConfigureAwait(false);

        return false;
    }

    /// <summary>
    /// Whether the session as stored still passes the page's route; where it does not, the session's runtimes it no longer passes end,
    /// their pages sent back to their own addresses, whose loads refuse them.
    /// </summary>
    private async Task<bool> StillPassesRouteAsync(UIHandle handle, UserSessionState stored)
    {
        if (!_application.Routes.TryGetEntry(handle.Instance.Navigation.Route, out UIRouteEntry? route) || Passes(route.Definition, stored))
            return true;

        Log.RouteNoLongerPasses(_logger, route.Definition.Route);

        await EndRefusedRuntimesAsync(stored).ConfigureAwait(false);

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
        Task<UICommandRunOutcome>? completion = null;

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
                CompleteCommand(activity, route, command, CommandOutcome(succeeded, cancellationToken), started);
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

    /// <summary>A command's outcome for the meter: a failure under a cancelled token is its page leaving, not the command failing.</summary>
    private static string CommandOutcome(bool succeeded, CancellationToken cancellationToken)
        => succeeded ? "ok" : cancellationToken.IsCancellationRequested ? "cancelled" : "failed";

    private void CompleteCommand(Activity? activity, string route, string? command, string outcome, long started)
    {
        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);
        var succeeded = outcome == "ok";

        Metrics.CommandCompleted(route, outcome, elapsed);
        _ = activity?.SetStatus(succeeded ? ActivityStatusCode.Ok : ActivityStatusCode.Error);
        activity?.Dispose();

        if (command is not null)
            Log.CommandCompleted(_logger, command, route, succeeded ? "succeeded" : outcome, elapsed.TotalMilliseconds);
    }

    /// <remarks>The run's own outcome: it lives on its tab's stay, so the invoke's connection token says nothing of how it ended.</remarks>
    private async Task CompleteDetachedCommandAsync(Task<UICommandRunOutcome> completion, Activity? activity, string route, string? command, long started)
    {
        // The run never faults: its failures are its result.
        var outcome = await completion.ConfigureAwait(false) switch
        {
            UICommandRunOutcome.Succeeded => "ok",
            UICommandRunOutcome.Cancelled => "cancelled",
            _ => "failed"
        };

        CompleteCommand(activity, route, command, outcome, started);
    }

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
    /// The route's view filters run again with the entry's parameters, on the session as the store holds it now, as the attach of a
    /// load of that address would run them: an entry they refuse or redirect is answered with a navigation to it, whose load then
    /// refuses it the way any request is refused. An entry whose parameters name another runtime (the route's identity) is that
    /// runtime's page, and is answered with a navigation to it.
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

        if (!CreateRuntimeKey(handle, navigation).Equals(CreateRuntimeKey(handle)) || !await PassesViewFiltersAsync(handle, navigation, cancellationToken).ConfigureAwait(false))
        {
            return new UICommandExecutionResult
            {
                Command = UICommandResult.Ok([new NavigateEffect(UINavigationAddress.Format(navigation))]),
                Changes = ServerChangeSet.Empty
            };
        }

        return await entry.Runtime.NavigateInPlaceAsync(handle, navigation, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Whether the route's view filters let an in-place entry through untouched. In the attach phase: a filter's side effect belongs to
    /// a page load's render, not to every Back and Forward. A refusal of any kind is the load's to answer.
    /// </summary>
    private async Task<bool> PassesViewFiltersAsync(UIHandle handle, UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        if (!_application.Routes.TryGetEntry(navigation.Route, out UIRouteEntry? entry))
            return false;

        UserSessionState? stored = await _services.GetRequiredService<IUserSessionStore>().TryGetAsync(handle.Session.SessionId, cancellationToken).ConfigureAwait(false);

        if (stored is null)
            return false;

        try
        {
            (UIViewResolution? resolution, UINavigationRequest? redirected) = await RunViewFiltersAsync(entry, navigation, new ResolvedSession(AsStoredNow(handle.Session, stored), Issued: null), UIViewRequestPhase.Attach, handle.Connection, cancellationToken).ConfigureAwait(false);

            return resolution is not null && redirected is null;
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            Log.InPlaceNavigationRefused(_logger, navigation.Route, exception.Message);

            return false;
        }
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(request);

        request.Validate();

        // It waits for the runtime's state lock, which an action holds until it returns.
        UIRuntime.ThrowIfInsideAction(nameof(RequestItemWindowAsync));

        var started = Stopwatch.GetTimestamp();
        UIRuntimeEntry entry = GetRequiredRuntimeEntry(handle);

        if (!await RefreshSessionActivityAsync(handle, entry, cancellationToken).ConfigureAwait(false))
            return ServerChangeSet.Empty;

        // Answered to the tab that asked, not the runtime's connection: under PerClient another tab may be the one it answers for.
        ServerChangeSet changes = await Own(entry.Runtime).RequestItemWindowAsync(handle, request, cancellationToken).ConfigureAwait(false);

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.ItemWindowRead(_logger, request.Count, request.Mode, handle.Instance.Navigation.Route, elapsed.TotalMilliseconds, changes.Updates.Length);

        return changes;
    }

    /// <inheritdoc />
    /// <remarks>
    /// Through the runtime's send queue, as the scheduled flush hands it over, so a set queued earlier behind a slow page still goes
    /// first; answers once what it queued is sent.
    /// </remarks>
    public async Task<ServerChangeSet> FlushAsync(UIHandle handle, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return await Own(GetRequiredRuntimeEntry(handle).Runtime).FlushAndSendAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    /// <remarks>The controller hears it as posted work.</remarks>
    public void ReportClientState(UIHandle handle, UIClientState state)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(state);

        if (RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out UIRuntimeEntry? entry))
        {
            Own(entry!.Runtime).UpdateClientState(handle, state);
            return;
        }

        // A page with no controller has no runtime to count it: its handle is all there is.
        _ = handle.RefreshClientState(state);
    }
}
