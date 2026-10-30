using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Security;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Hosting;

internal sealed partial class UIHost
{
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
    /// goes on with, which is a new one under a new id when the resolver kept a presented id the store does not hold — anonymous where
    /// the session was removed while this request read it — or none where <paramref name="presentedOnly"/>, since that new one would
    /// be issued.
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

        // A presented id the store does not hold is never written: one removed meanwhile would come back, and one no render issued is
        // the client's own pick, which a resolver taking the id it is offered would otherwise plant — the fixation defence.
        if (string.Equals(sessionInit.SessionId, session.SessionId, StringComparison.Ordinal))
        {
            if (presentedOnly)
                return null;

            issued = UISessionSecret.New();
            session = WasRemovedMeanwhile(session, sessionInit)
                ? UserSessionContext.AnonymousAs(session, issued.SessionId)
                : UserSessionContext.WithSessionId(session, issued.SessionId);
        }

        session = WithTimeZone(session, reportedZone ?? session.TimeZone);

        UserSessionState saved = ToStoredSession(session, stored: null, phase, utcNow);

        await store.SaveAsync(saved, cancellationToken).ConfigureAwait(false);

        if (saved.IsUnclaimed)
            AdmitUnclaimedSession(store, saved.SessionId);

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

        // Compared as records, so a field the session gains later is a change here without a line of its own.
        return resolution > TimeSpan.Zero
            && next.LastSeenAtUtc - stored.LastSeenAtUtc < resolution
            && stored.Roles.SetEquals(next.Roles)
            && stored.Permissions.SetEquals(next.Permissions)
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

    /// <summary>
    /// Holds the in-memory store to <see cref="UISessionOptions.MaxUnclaimedSessions"/>, oldest first. A session given up keeps its
    /// runtimes no tab presented for their short retention, rather than ending them on this load: a flood is what fills it.
    /// </summary>
    private void AdmitUnclaimedSession(IUserSessionStore store, string sessionId)
    {
        if (_application.Sessions.MaxUnclaimedSessions is not int max || max <= 0 || UserSessionMemoryStore.Of(store) is not { } memory)
            return;

        var evicted = memory.AdmitUnclaimed(sessionId, max);

        if (evicted > 0)
            Metrics.SessionsEvicted(evicted);
    }

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
        UISessionSecret rotated = UISessionSecret.New();

        if (await MoveStoredSessionAsync(store, claimed, rotated.SessionId, static stored => stored, moving: null, cancellationToken).ConfigureAwait(false) is not UserSessionState moved)
            return await RestartEndedSessionAsync(session, store, cancellationToken).ConfigureAwait(false);

        Log.SessionIdRotated(_logger, new UISessionFingerprint(claimed.SessionId), new UISessionFingerprint(rotated.SessionId));

        IUserSessionContext current = AsStoredNow(session, moved);

        return new ResolvedSession(UserSessionContext.WithSessionId(current, rotated.SessionId), rotated);
    }

    /// <summary>
    /// Writes a session, with <paramref name="apply"/>, under a new id and removes the old one, its files and what
    /// <paramref name="moving"/> takes following it first; answers the session as written under the new id, or null where the old one
    /// was ended meanwhile — then neither stays — or <paramref name="moving"/> found nothing to take, which leaves the old one as it was.
    /// </summary>
    /// <remarks>
    /// The old id is read again once the new one is written: a session ended or changed under the old id meanwhile is ended or changed
    /// under the new one too, rather than brought back as it was when the move began. Whatever follows it moves before the old id goes:
    /// a request finding the old id gone ends everything still under it.
    /// </remarks>
    private async ValueTask<UserSessionState?> MoveStoredSessionAsync(IUserSessionStore store, UserSessionState session, string newId, Func<UserSessionState, UserSessionState> apply, Func<UserSessionState, bool>? moving, CancellationToken cancellationToken)
    {
        var oldId = session.SessionId;
        IUIFileStore files = _services.GetRequiredService<IUIFileStore>();

        await store.SaveAsync(apply(session) with { SessionId = newId }, cancellationToken).ConfigureAwait(false);

        UserSessionState? latest = await store.TryGetAsync(oldId, cancellationToken).ConfigureAwait(false);
        UserSessionState? moved = null;

        if (latest is null || !await store.TryUpdateAsync(newId, _ => moved = apply(latest) with { SessionId = newId }, cancellationToken).ConfigureAwait(false) || moved is null)
        {
            await store.RemoveAsync(newId, cancellationToken).ConfigureAwait(false);
            await store.RemoveAsync(oldId, cancellationToken).ConfigureAwait(false);
            await files.RemoveSessionAsync(oldId, cancellationToken).ConfigureAwait(false);

            return null;
        }

        if (moving is not null && !moving(moved))
        {
            await store.RemoveAsync(newId, cancellationToken).ConfigureAwait(false);

            return null;
        }

        // Owed whole once something moved with it: no caller's token leaves the old id standing beside the new one.
        CancellationToken owed = moving is null ? cancellationToken : CancellationToken.None;

        await files.MoveSessionAsync(oldId, newId, owed).ConfigureAwait(false);
        await store.RemoveAsync(oldId, owed).ConfigureAwait(false);

        return moved;
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

    /// <inheritdoc />
    /// <remarks>
    /// The platform's half of what <see cref="UIContext.UpdateSessionAsync"/> does inside a command, the controller told as a command
    /// runs: the page, having asked, switches itself.
    /// </remarks>
    public async Task ApplySessionChangeAsync(UIHandle handle, UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(session);

        IUserSessionContext previous = handle.Session;

        handle.RefreshSession(session);

        if (!UISessionMoves.Any(previous, session))
            return;

        IUIRuntime? own = null;

        if (RuntimeStore.TryGetAttachedEntry(CreateRuntimeKey(handle), handle.Instance.Id, out UIRuntimeEntry? entry))
        {
            own = entry!.Runtime;

            await Own(own).NotifySessionChangedAsync(handle, cancellationToken).ConfigureAwait(false);
        }

        await ReachSessionAsync(session, handle, own, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public Task ReachSessionAsync(UserSessionState session, CancellationToken cancellationToken = default)
        => ReachSessionAsync(session, origin: null, originRuntime: null, cancellationToken);

    /// <summary>
    /// Brings every page open under a session's runtimes, but <paramref name="origin"/>, to the session as stored — its handle
    /// refreshed and the effects that switch it sent — and tells each of those runtimes' controllers, but
    /// <paramref name="originRuntime"/>'s, what moved, queued as a command runs.
    /// </summary>
    /// <remarks>
    /// A runtime no page shows is told at its next attach, where its session is weighed against the one it last heard; a page with
    /// no controller is not reached and follows at its next render. A send that fails leaves the rest to go.
    /// </remarks>
    private async Task ReachSessionAsync(UserSessionState session, UIHandle? origin, IUIRuntime? originRuntime, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(session);

        UIRuntimeKey[] keys = RuntimeStore.GetSessionKeys(session.SessionId);

        for (var i = 0; i < keys.Length; i++)
        {
            if (!RuntimeStore.TryGet(keys[i], out IUIRuntime? runtime))
                continue;

            IUIRuntimeConnectionUpdater connections = Own(runtime!);

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

                // Through the runtime's send queue, so the switch never overtakes a set queued for the page before it.
                try
                {
                    await runtime!.SendEffectsToAsync([viewer], effects, cancellationToken).ConfigureAwait(false);
                }
                catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
                {
                    // The page is told again, or goes, when it next reaches the server; one lost connection must not stop the rest.
                    Log.SessionReachFailed(_logger, exception, viewer.Instance.Id);
                }
            }

            if (reached is not null && !ReferenceEquals(runtime, originRuntime))
                connections.PostSessionChanged(reached);
        }
    }

    /// <inheritdoc />
    /// <remarks>
    /// The fixation defence, at once: whoever else holds the old id — a key a sibling subdomain planted — is never handed the new key,
    /// which goes to this page's client alone, and a load of the old id after it is a new anonymous session.
    /// </remarks>
    async ValueTask<bool> IUISessionSignIn.SignInAsync(UIHandle handle, bool invoked, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(update);

        // Outside the page's own command the handle is the last page to attach, or the one whose work started the posted queue: under
        // PerClient perhaps another browser holding a planted key, which the key would go to.
        if (!invoked && SharesRuntimeWithAnotherPage(handle))
            throw new InvalidOperationException("A sign-in outside a running command cannot tell which of the pages sharing this runtime signs in; sign in from the page's own command.");

        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();
        var oldId = handle.Session.SessionId;

        if (await store.TryGetAsync(oldId, cancellationToken).ConfigureAwait(false) is not UserSessionState stored)
            return false;

        UISessionSecret key = UISessionSecret.New();
        DateTime utcNow = DateTime.UtcNow;
        UIRuntimeKey oldKey = CreateRuntimeKey(handle);
        IUIRuntime[]? ended = null;
        UserSessionState? signedIn;

        try
        {
            // Something written into a session is a client using it: the full idle timeout. Moved here, so no load has a rotation to claim.
            signedIn = await MoveStoredSessionAsync(store, stored, key.SessionId, session => (update(session) ?? throw new InvalidOperationException("A session update returned no session.")) with { PendingIdRotation = false, IsUnclaimed = false, LastSeenAtUtc = utcNow }, moved => (ended = MovePages(handle, oldKey, moved)) is not null, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            // Owed whole once taken from the store, whatever the rest of the move does: no caller's token stops them halfway.
            foreach (IUIRuntime runtime in ended ?? [])
                await DisposeRuntimeAsync(runtime).ConfigureAwait(false);
        }

        if (signedIn is null)
            return false;

        Log.SessionIdRotated(_logger, new UISessionFingerprint(oldId), new UISessionFingerprint(key.SessionId));

        // Owed whole once the store moved: no caller's token stops the key halfway. A render running the controller's code is a response
        // that can hand the key out itself; a page is handed it by its platform.
        if (IsRendersOwn(handle.Instance))
            _renderKeys.AddOrUpdate(handle, key);
        else if (_services.GetService<IUISessionKeyHandover>() is IUISessionKeyHandover handover)
            await handover.HandOverAsync(handle, key, oldId, CancellationToken.None).ConfigureAwait(false);

        return true;
    }

    /// <summary>Whether a page other than <paramref name="handle"/>'s is attached to its runtime.</summary>
    private bool SharesRuntimeWithAnotherPage(UIHandle handle)
    {
        if (!RuntimeStore.TryGet(CreateRuntimeKey(handle), out IUIRuntime? runtime))
            return false;

        foreach (UIHandle viewer in Own(runtime!).ViewerHandles)
        {
            if (!string.Equals(viewer.Instance.Id, handle.Instance.Id, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Takes the signing-in page and its runtime to the session's new id, and every other runtime of the old id away to end unannounced,
    /// before the old id is gone; answers those, or null where the page's runtime is gone already — ended with the old id meanwhile, or
    /// let go of.
    /// </summary>
    /// <remarks>
    /// Before, so a request on another page of the old id that finds it gone finds no runtime of it to end — not this one, which a
    /// stranger sharing a planted id could otherwise end mid-move, nor one whose page it would send away. Any other connection on the
    /// page's runtime — another tab under <c>PerClient</c>, perhaps another browser holding the old key — is let go of, so nothing the
    /// signed-in page sees is pushed to it. No page is sent away: it would load under the old key, and the session that load is issued
    /// could reach the browser after the signed-in one and sign it out.
    /// </remarks>
    private IUIRuntime[]? MovePages(UIHandle handle, UIRuntimeKey oldKey, UserSessionState signedIn)
    {
        IUIRuntime? runtime = RuntimeStore.Move(oldKey, oldKey with { SessionId = signedIn.SessionId }, handle, signedIn, DateTime.UtcNow, out var released);

        if (runtime is null)
            return null;

        IUIRuntimeConnectionUpdater connections = Own(runtime);

        for (var i = 0; i < released.Length; i++)
            connections.DetachConnection(released[i]);

        return RuntimeStore.RemoveSession(oldKey.SessionId, keep: null);
    }

    /// <inheritdoc />
    public UISessionSecret? TakeRenderKey(UIHandle handle)
    {
        ArgumentNullException.ThrowIfNull(handle);

        return _renderKeys.TryGetValue(handle, out UISessionSecret? key) && _renderKeys.Remove(handle) ? key : null;
    }

    /// <inheritdoc />
    public async Task EndSessionAsync(string sessionId, UIHandle? except = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        await _services.GetRequiredService<IUserSessionStore>().RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);

        var count = await EndRemovedSessionAsync(sessionId, except).ConfigureAwait(false);

        Log.SessionEnded(_logger, new UISessionFingerprint(sessionId), count);
    }

    /// <summary>
    /// What a session's end does apart from the store, to a session gone from it — a sign-out's or the cleanup's purge: its files
    /// go, since they are reachable only through it, and so do its pages, which would otherwise go on being pushed to and written
    /// from as nobody. Answers how many runtimes ended.
    /// </summary>
    /// <remarks>
    /// Owed whole once the store let the session go, so no caller's token stops it halfway — a tab closed right after its sign-out
    /// cancels that one — and the pages go first, so a file store that throws cannot leave them open as nobody.
    /// </remarks>
    private async Task<int> EndRemovedSessionAsync(string sessionId, UIHandle? except)
    {
        var count = await EndSessionRuntimesAsync(sessionId, except).ConfigureAwait(false);

        await _services.GetRequiredService<IUIFileStore>().RemoveSessionAsync(sessionId, CancellationToken.None).ConfigureAwait(false);

        return count;
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
    private async Task EndRuntimeAsync(IUIRuntime runtime, bool signIn, UIHandle? except = null)
    {
        await SendViewersAwayAsync(runtime, signIn, except).ConfigureAwait(false);
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
        IUIUpdateSink updates = _services.GetRequiredService<IUIUpdateSink>();

        foreach (UIHandle viewer in Own(runtime).ViewerHandles)
        {
            if (except is not null && StringComparer.Ordinal.Equals(viewer.Instance.Id, except.Instance.Id))
                continue;

            UINavigationRequest page = viewer.Instance.Navigation;

            // Ahead of the navigation: its runtime is gone, so nothing the page held can be saved, and nothing is asked.
            UICommandExecutionResult result = new()
            {
                Command = UICommandResult.Ok([new NavigateEffect(signIn && viewer.Session.IsAuthenticated && StandardResolveExceptionViewHandler.TryBuildSignIn(_application, page.Route, page, out UINavigationRequest? signInPage) ? signInPage : page)]),
                Changes = new ServerChangeSet { Updates = [new ServerPageUIUpdate { HoldsUnsavedWork = false }] }
            };

            await SendToViewerAsync(updates, viewer, result, Log.SessionEndNoticeFailed, CancellationToken.None).ConfigureAwait(false);
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
    /// A command's code changed its own session: what <see cref="UpdateUserSessionsAsync"/> does for a change from outside — the
    /// session's pages re-checked against their routes, and reached — but the page that ran it left to its runtime, which answers
    /// whether its route no longer passes (<see cref="EndIfRefusedAsync"/> then ends it, once the code's answer is built).
    /// </summary>
    internal async Task<bool> SessionChangedInCommandAsync(UserSessionState session, UIHandle origin, UIRuntime originRuntime, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentNullException.ThrowIfNull(origin);
        ArgumentNullException.ThrowIfNull(originRuntime);

        UIRuntimeKey own = CreateRuntimeKey(origin);

        await EndRefusedRuntimesAsync(session, except: own).ConfigureAwait(false);
        await ReachSessionAsync(session, origin, originRuntime, cancellationToken).ConfigureAwait(false);

        return !PassesRoute(own, session);
    }

    /// <summary>
    /// Ends a page's runtime where the session as stored now no longer passes its route, answering whether it did; the runtime's other
    /// pages are sent away, <paramref name="page"/> too unless <paramref name="carriedByAnswer"/> — its command's answer takes it away.
    /// A session gone is the touch's to end.
    /// </summary>
    internal async Task<bool> EndIfRefusedAsync(UIHandle page, bool carriedByAnswer)
    {
        ArgumentNullException.ThrowIfNull(page);

        UIRuntimeKey key = CreateRuntimeKey(page);
        IUserSessionStore store = _services.GetRequiredService<IUserSessionStore>();

        if (await store.TryGetAsync(page.Session.SessionId, CancellationToken.None).ConfigureAwait(false) is not UserSessionState stored
            || PassesRoute(key, stored)
            || !RuntimeStore.Remove(key, out IUIRuntime? runtime))
        {
            return false;
        }

        await EndRuntimeAsync(runtime!, signIn: false, carriedByAnswer ? page : null).ConfigureAwait(false);

        return true;
    }

    /// <summary>
    /// Ends the session's open pages whose route the changed session no longer passes, sending each back to its own address: its
    /// resolution then refuses it the way any request is refused, to sign in or to the forbidden page.
    /// </summary>
    private async Task EndRefusedRuntimesAsync(UserSessionState session, UIRuntimeKey? except = null)
    {
        UIRuntimeKey[] keys = RuntimeStore.GetSessionKeys(session.SessionId);

        for (var i = 0; i < keys.Length; i++)
        {
            if (keys[i] == except || PassesRoute(keys[i], session) || !RuntimeStore.Remove(keys[i], out IUIRuntime? runtime))
                continue;

            await EndRuntimeAsync(runtime!, signIn: false).ConfigureAwait(false);
        }
    }

    /// <summary>Whether a runtime's route lets the session open it; a route no longer registered refuses nothing.</summary>
    private bool PassesRoute(UIRuntimeKey key, UserSessionState session)
        => !_application.Routes.TryGetEntry(key.Route, out UIRouteEntry? entry) || Passes(entry.Definition, session);

    /// <summary>Whether a session may open a route: the check a page's resolution makes, as an answer rather than a refusal.</summary>
    private bool Passes(UIRouteDefinition route, UserSessionState session)
        => UIRouteAccess.Check(route, session, _authorization) == UIRouteAccessVerdict.Pass;
}
