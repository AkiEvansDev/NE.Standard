namespace DemoApp;

/// <summary>
/// The pictures this demo draws, named for what they are used as rather than for what they depict.
/// </summary>
/// <remarks>Every value here is one an <c>Icon</c> property accepts; the paths are site-relative, served from the host's <c>wwwroot</c>.</remarks>
public static class DemoImages
{
    /// <summary>A square photograph, 640×640.</summary>
    public const string Avatar = "/images/avatar.jpg";

    /// <summary>2048×1331, the widest of the photographs.</summary>
    public const string SunsetRuins = "/images/sunset-ruins.jpg";

    /// <summary>853×1280, the tallest of the photographs.</summary>
    public const string NightStreet = "/images/night-street.jpg";

    /// <summary>1080×727, landscape.</summary>
    public const string HarbourSky = "/images/harbour-sky.jpg";

    /// <summary>726×1024, portrait.</summary>
    public const string MeteorShore = "/images/meteor-shore.jpg";

    /// <summary>A colour mark as a vector, the way an application's own logo usually ships.</summary>
    public const string Logo = "/images/logo.svg";

    /// <summary>
    /// A monochrome vector written to be tinted; pass it through <see cref="Mask"/> to follow the text's colour.
    /// </summary>
    public const string Mark = "/images/mark.svg";

    /// <summary>The same colour mark inline, the other way a picture may be handed over.</summary>
    public const string InlineLogo = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3E%3Crect%20width='48'%20height='48'%20fill='%23232733'/%3E%3Cpath%20d='M24%209l14%208v14l-14%208-14-8V17z'%20fill='%23e2734b'/%3E%3Cpath%20d='M24%209l14%208-14%208-14-8z'%20fill='%23f0946f'/%3E%3C/svg%3E";

    /// <summary>The tinted form of a picture, painted in the text's colour rather than its own.</summary>
    public static string Mask(string source)
        => $"mask:{source}";

    /// <summary>The largest upload the demo shows back as a <c>data:</c> address; the picker says so too.</summary>
    public const long MaxInlinePictureBytes = 2 * 1024 * 1024;

    /// <summary>
    /// Whether an upload may be shown back inline: a raster picture, small. The type is what the browser declared, and an SVG is a
    /// document that can carry script, so it is not one.
    /// </summary>
    /// <remarks>
    /// Inline is a demo's shortcut: the address lives in the page's state and is sent again with every render and every attach. An
    /// application keeps the file and names it by a content address (<c>IUIContentProvider</c>).
    /// </remarks>
    public static bool IsInlinePicture(string? contentType, long size)
        => size <= MaxInlinePictureBytes && contentType is "image/png" or "image/jpeg" or "image/gif" or "image/webp";
}
