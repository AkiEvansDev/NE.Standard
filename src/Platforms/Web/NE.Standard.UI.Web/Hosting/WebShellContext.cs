using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

public sealed class WebShellContext
{
    public required UIThemeMode? ThemeMode { get; init; }

    public required UITheme Theme { get; init; }

    /// <summary>Gets the reader's own colours over <see cref="Theme"/>'s palettes, or none for the application's.</summary>
    public UIThemeColors? ThemeColors { get; init; }

    /// <summary>
    /// Gets the assets the shell links, in the order it links them — by <see cref="WebAssetDescriptor.Order"/>, then key, as
    /// <see cref="IWebAssetRegistry.Assets"/> holds them, sorted once rather than on every page.
    /// </summary>
    public required IReadOnlyList<WebAssetDescriptor> Assets { get; init; }

    public string Language { get; init; } = "en";

    /// <summary>Gets the document's title — the view's, translated for the page's language — or none.</summary>
    public string? Title { get; init; }

    /// <summary>Gets the <c>href</c> of the page's icon (<see cref="WebEndpointOptions.Icon"/>), or none for an empty one.</summary>
    public string? Icon { get; init; }

    /// <summary>Gets how the page reaches the framework's service worker (<see cref="WebEndpointOptions.ServiceWorker"/>).</summary>
    public WebServiceWorkerMode ServiceWorker { get; init; }

    /// <summary>Gets whether the shell links the application's manifest (<see cref="WebEndpointOptions.Manifest"/>).</summary>
    public bool HasManifest { get; init; }

    public string RootElementId { get; init; } = "ui-root";

    /// <summary>
    /// Gets the page's own markup, written into the document where it stands — a render's tree, never copied into a string first.
    /// </summary>
    public IHtmlContent? Content { get; init; }

    /// <summary>
    /// Gets the <c>FormId</c>s the page's fields name, each written as a hidden form of the browser's own beside the root, so a
    /// password manager and autofill read each form apart (<see cref="WebForms"/>).
    /// </summary>
    public IReadOnlyList<string> FormIds { get; init; } = [];

    /// <summary>
    /// Gets the corner this page's notifications stack in.
    /// </summary>
    public UINotificationPlacement NotificationPlacement { get; init; } = UINotificationPlacement.Bottom;

    /// <summary>
    /// Gets the width, in pixels, this page's notifications take.
    /// </summary>
    public double NotificationWidth { get; init; } = UIViewOptions.Default.NotificationWidth;

    /// <summary>
    /// Gets whether the root keeps the viewport's height and only the content region scrolls.
    /// </summary>
    public bool ScrollContentOnly { get; init; }

    /// <summary>
    /// Gets which regions run the page's full length.
    /// </summary>
    public UIShellLayout ShellLayout { get; init; }

    /// <summary>
    /// Gets whether the sides slide over the content as drawers on a narrow screen; on by default, as in <c>UIViewOptions</c>.
    /// </summary>
    public bool SideDrawers { get; init; } = true;

    public WebRenderMetadata? Metadata { get; init; }

    public string? MetadataJson { get; init; }

    /// <summary>
    /// Gets the framework's own words resolved for <see cref="Language"/>, for the client to write where it draws chrome itself — see <see cref="UIStrings"/>.
    /// </summary>
    public IReadOnlyDictionary<string, string>? Strings { get; init; }

    /// <summary>
    /// Gets <see cref="Strings"/> already serialized, as <see cref="WebShellRenderer.SerializeStrings"/> writes them; set, it is
    /// used instead, so a host keeps one per language rather than serializing them on every page.
    /// </summary>
    public string? StringsJson { get; init; }

    /// <summary>
    /// Gets the values this page was rendered with, for the client to apply before its first paint — see <see cref="WebHydration"/>.
    /// </summary>
    public string? HydrationJson { get; init; }

    /// <summary>
    /// Gets the navigation the page was rendered for when it stands in for the one asked for — a sign-in, not-found or error
    /// page shown at the address that led there; null on a page that is what was asked for.
    /// </summary>
    public UINavigationRequest? StandInNavigation { get; init; }
}
