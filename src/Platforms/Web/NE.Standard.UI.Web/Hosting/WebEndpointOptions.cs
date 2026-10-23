namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures the framework's own endpoints: the ASP.NET authorization on the SignalR hub and the catch-all shell route, who may frame
/// a page, and how the files it serves answer a browser that opens them directly.
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
    /// Gets or sets whether content and an upload served back that run nothing — a PDF, a raster picture, plain text, audio, video —
    /// are shown in the page's own origin rather than sandboxed, so Chromium opens a PDF inline. Off by default. Whatever it says,
    /// HTML, XML, SVG and an unparsed type go sandboxed and as an attachment, and a type a page could run as bytes to save.
    /// </summary>
    public bool InlinePassiveContent { get; set; }

    /// <summary>
    /// Gets or sets whether a page may be framed only by the sources <see cref="FrameAncestors"/> names. On by default, so a sibling
    /// site cannot frame a signed-in page and steer the reader's presses; off sends nothing, leaving framing to the host's own headers.
    /// </summary>
    /// <remarks>A request for a page as a frame its rule refuses is answered <c>404</c>, its controller never asked.</remarks>
    public bool RestrictFraming { get; set; } = true;

    /// <summary>
    /// Gets or sets who may frame a page, as a <c>Content-Security-Policy</c> <c>frame-ancestors</c> list — <c>'self'
    /// https://partner.example</c>; unset, the page's own origin, sent as <c>X-Frame-Options: SAMEORIGIN</c> too for a browser that
    /// predates the directive.
    /// </summary>
    public string? FrameAncestors { get; set; }

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
