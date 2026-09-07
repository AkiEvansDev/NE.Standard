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
    /// Null or unknown means a new session is issued, keeping the id unguessable rather than derived from anything the client controls.
    /// </remarks>
    public string? SessionId { get; init; }

    /// <summary>
    /// Gets the client connection id.
    /// </summary>
    public string? ConnectionId { get; init; }

    /// <summary>
    /// Gets the client's id for the window the request came from, when the platform knows it.
    /// </summary>
    public string? ClientWindowId { get; init; }

    /// <summary>
    /// Gets the authentication credential supplied by the client.
    /// </summary>
    /// <remarks>
    /// An opaque host-supplied token, never an identity or the source of the session id; prefer
    /// <see cref="Principal"/>, which the shipped resolver maps.
    /// </remarks>
    public string? Credential { get; init; }

    /// <summary>
    /// Gets the principal the host authenticated, when it authenticates at all.
    /// </summary>
    /// <remarks>
    /// Only read when <c>UISecurityOptions.IdentitySource</c> is <c>Claims</c>.
    /// </remarks>
    public ClaimsPrincipal? Principal { get; init; }
}
