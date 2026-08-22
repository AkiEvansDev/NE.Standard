using System.Collections.Generic;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Represents user session data available to UI routing, authorization, and runtime services.
/// </summary>
public interface IUserSessionContext
{
    /// <summary>
    /// Gets the stable session id.
    /// </summary>
    string SessionId { get; }

    /// <summary>
    /// Gets the session language.
    /// </summary>
    string Language { get; }

    /// <summary>
    /// Gets the preferred theme mode.
    /// </summary>
    UIThemeMode ThemeMode { get; }

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
