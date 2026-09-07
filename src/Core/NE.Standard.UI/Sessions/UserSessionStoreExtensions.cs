using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Convenience operations built on <see cref="IUserSessionStore"/>.
/// </summary>
public static class UserSessionStoreExtensions
{
    /// <summary>
    /// Records the theme a session moved to, so the next page render starts in it.
    /// </summary>
    /// <returns>
    /// <see langword="false"/> when the session no longer exists or already carries this theme — nothing was saved.
    /// </returns>
    public static async ValueTask<bool> SetThemeModeAsync(this IUserSessionStore store, string sessionId, UIThemeMode? mode, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        UserSessionState? session = await store.TryGetAsync(sessionId, cancellationToken).ConfigureAwait(false);

        if (session is null || session.ThemeMode == mode)
            return false;

        await store.SaveAsync(session with { ThemeMode = mode }, cancellationToken).ConfigureAwait(false);

        return true;
    }
}
