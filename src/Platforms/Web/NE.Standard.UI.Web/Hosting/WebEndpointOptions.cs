namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures the ASP.NET authorization applied to the framework's own two endpoints — the SignalR hub and
/// the catch-all shell route.
/// </summary>
/// <remarks>
/// Off by default, because an anonymous route has to keep working without a host identity: the framework's
/// own access rules run per route and per command, and they are the ones that know about
/// <c>[UIAllowAnonymous]</c>. This is the outer gate for an application that is entirely behind a login —
/// turning it on means the host's authentication must run before any page is served, and a request without
/// an identity never reaches view resolution at all.
/// </remarks>
public sealed class WebEndpointOptions
{
    /// <summary>
    /// Gets or sets whether the hub and the shell route require an authorized request.
    /// </summary>
    public bool RequireAuthorization { get; set; }

    /// <summary>
    /// Gets or sets the authorization policy name to require; the default policy when unset.
    /// </summary>
    public string? AuthorizationPolicy { get; set; }
}
