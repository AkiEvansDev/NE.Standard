using System;
using System.Security.Cryptography;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Sessions;

/// <summary>
/// The one place a session id is issued and a resolved session is checked, for the resolver and the host alike.
/// </summary>
internal static class UserSessions
{
    /// <summary>
    /// Issues an unguessable session id — a predictable one is a session-fixation invitation.
    /// </summary>
    public static string NewId()
        => Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

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
