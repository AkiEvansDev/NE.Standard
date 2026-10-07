using NE.Standard.UI.Primitives.Security;

namespace NE.Standard.UI.Shell.Security;

/// <summary>
/// Application-wide security configuration.
/// </summary>
public sealed class UISecurityOptions
{
    /// <summary>Gets or sets what a route with no authorization attribute means.</summary>
    /// <remarks>
    /// <see cref="UIAuthorizationDefault.Anonymous"/> leaves a forgotten attribute open;
    /// <see cref="UIAuthorizationDefault.Authenticated"/> closes it instead.
    /// </remarks>
    public UIAuthorizationDefault DefaultPolicy { get; set; } = UIAuthorizationDefault.Anonymous;

    /// <summary>Gets or sets the route a refused request is sent to, when configured.</summary>
    /// <remarks>Set through <c>UIApplicationBuilder.SignInView</c>, which also registers the route as anonymous.</remarks>
    public string? SignInRoute { get; set; }

    /// <summary>Gets or sets the route an authenticated but insufficiently privileged request is sent to, when configured.</summary>
    /// <remarks>Falls back to <see cref="SignInRoute"/> when unset. Set through <c>UIApplicationBuilder.ForbiddenView</c>.</remarks>
    public string? ForbiddenRoute { get; set; }

    /// <summary>Gets or sets where a session's identity comes from.</summary>
    /// <remarks>
    /// <see cref="UIIdentitySource.Session"/> ignores any <c>ClaimsPrincipal</c>; <see cref="UIIdentitySource.Claims"/>
    /// makes the principal the authority in both directions.
    /// </remarks>
    public UIIdentitySource IdentitySource { get; set; } = UIIdentitySource.Session;

    /// <summary>Gets or sets the claim type permissions are read from.</summary>
    /// <remarks>Roles need no equivalent: a <c>ClaimsIdentity</c> already declares its own <c>RoleClaimType</c>.</remarks>
    public string PermissionClaimType { get; set; } = "permission";

    /// <summary>
    /// Gets or sets whether an open page's value writes and item-window reads re-check its route's rules against the session as
    /// stored, as its commands do.
    /// </summary>
    /// <remarks>
    /// An in-place navigation runs the route's view filters against the stored session whatever this says. Off by default: a session
    /// changed through the framework already ends the pages it no longer passes. On, it also catches a
    /// role revoked straight in the store or by another process, at the cost of one more store read per open page each
    /// <see cref="Sessions.UISessionOptions.TouchResolution"/>, in the turn that touches the session; the page then goes back to its
    /// own address, whose load refuses it.
    /// </remarks>
    public bool RecheckRouteOnActivity { get; set; }
}
