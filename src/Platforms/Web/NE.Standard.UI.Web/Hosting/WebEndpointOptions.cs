namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures the framework's own endpoints: the ASP.NET authorization on the SignalR hub and the catch-all shell route, and
/// how the files it serves answer a browser that opens them directly.
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

    /// <summary>
    /// Gets or sets whether content and downloads are served inert: a <c>Content-Security-Policy</c> that runs nothing, and a
    /// type a browser would render as a document (HTML, XML, SVG) sent as an attachment. On by default; an application that
    /// deliberately serves active content turns it off.
    /// </summary>
    public bool InertContent { get; set; } = true;
}
