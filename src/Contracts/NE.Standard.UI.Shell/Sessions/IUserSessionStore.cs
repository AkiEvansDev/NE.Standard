using System;
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
    /// Removes a session, which is what signing out does.
    /// </summary>
    ValueTask RemoveAsync(string sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Drops sessions idle for longer than the timeout, returning how many were removed.
    /// </summary>
    ValueTask<int> CleanupAsync(DateTime utcNow, TimeSpan idleTimeout, CancellationToken cancellationToken = default);
}
