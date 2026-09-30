using System;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// The one place a resolved session is checked, for the resolver and the host alike; ids are issued by <see cref="UISessionSecret"/>.
/// </summary>
internal static class UserSessions
{
    /// <summary>
    /// Refuses a session missing what every access check reads.
    /// </summary>
    public static void Validate(IUserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(session);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(session.Language);
        ArgumentNullException.ThrowIfNull(session.Roles);
        ArgumentNullException.ThrowIfNull(session.Permissions);
    }
}
