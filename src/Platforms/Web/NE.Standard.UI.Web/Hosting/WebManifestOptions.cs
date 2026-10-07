using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>The web app manifest the shell links: what the browser shows the application as, installed.</summary>
public sealed class WebManifestOptions
{
    /// <summary>Gets or sets the application's name.</summary>
    public required string Name { get; set; }

    /// <summary>Gets or sets the name shown where the full one does not fit — under an icon; the full name where unset.</summary>
    public string? ShortName { get; set; }

    /// <summary>Gets or sets what the application is for, in a sentence.</summary>
    public string? Description { get; set; }

    /// <summary>Gets or sets the address the installed application opens at, a path of this site.</summary>
    public string StartAddress { get; set; } = "/";

    /// <summary>Gets or sets how the installed application is drawn; a window of its own by default, which an iPhone asks for.</summary>
    public WebManifestDisplay Display { get; set; } = WebManifestDisplay.Standalone;

    /// <summary>Gets or sets the colour the system draws around the application — its title bar — as a CSS colour.</summary>
    public string? ThemeColor { get; set; }

    /// <summary>Gets or sets the colour shown while the application opens, as a CSS colour.</summary>
    public string? BackgroundColor { get; set; }

    /// <summary>Gets the application's icons, each at its own size.</summary>
    public IList<WebManifestIcon> Icons { get; } = [];

    /// <summary>Validates the manifest.</summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Name);
        ArgumentException.ThrowIfNullOrWhiteSpace(StartAddress);

        if (!StartAddress.StartsWith('/') || StartAddress.StartsWith("//", StringComparison.Ordinal))
            throw new InvalidOperationException($"The manifest's start address '{StartAddress}' is not a path of this site.");

        foreach (WebManifestIcon icon in Icons)
            icon.Validate();
    }
}

/// <summary>How an installed application is drawn.</summary>
public enum WebManifestDisplay
{
    /// <summary>A window of its own, without the browser's address bar.</summary>
    Standalone,

    /// <summary>The whole screen.</summary>
    Fullscreen,

    /// <summary>A window of its own with the least of the browser's controls.</summary>
    MinimalUi,

    /// <summary>A browser tab, as the site is.</summary>
    Browser
}

/// <summary>One of an installed application's icons.</summary>
public sealed class WebManifestIcon
{
    /// <summary>Gets or sets the icon's address, a path of this site.</summary>
    public required string Source { get; set; }

    /// <summary>Gets or sets the sizes it is drawn for, as the manifest writes them: <c>192x192</c>, <c>512x512</c>, <c>any</c>.</summary>
    public required string Sizes { get; set; }

    /// <summary>Gets or sets its media type: <c>image/png</c>, <c>image/svg+xml</c>.</summary>
    public string? Type { get; set; }

    /// <summary>Gets or sets what it is for: <c>maskable</c>, <c>monochrome</c>; any use where unset.</summary>
    public string? Purpose { get; set; }

    /// <summary>Validates the icon.</summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Source);
        ArgumentException.ThrowIfNullOrWhiteSpace(Sizes);
    }
}
