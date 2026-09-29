using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Ends and changes sessions from anywhere in an application — a sign-out, an account blocked, a role taken away — reaching the
/// pages open under them as well as the store.
/// </summary>
public interface IUISessions
{
    /// <summary>Ends a session everywhere but <paramref name="except"/>, the page that asked, which finishes its own answer.</summary>
    /// <remarks>
    /// Its stored record and uploads go, and every other page open under it is sent to <c>Security.SignInRoute</c> (reloaded, where
    /// none is configured) and its runtime ended.
    /// </remarks>
    Task EndSessionAsync(string sessionId, UIHandle? except = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Ends every session signed in as <paramref name="userId"/>, as <see cref="EndSessionAsync"/> ends one — a blocked or
    /// deleted account; answers how many there were.
    /// </summary>
    Task<int> EndUserSessionsAsync(string userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Applies <paramref name="update"/> to every session signed in as <paramref name="userId"/>; answers how many it changed.
    /// </summary>
    /// <remarks>
    /// The store is what every command's access check reads, so a changed role holds for pages already open from their next
    /// command, and for a route from the next page load.
    /// </remarks>
    Task<int> UpdateUserSessionsAsync(string userId, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken = default);
}
