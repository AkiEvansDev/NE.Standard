using System.Collections.Frozen;
using System.Collections.Generic;
using System.Security.Claims;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// The identity a <see cref="ClaimsPrincipal"/> contributes to a session.
/// </summary>
public sealed record UserClaimsIdentity
{
    /// <summary>
    /// Gets whether the principal is authenticated.
    /// </summary>
    public required bool IsAuthenticated { get; init; }

    /// <summary>
    /// Gets the stable user identifier, when the principal carries one.
    /// </summary>
    /// <remarks>
    /// Distinguishes the same user reconnecting from a different user on the same client, which must replace
    /// rather than merge into the session's identity.
    /// </remarks>
    public string? UserId { get; init; }

    /// <summary>
    /// Gets roles read from the principal.
    /// </summary>
    public IReadOnlySet<string> Roles { get; init; } = FrozenSet<string>.Empty;

    /// <summary>
    /// Gets permissions read from the principal.
    /// </summary>
    public IReadOnlySet<string> Permissions { get; init; } = FrozenSet<string>.Empty;

    /// <summary>
    /// An identity carrying nothing, which is what an unauthenticated principal maps to.
    /// </summary>
    public static UserClaimsIdentity Anonymous { get; } = new() { IsAuthenticated = false };
}

/// <summary>
/// Turns the host's <see cref="ClaimsPrincipal"/> into the roles and permissions the UI authorizes against.
/// </summary>
/// <remarks>
/// The seam between whatever scheme the host authenticates with and this framework; replace the registered
/// implementation to map an application's own claim shapes.
/// </remarks>
public interface IUserClaimsMapper
{
    /// <summary>
    /// Maps a principal to the identity it grants.
    /// </summary>
    UserClaimsIdentity Map(ClaimsPrincipal principal);
}
