using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Keeps anonymous sessions in memory and signed-in ones in an application's own store, so a store in a database only ever sees
/// the sessions worth keeping — not every crawler, health check and first visit.
/// </summary>
/// <remarks>
/// A session that signs in moves to the signed-in store with the update that signed it in, and one signed out by an update (a
/// host's principal gone, under <c>UIIdentitySource.Claims</c>) moves back; a sign-out through <see cref="RemoveAsync"/> just
/// removes it. Reads look in memory first. <see cref="SaveAsync"/> places a session by its own state and does not look for its id
/// in the other store: the host saves only ids it has just issued, and a stored session changes through
/// <see cref="TryUpdateAsync"/>. Anonymous sessions are lost when the process stops, which costs a visitor a fresh session.
/// </remarks>
public sealed class UserSessionSplitStore : IUserSessionStore, IDisposable
{
    private readonly IUserSessionStore _signedIn;

    // A move writes one store and then the other; moves are rare (a sign-in, a sign-out under claims), so one at a time for the
    // whole store, which keeps two moves of one session from landing in the signed-in store out of order.
    private readonly SemaphoreSlim _moves = new(1, 1);

    /// <summary>Creates a store keeping anonymous sessions in memory and signed-in ones in <paramref name="signedIn"/>.</summary>
    public UserSessionSplitStore(IUserSessionStore signedIn)
    {
        ArgumentNullException.ThrowIfNull(signedIn);

        _signedIn = signedIn;
    }

    /// <summary>Gets the anonymous sessions' store, for the host's meter.</summary>
    internal UserSessionMemoryStore Anonymous { get; } = new();

    /// <inheritdoc />
    public async ValueTask<UserSessionState?> TryGetAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        return Anonymous.TryRead(sessionId, out UserSessionState? anonymous)
            ? anonymous
            : await _signedIn.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async ValueTask SaveAsync(UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        session.Validate();

        if (!session.IsAuthenticated)
        {
            await Anonymous.SaveAsync(session, cancellationToken).ConfigureAwait(false);
            return;
        }

        await _signedIn.SaveAsync(session, cancellationToken).ConfigureAwait(false);
        await Anonymous.RemoveAsync(session.SessionId, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async ValueTask<bool> TryUpdateAsync(string sessionId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(update);

        while (Anonymous.TryRead(sessionId, out UserSessionState? current))
        {
            UserSessionState updated = UserSessionMemoryStore.Apply(sessionId, current, update);

            if (ReferenceEquals(updated, current))
                return true;

            if (!Anonymous.TrySwap(sessionId, updated, current))
                continue;

            if (updated.IsAuthenticated)
                await MoveToSignedInAsync(updated).ConfigureAwait(false);

            return true;
        }

        return await TryUpdateSignedInAsync(sessionId, update, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Moves a session that signed in, held in memory until the signed-in store has it, so a reader never finds it in neither.</summary>
    /// <remarks>Not cancelled half-way: a move left undone would keep a signed-in session in memory alone.</remarks>
    private async Task MoveToSignedInAsync(UserSessionState moving)
    {
        var sessionId = moving.SessionId;

        await _moves.WaitAsync(CancellationToken.None).ConfigureAwait(false);
        try
        {
            // Changed or removed meanwhile: whoever changed it moves what they wrote, and a removed session stays removed.
            if (!Anonymous.TryRead(sessionId, out UserSessionState? held) || !ReferenceEquals(held, moving))
                return;

            await _signedIn.SaveAsync(moving, CancellationToken.None).ConfigureAwait(false);

            if (Anonymous.TryTake(sessionId, moving))
                return;

            // Changed while it was written: a later sign-in moves its own write after this one; anything else — signed out again,
            // removed — must not leave this copy behind in the signed-in store.
            if (Anonymous.TryRead(sessionId, out UserSessionState? now) && now.IsAuthenticated)
                return;

            await _signedIn.RemoveAsync(sessionId, CancellationToken.None).ConfigureAwait(false);
        }
        finally
        {
            _ = _moves.Release();
        }
    }

    /// <summary>Updates a session the signed-in store holds, moving it to memory when the update signs it out.</summary>
    private async ValueTask<bool> TryUpdateSignedInAsync(string sessionId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken)
    {
        UserSessionState? leaving = null;

        var existed = await _signedIn.TryUpdateAsync(sessionId, stored =>
        {
            UserSessionState updated = UserSessionMemoryStore.Apply(sessionId, stored, update);

            // Left as it is there: it goes to memory, and then out of the signed-in store.
            leaving = updated.IsAuthenticated ? null : updated;
            return leaving is null ? updated : stored;
        }, cancellationToken).ConfigureAwait(false);

        if (existed && leaving is not null)
            await MoveToAnonymousAsync(leaving).ConfigureAwait(false);

        return existed;
    }

    /// <summary>Moves a session an update signed out, into memory before out of the signed-in store, so a reader never finds it in neither.</summary>
    private async Task MoveToAnonymousAsync(UserSessionState leaving)
    {
        await _moves.WaitAsync(CancellationToken.None).ConfigureAwait(false);
        try
        {
            _ = Anonymous.TryAdd(leaving);
            await _signedIn.RemoveAsync(leaving.SessionId, CancellationToken.None).ConfigureAwait(false);
        }
        finally
        {
            _ = _moves.Release();
        }
    }

    /// <inheritdoc />
    public async ValueTask<bool> TouchAsync(string sessionId, DateTime utcNow, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        // The signed-in store's own touch, which may be cheaper than an update; one that just left memory is found there too.
        return Anonymous.TryRead(sessionId, out _)
            ? await TryUpdateAsync(sessionId, session => session with { LastSeenAtUtc = utcNow }, cancellationToken).ConfigureAwait(false)
            : await _signedIn.TouchAsync(sessionId, utcNow, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        // An anonymous session was never in the signed-in store: removing it costs that store nothing.
        if (Anonymous.TryRead(sessionId, out UserSessionState? held) && !held.IsAuthenticated)
        {
            await Anonymous.RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);
            return;
        }

        // After any move under way, which would otherwise put the session back where this took it from.
        await _moves.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            await Anonymous.RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);
            await _signedIn.RemoveAsync(sessionId, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            _ = _moves.Release();
        }
    }

    /// <inheritdoc />
    public async ValueTask<IReadOnlyList<string>> FindByUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        IReadOnlyList<string> signedIn = await _signedIn.FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);
        // Only a session caught moving in is signed in and in memory.
        IReadOnlyList<string> moving = await Anonymous.FindByUserAsync(userId, cancellationToken).ConfigureAwait(false);

        return moving.Count == 0 ? signedIn : Union(signedIn, moving);
    }

    private static List<string> Union(IReadOnlyList<string> first, IReadOnlyList<string> second)
    {
        HashSet<string> seen = new(first, StringComparer.Ordinal);
        List<string> all = [.. first];

        for (var i = 0; i < second.Count; i++)
        {
            if (seen.Add(second[i]))
                all.Add(second[i]);
        }

        return all;
    }

    /// <inheritdoc />
    public async ValueTask<IReadOnlyList<string>> CleanupAsync(DateTime utcNow, UISessionOptions options, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(options);

        IReadOnlyList<string> anonymous = await Anonymous.CleanupAsync(utcNow, options, cancellationToken).ConfigureAwait(false);
        IReadOnlyList<string> signedIn = await _signedIn.CleanupAsync(utcNow, options, cancellationToken).ConfigureAwait(false);

        if (anonymous.Count == 0)
            return signedIn;

        return signedIn.Count == 0 ? anonymous : [.. anonymous, .. signedIn];
    }

    /// <inheritdoc />
    public void Dispose()
        => _moves.Dispose();
}
