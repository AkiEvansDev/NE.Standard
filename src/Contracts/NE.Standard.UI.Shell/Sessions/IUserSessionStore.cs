using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Stores user sessions between requests.
/// </summary>
/// <remarks>
/// The shipped implementation keeps sessions in memory, which is wrong once there is more than one process.
/// </remarks>
public interface IUserSessionStore
{
    /// <summary>
    /// Loads a session, or <see langword="null"/> when it is unknown or has expired.
    /// </summary>
    ValueTask<UserSessionState?> TryGetAsync(string sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates or replaces a session.
    /// </summary>
    ValueTask SaveAsync(UserSessionState session, CancellationToken cancellationToken = default);

    /// <summary>
    /// Applies <paramref name="update"/> to a stored session and saves the result, answering whether the session existed; never
    /// creates one.
    /// </summary>
    /// <remarks>
    /// Atomic where the store can make it so: read, apply and save as one step, so a session removed or changed meanwhile is not
    /// written back from a stale read — which would bring back a signed-out session or a revoked role.
    /// </remarks>
    ValueTask<bool> TryUpdateAsync(string sessionId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default);

    /// <summary>
    /// Moves a stored session's last-seen time to <paramref name="utcNow"/>, answering whether the session existed; never creates
    /// one and writes nothing else.
    /// </summary>
    ValueTask<bool> TouchAsync(string sessionId, DateTime utcNow, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a session, which is what signing out does.
    /// </summary>
    ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// The ids of the sessions signed in as <paramref name="userId"/> — every browser a person is signed in on.
    /// </summary>
    ValueTask<IReadOnlyList<string>> FindByUserAsync(string userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Drops the sessions <see cref="UserSessionState.IsIdle"/> reads as idle, returning the ids removed, so what the host
    /// keeps for them (their files) goes with them.
    /// </summary>
    ValueTask<IReadOnlyList<string>> CleanupAsync(DateTime utcNow, UISessionOptions options, CancellationToken cancellationToken = default);
}
