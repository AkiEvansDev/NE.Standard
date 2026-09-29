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
    /// Records the theme a session moved to, so the next page render starts in it; answers <see langword="false"/> when the
    /// session no longer exists or already carries this theme, meaning nothing was saved.
    /// </summary>
    /// <remarks>
    /// Through <see cref="IUserSessionStore.TryUpdateAsync"/>: a read and a save of its own would write back a session signed out
    /// or changed meanwhile.
    /// </remarks>
    public static async ValueTask<bool> SetThemeModeAsync(this IUserSessionStore store, string sessionId, UIThemeMode? mode, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        var changed = false;

        var existed = await store.TryUpdateAsync(sessionId, session =>
        {
            changed = session.ThemeMode != mode;

            return changed ? session with { ThemeMode = mode, IsUnclaimed = false } : session;
        }, cancellationToken).ConfigureAwait(false);

        return existed && changed;
    }

    /// <summary>
    /// Moves a session to a language, answering the session as stored — left as it was where it already had the language, as the
    /// theme's is — or <see langword="null"/> when it no longer exists.
    /// </summary>
    /// <remarks>
    /// The page's own switch: the caller makes the answer the connection's session (<c>UIHost.ApplySessionChangeAsync</c>). Through
    /// <see cref="IUserSessionStore.TryUpdateAsync"/>, as every change is.
    /// </remarks>
    public static async ValueTask<UserSessionState?> SetLanguageAsync(this IUserSessionStore store, string sessionId, string language, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(language);

        UserSessionState? written = null;

        var existed = await store.TryUpdateAsync(sessionId, session => written = string.Equals(session.Language, language, StringComparison.Ordinal) && !session.IsUnclaimed
            ? session
            : session with { Language = language, IsUnclaimed = false }, cancellationToken).ConfigureAwait(false);

        return existed ? written : null;
    }
}
