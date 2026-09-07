namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures the ASP.NET authorization applied to the framework's own two endpoints — the SignalR hub and the catch-all shell route.
/// </summary>
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
