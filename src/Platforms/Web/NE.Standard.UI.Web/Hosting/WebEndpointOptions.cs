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

    /// <summary>
    /// Gets or sets the page's icon: the <c>href</c> of the shell's <c>link rel="icon"</c> — an absolute path under the application's
    /// static files, or a <c>data:</c> URL. Unset, the shell names an empty icon, so a browser asks for no <c>/favicon.ico</c>.
    /// </summary>
    public string? Icon { get; set; }

    /// <summary>
    /// Gets how a system notification reaches a phone, whose browser shows none a page raised itself: through the framework's own
    /// service worker, or one the application's worker imports. Set by <c>AddSystemNotifications</c>; off by default, when a page
    /// shows them itself, on a desktop only.
    /// </summary>
    public WebServiceWorkerMode ServiceWorker { get; internal set; }

    /// <summary>
    /// Gets or sets the web app manifest the shell links (<c>/_ne/manifest.webmanifest</c>), which lets the reader install the
    /// application — the only way an iPhone shows a page's notifications; none by default.
    /// </summary>
    public WebManifestOptions? Manifest { get; set; }
}
