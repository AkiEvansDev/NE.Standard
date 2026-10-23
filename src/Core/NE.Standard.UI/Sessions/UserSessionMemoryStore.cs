using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>Keeps user sessions in the process's own memory — the store the framework registers when the application registers none.</summary>
/// <remarks>
/// Correct only for a single process, and every session is gone when it stops. <see cref="UserSessionSplitStore"/> keeps anonymous
/// sessions in one of these and signed-in ones in an application's own store.
/// </remarks>
public sealed class UserSessionMemoryStore : IUserSessionStore
{
    private readonly ConcurrentDictionary<string, UserSessionState> _sessions = new(StringComparer.Ordinal);

    // The unclaimed sessions the host issued, oldest first; an id here may since be claimed or gone. Filled only by AdmitUnclaimed.
    private readonly ConcurrentQueue<string> _issuedUnclaimed = new();

    /// <summary>Gets how many sessions the store holds, for the host's meter.</summary>
    public int Count => _sessions.Count;

    /// <inheritdoc />
    public ValueTask<UserSessionState?> TryGetAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        return ValueTask.FromResult(_sessions.TryGetValue(sessionId, out UserSessionState? session) ? session : null);
    }

    /// <inheritdoc />
    public ValueTask SaveAsync(UserSessionState session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        session.Validate();

        _sessions[session.SessionId] = session;

        return ValueTask.CompletedTask;
    }

    /// <inheritdoc />
    public ValueTask<bool> TryUpdateAsync(string sessionId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentNullException.ThrowIfNull(update);

        // Compare-and-swap: a session removed or replaced between the read and the write is read again, never written back.
        while (_sessions.TryGetValue(sessionId, out UserSessionState? current))
        {
            UserSessionState updated = Apply(sessionId, current, update);

            if (ReferenceEquals(updated, current) || _sessions.TryUpdate(sessionId, updated, current))
                return ValueTask.FromResult(true);
        }

        return ValueTask.FromResult(false);
    }

    /// <summary>Runs an update on a stored session and checks what it answered — the one reading of an update, for every store here.</summary>
    internal static UserSessionState Apply(string sessionId, UserSessionState current, Func<UserSessionState, UserSessionState> update)
    {
        UserSessionState updated = update(current);

        ArgumentNullException.ThrowIfNull(updated);
        updated.Validate();

        if (!string.Equals(updated.SessionId, sessionId, StringComparison.Ordinal))
            throw new InvalidOperationException("An update cannot change the session's id.");

        return updated;
    }

    /// <inheritdoc />
    public ValueTask<bool> TouchAsync(string sessionId, DateTime utcNow, CancellationToken cancellationToken = default)
        => TryUpdateAsync(sessionId, session => session with { LastSeenAtUtc = utcNow }, cancellationToken);

    /// <inheritdoc />
    public ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        _ = _sessions.TryRemove(sessionId, out _);

        return ValueTask.CompletedTask;
    }

    /// <inheritdoc />
    public ValueTask<IReadOnlyList<string>> FindByUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        List<string> found = [];

        foreach (KeyValuePair<string, UserSessionState> pair in _sessions)
        {
            if (pair.Value.IsAuthenticated && string.Equals(pair.Value.UserId, userId, StringComparison.Ordinal))
                found.Add(pair.Key);
        }

        return ValueTask.FromResult<IReadOnlyList<string>>(found);
    }

    /// <inheritdoc />
    public ValueTask<IReadOnlyList<string>> CleanupAsync(DateTime utcNow, UISessionOptions options, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(options);

        List<string> expired = [];

        foreach (KeyValuePair<string, UserSessionState> pair in _sessions)
        {
            if (pair.Value.IsIdle(options, utcNow))
                expired.Add(pair.Key);
        }

        List<string> removed = [];

        for (var i = 0; i < expired.Count; i++)
        {
            // Removed by (key, value) pair so a session touched between the scan and here is left alone rather than dropped.
            if (_sessions.TryGetValue(expired[i], out UserSessionState? session) &&
                session.IsIdle(options, utcNow) &&
                _sessions.TryRemove(new KeyValuePair<string, UserSessionState>(expired[i], session)))
            {
                removed.Add(expired[i]);
            }
        }

        return ValueTask.FromResult<IReadOnlyList<string>>(removed);
    }

    /// <summary>The session as held now, for a caller that swaps or takes it by what it read.</summary>
    internal bool TryRead(string sessionId, [NotNullWhen(true)] out UserSessionState? session)
        => _sessions.TryGetValue(sessionId, out session);

    /// <summary>Replaces a session only while it is still <paramref name="current"/>.</summary>
    internal bool TrySwap(string sessionId, UserSessionState updated, UserSessionState current)
        => _sessions.TryUpdate(sessionId, updated, current);

    /// <summary>Removes a session only while it is still <paramref name="current"/>.</summary>
    internal bool TryTake(string sessionId, UserSessionState current)
        => _sessions.TryRemove(new KeyValuePair<string, UserSessionState>(sessionId, current));

    /// <summary>Adds a session under an id the store does not hold.</summary>
    internal bool TryAdd(UserSessionState session)
        => _sessions.TryAdd(session.SessionId, session);

    /// <summary>
    /// Counts a session just issued unclaimed, then gives up the oldest still unclaimed past <paramref name="max"/>; answers how many
    /// went.
    /// </summary>
    /// <remarks>
    /// Issue order, not last-seen time: a queue makes it O(1) a load where a scan would be O(sessions). An id in the queue that a tab
    /// claimed or the sweep removed since only leaves it, so the queue never holds more than <paramref name="max"/> ids.
    /// </remarks>
    internal int AdmitUnclaimed(string sessionId, int max)
    {
        _issuedUnclaimed.Enqueue(sessionId);

        var evicted = 0;

        while (_issuedUnclaimed.Count > max && _issuedUnclaimed.TryDequeue(out var oldest))
        {
            if (_sessions.TryGetValue(oldest, out UserSessionState? session) && session.IsUnclaimed && _sessions.TryRemove(new KeyValuePair<string, UserSessionState>(oldest, session)))
                evicted++;
        }

        return evicted;
    }

    /// <summary>The in-memory store a store keeps its anonymous sessions in: itself, a split store's; none for an application's own.</summary>
    internal static UserSessionMemoryStore? Of(IUserSessionStore? store)
        => store switch
        {
            UserSessionMemoryStore memory => memory,
            UserSessionSplitStore split => split.Anonymous,
            _ => null
        };
}
