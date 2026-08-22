using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Keeps user sessions in the process's own memory.
/// </summary>
/// <remarks>
/// The default, and correct only for a single process: sessions vanish on restart and are invisible to a
/// second instance behind a load balancer. Registered with <c>TryAddSingleton</c>, so a host swaps it by
/// registering its own <see cref="IUserSessionStore"/> first.
/// </remarks>
internal sealed class InMemoryUserSessionStore : IUserSessionStore
{
    private readonly ConcurrentDictionary<string, UserSessionState> _sessions = new(StringComparer.Ordinal);

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
    public ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        _ = _sessions.TryRemove(sessionId, out _);

        return ValueTask.CompletedTask;
    }

    /// <inheritdoc />
    public ValueTask<int> CleanupAsync(DateTime utcNow, TimeSpan idleTimeout, CancellationToken cancellationToken = default)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(idleTimeout.Ticks);

        List<string> expired = [];

        foreach (KeyValuePair<string, UserSessionState> pair in _sessions)
        {
            if (pair.Value.LastSeenAtUtc + idleTimeout <= utcNow)
                expired.Add(pair.Key);
        }

        var removed = 0;

        for (var i = 0; i < expired.Count; i++)
        {
            // Removed by (key, value) pair so a session touched between the scan and here — which replaces the
            // stored instance — is left alone rather than dropped under the request that just used it.
            if (_sessions.TryGetValue(expired[i], out UserSessionState? session) &&
                session.LastSeenAtUtc + idleTimeout <= utcNow &&
                _sessions.TryRemove(new KeyValuePair<string, UserSessionState>(expired[i], session)))
            {
                removed++;
            }
        }

        return ValueTask.FromResult(removed);
    }
}
