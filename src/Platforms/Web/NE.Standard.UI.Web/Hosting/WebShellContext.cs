using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

public sealed class WebShellContext
{
    public required UIThemeMode ThemeMode { get; init; }

    public required UITheme Theme { get; init; }

    public required IReadOnlyList<WebAssetDescriptor> Assets { get; init; }

    public string Language { get; init; } = "en";

    public string RootElementId { get; init; } = "ui-root";

    public string Content { get; init; } = string.Empty;

    /// <summary>
    /// Gets the corner this page's notifications stack in. On the shell because the host is built on demand
    /// under <c>&lt;body&gt;</c> and belongs to no region.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;

    public WebRenderMetadata? Metadata { get; init; }

    public string? MetadataJson { get; init; }
}
