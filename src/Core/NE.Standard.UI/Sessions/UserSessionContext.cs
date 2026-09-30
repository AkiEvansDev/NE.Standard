using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// Represents immutable user session data used by UI routing, authorization, and runtime services.
/// </summary>
public class UserSessionContext : IUserSessionContext
{
    // Who an anonymous session is: no one, whatever its id; only its identity is ever read.
    private static readonly UserSessionContext NoOne = Anonymous("anonymous");

    /// <summary>
    /// Creates a user session context from its identity, locale, and authorization data.
    /// </summary>
    public UserSessionContext(string sessionId, string language, UIThemeMode? themeMode, bool isAuthenticated, string? userId = null, IReadOnlySet<string>? roles = null, IReadOnlySet<string>? permissions = null, string? timeZone = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(language);

        SessionId = sessionId;
        Language = language;
        ThemeMode = themeMode;
        TimeZone = timeZone;
        IsAuthenticated = isAuthenticated;
        UserId = userId;
        Roles = roles is null || roles.Count == 0
            ? []
            : roles.ToFrozenSet(StringComparer.Ordinal);
        Permissions = permissions is null || permissions.Count == 0
            ? []
            : permissions.ToFrozenSet(StringComparer.Ordinal);
    }

    /// <inheritdoc />
    public string SessionId { get; }

    /// <inheritdoc />
    public string Language { get; }

    /// <inheritdoc />
    public UIThemeMode? ThemeMode { get; }

    /// <inheritdoc />
    public UIThemeColors? ThemeColors { get; init; }

    /// <inheritdoc />
    public string? TimeZone { get; }

    /// <inheritdoc />
    public bool IsAuthenticated { get; }

    /// <inheritdoc />
    public string? UserId { get; }

    /// <inheritdoc />
    public IReadOnlySet<string> Roles { get; }

    /// <inheritdoc />
    public IReadOnlySet<string> Permissions { get; }

    /// <summary>
    /// Creates an unauthenticated user session context.
    /// </summary>
    public static UserSessionContext Anonymous(string sessionId, string language = "en", UIThemeMode? themeMode = null)
        => new(sessionId, language, themeMode, isAuthenticated: false);

    /// <summary>
    /// Creates an authenticated user session context with the given roles and permissions.
    /// </summary>
    public static UserSessionContext Authenticated(string sessionId, string language = "en", UIThemeMode? themeMode = null, string? userId = null, IReadOnlySet<string>? roles = null, IReadOnlySet<string>? permissions = null)
        => new(sessionId, language, themeMode, isAuthenticated: true, userId, roles, permissions);

    /// <summary>The same session — identity, language, theme and zone — under <paramref name="sessionId"/>.</summary>
    internal static UserSessionContext WithSessionId(IUserSessionContext session, string sessionId)
        => Copy(sessionId, session, session.Language, session.ThemeMode, session.TimeZone, session.ThemeColors);

    /// <summary>A signed-out session under <paramref name="sessionId"/> that keeps the reader's language, theme and zone.</summary>
    internal static UserSessionContext AnonymousAs(IUserSessionContext session, string sessionId)
        => Copy(sessionId, NoOne, session.Language, session.ThemeMode, session.TimeZone, session.ThemeColors);

    /// <summary>
    /// The one way a session is copied: <paramref name="identity"/>'s identity — signed in or not, the user, roles and permissions —
    /// under <paramref name="sessionId"/>, in the reader's language, theme, zone and colours given.
    /// </summary>
    internal static UserSessionContext Copy(string sessionId, IUserSessionContext identity, string language, UIThemeMode? themeMode, string? timeZone, UIThemeColors? themeColors)
        => new(sessionId, language, themeMode, identity.IsAuthenticated, identity.UserId, identity.Roles, identity.Permissions, timeZone) { ThemeColors = themeColors };
}
