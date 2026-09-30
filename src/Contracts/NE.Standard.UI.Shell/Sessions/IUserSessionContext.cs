using System.Collections.Generic;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Represents user session data available to UI routing, authorization, and runtime services.
/// </summary>
public interface IUserSessionContext
{
    /// <summary>Gets the stable session id.</summary>
    /// <remarks>SHA-256 of the secret the client carries (<see cref="UISessionSecret"/>): it names the session and is no credential.</remarks>
    string SessionId { get; }

    /// <summary>
    /// Gets the session language.
    /// </summary>
    string Language { get; }

    /// <summary>
    /// Gets the preferred theme mode, or <see langword="null"/> to follow the platform's own preference.
    /// </summary>
    UIThemeMode? ThemeMode { get; }

    /// <summary>Gets the time zone the reader's client reported, an IANA id, or <see langword="null"/> while it has reported none.</summary>
    string? TimeZone { get; }

    /// <summary>
    /// Gets whether the session is authenticated.
    /// </summary>
    bool IsAuthenticated { get; }

    /// <summary>
    /// Gets the identifier of the signed-in user, when there is one.
    /// </summary>
    string? UserId { get; }

    /// <summary>
    /// Gets roles assigned to the session.
    /// </summary>
    IReadOnlySet<string> Roles { get; }

    /// <summary>
    /// Gets permissions assigned to the session.
    /// </summary>
    IReadOnlySet<string> Permissions { get; }
}
