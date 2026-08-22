using NE.Standard.UI.Primitives.Security;

namespace NE.Standard.UI.Shell.Security;

/// <summary>
/// Application-wide security configuration.
/// </summary>
public sealed class UISecurityOptions
{
    /// <summary>
    /// Gets or sets what a route with no authorization attribute means.
    /// </summary>
    /// <remarks>
    /// <see cref="UIAuthorizationDefault.Anonymous"/> keeps every unannotated route open, which is the right
    /// default for a public site and the wrong one for an application behind a login — there, a forgotten
    /// attribute silently publishes a page. Switching to <see cref="UIAuthorizationDefault.Authenticated"/>
    /// inverts that: the mistake closes a page instead, which is visible immediately.
    /// </remarks>
    public UIAuthorizationDefault DefaultPolicy { get; set; } = UIAuthorizationDefault.Anonymous;

    /// <summary>
    /// Gets or sets the route a refused request is sent to, when configured.
    /// </summary>
    /// <remarks>
    /// Without it an unauthorized route has nowhere to go and the whole render fails, which is never what an
    /// application behind a login wants. Set it through <c>UIApplicationBuilder.SignInView</c>, which also
    /// registers the route as anonymous — a sign-in page that requires a session cannot be reached.
    /// </remarks>
    public string? SignInRoute { get; set; }

    /// <summary>
    /// Gets or sets the route an authenticated but insufficiently privileged request is sent to, when configured.
    /// </summary>
    /// <remarks>
    /// Falls back to <see cref="SignInRoute"/> when unset, which is better than a failed render but still tells
    /// someone already signed in to sign in. Set it through <c>UIApplicationBuilder.ForbiddenView</c>.
    /// </remarks>
    public string? ForbiddenRoute { get; set; }

    /// <summary>
    /// Gets or sets where a session's identity comes from.
    /// </summary>
    /// <remarks>
    /// <see cref="UIIdentitySource.Session"/> means the application signs users in itself through
    /// <c>UIContext.SignInAsync</c> and any <c>ClaimsPrincipal</c> is ignored.
    /// <see cref="UIIdentitySource.Claims"/> makes the principal the authority in both directions: it grants
    /// identity, and losing it takes the identity away. The distinction has to be explicit, because "no
    /// authenticated principal" is indistinguishable between a host that signed the user out and a host that
    /// never used claims at all.
    /// </remarks>
    public UIIdentitySource IdentitySource { get; set; } = UIIdentitySource.Session;

    /// <summary>
    /// Gets or sets the claim type permissions are read from.
    /// </summary>
    /// <remarks>
    /// Roles need no equivalent: a <c>ClaimsIdentity</c> already declares its own <c>RoleClaimType</c>.
    /// </remarks>
    public string PermissionClaimType { get; set; } = "permission";
}
