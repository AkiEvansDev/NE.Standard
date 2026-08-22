using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Security.Claims;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Security;

/// <summary>
/// Reads roles from the principal's own role claim type and permissions from the configured one.
/// </summary>
internal sealed class StandardUserClaimsMapper : IUserClaimsMapper
{
    private readonly UIApplication _application;

    public StandardUserClaimsMapper(UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(application);
        _application = application;
    }

    /// <inheritdoc />
    public UserClaimsIdentity Map(ClaimsPrincipal principal)
    {
        ArgumentNullException.ThrowIfNull(principal);

        if (principal.Identity?.IsAuthenticated != true)
            return UserClaimsIdentity.Anonymous;

        return new UserClaimsIdentity
        {
            IsAuthenticated = true,
            UserId = ReadUserId(principal),
            Roles = ReadRoles(principal),
            Permissions = ReadClaims(principal, _application.Security.PermissionClaimType)
        };
    }

    /// <summary>
    /// Prefers the subject identifier over the display name, which is not required to be unique or stable.
    /// </summary>
    private static string? ReadUserId(ClaimsPrincipal principal)
        => principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal.FindFirst("sub")?.Value
            ?? principal.Identity?.Name;

    /// <summary>
    /// Every identity is asked for its own role claim type, because a JWT identity and a cookie identity
    /// routinely disagree on what a role claim is called.
    /// </summary>
    private static FrozenSet<string> ReadRoles(ClaimsPrincipal principal)
    {
        HashSet<string> roles = new(StringComparer.Ordinal);

        foreach (ClaimsIdentity identity in principal.Identities)
        {
            foreach (Claim claim in identity.FindAll(identity.RoleClaimType))
                _ = roles.Add(claim.Value);
        }

        return FrozenSet.ToFrozenSet(roles, StringComparer.Ordinal);
    }

    private static FrozenSet<string> ReadClaims(ClaimsPrincipal principal, string claimType)
    {
        if (string.IsNullOrWhiteSpace(claimType))
            return [];

        HashSet<string> values = new(StringComparer.Ordinal);

        foreach (Claim claim in principal.FindAll(claimType))
            _ = values.Add(claim.Value);

        return FrozenSet.ToFrozenSet(values, StringComparer.Ordinal);
    }
}
