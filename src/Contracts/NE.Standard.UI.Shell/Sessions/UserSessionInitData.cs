using System.Security.Claims;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Provides client connection data used to initialize a user session.
/// </summary>
public sealed class UserSessionInitData
{
    /// <summary>
    /// Gets the session id the client presented, when it has one.
    /// </summary>
    /// <remarks>
    /// Carried by the platform — a cookie on the web — and looked up in <see cref="IUserSessionStore"/>. Null
    /// or unknown means a new session is issued, which is also what makes the id unguessable rather than
    /// derived from anything the client controls.
    /// </remarks>
    public string? SessionId { get; init; }

    /// <summary>
    /// Gets the client connection id.
    /// </summary>
    public string? ConnectionId { get; init; }

    /// <summary>
    /// Gets the client tab id.
    /// </summary>
    public string? ClientTabId { get; init; }

    /// <summary>
    /// Gets the authentication credential supplied by the client.
    /// </summary>
    /// <remarks>
    /// An opaque host-supplied token, never an identity and never the source of the session id. Prefer
    /// <see cref="Principal"/>, which the shipped resolver actually maps.
    /// </remarks>
    public string? Credential { get; init; }

    /// <summary>
    /// Gets the principal the host authenticated, when it authenticates at all.
    /// </summary>
    /// <remarks>
    /// <see cref="ClaimsPrincipal"/> rather than anything ASP.NET-shaped, so the platform layer hands over the
    /// result of its authentication without this framework knowing the scheme. Only read when
    /// <c>UISecurityOptions.IdentitySource</c> is <c>Claims</c>.
    /// </remarks>
    public ClaimsPrincipal? Principal { get; init; }
}
