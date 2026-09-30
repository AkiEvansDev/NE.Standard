using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Convenience operations built on <see cref="IUserSessionStore"/>.
/// </summary>
public static class UserSessionStoreExtensions
{
    /// <summary>
    /// Records the theme a session moved to, so the next page render starts in it, answering the session as stored — left as it
    /// was where it already had the theme — or <see langword="null"/> when it no longer exists.
    /// </summary>
    /// <remarks>
    /// The page's own switch: the caller makes the answer the connection's session (<c>UIHost.ApplySessionChangeAsync</c>), as the
    /// language's. Through <see cref="IUserSessionStore.TryUpdateAsync"/>: a read and a save of its own would write back a session
    /// signed out or changed meanwhile.
    /// </remarks>
    public static async ValueTask<UserSessionState?> SetThemeModeAsync(this IUserSessionStore store, string sessionId, UIThemeMode? mode, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        UserSessionState? written = null;

        var existed = await store.TryUpdateAsync(sessionId, session => written = session.ThemeMode == mode && !session.IsUnclaimed
            ? session
            : session with { ThemeMode = mode, IsUnclaimed = false }, cancellationToken).ConfigureAwait(false);

        return existed ? written : null;
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

    /// <summary>
    /// Puts a reader's own brand colours on a session, or none for the application's palette, answering the session as stored — left
    /// as it was where it already had them — or <see langword="null"/> when it no longer exists.
    /// </summary>
    /// <remarks>The page's own <c>SetThemeColorsEffect</c>: the caller makes the answer the connection's session, as the language's.</remarks>
    public static async ValueTask<UserSessionState?> SetThemeColorsAsync(this IUserSessionStore store, string sessionId, UIThemeColors? colors, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        // None set is the application's palette, stored as nothing so an unchanged session compares equal.
        UIThemeColors? kept = colors is { IsEmpty: false } ? colors : null;
        UserSessionState? written = null;

        kept?.Validate();

        var existed = await store.TryUpdateAsync(sessionId, session => written = Equals(session.ThemeColors, kept) && !session.IsUnclaimed
            ? session
            : session with { ThemeColors = kept, IsUnclaimed = false }, cancellationToken).ConfigureAwait(false);

        return existed ? written : null;
    }
}
