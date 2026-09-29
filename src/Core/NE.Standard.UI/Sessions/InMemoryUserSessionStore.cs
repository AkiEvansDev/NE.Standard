using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>Keeps user sessions in the process's own memory.</summary>
/// <remarks>Correct only for a single process; a host swaps it by registering its own <see cref="IUserSessionStore"/> first.</remarks>
internal sealed class InMemoryUserSessionStore : IUserSessionStore
{
    private readonly ConcurrentDictionary<string, UserSessionState> _sessions = new(StringComparer.Ordinal);

    /// <summary>How many sessions the store holds, for the host's meter.</summary>
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
            UserSessionState updated = update(current);

            ArgumentNullException.ThrowIfNull(updated);
            updated.Validate();

            if (!string.Equals(updated.SessionId, sessionId, StringComparison.Ordinal))
                throw new InvalidOperationException("An update cannot change the session's id.");

            if (_sessions.TryUpdate(sessionId, updated, current))
                return ValueTask.FromResult(true);
        }

        return ValueTask.FromResult(false);
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
}
