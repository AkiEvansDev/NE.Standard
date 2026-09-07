using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

public sealed class WebShellContext
{
    public required UIThemeMode? ThemeMode { get; init; }

    public required UITheme Theme { get; init; }

    public required IReadOnlyList<WebAssetDescriptor> Assets { get; init; }

    public string Language { get; init; } = "en";

    public string RootElementId { get; init; } = "ui-root";

    public string Content { get; init; } = string.Empty;

    /// <summary>
    /// Gets the corner this page's notifications stack in.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;

    /// <summary>
    /// Gets whether the root keeps the viewport's height and only the content region scrolls.
    /// </summary>
    public bool ScrollContentOnly { get; init; }

    public WebRenderMetadata? Metadata { get; init; }

    public string? MetadataJson { get; init; }

    /// <summary>
    /// Gets the framework's own words resolved for <see cref="Language"/>, for the client to write where it draws chrome itself — see <see cref="UIStrings"/>.
    /// </summary>
    public IReadOnlyDictionary<string, string>? Strings { get; init; }

    /// <summary>
    /// Gets the values this page was rendered with, for the client to apply before its first paint — see <see cref="WebHydration"/>.
    /// </summary>
    public string? HydrationJson { get; init; }
}
