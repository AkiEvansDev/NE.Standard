namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Where a session's identity comes from.
/// </summary>
public enum UIIdentitySource
{
    /// <summary>
    /// The application signs users in itself; any principal the platform supplies is ignored.
    /// </summary>
    Session = 0,

    /// <summary>
    /// The host's <see cref="System.Security.Claims.ClaimsPrincipal"/> is the authority, in both directions.
    /// </summary>
    Claims = 1
}
