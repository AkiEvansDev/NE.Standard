using System;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// The markup the flyout engine opens and places — for the flyout component, and for a package renderer that wraps a flyout
/// around parts of its own, which it cannot compose from the component at render time.
/// </summary>
public static class FlyoutRenderer
{
    /// <summary>The flyout's root class, which the engine finds it by.</summary>
    public const string ClassName = "ui-flyout";

    /// <summary>Draws a closed flyout under <paramref name="parent"/>: an anchor and a content panel, each filled by the caller.</summary>
    public static void RenderFlyout(IHtmlElementBuilder parent, UIPopupPlacement placement, Action<IHtmlElementBuilder> renderAnchor, Action<IHtmlElementBuilder> renderContent)
    {
        ArgumentNullException.ThrowIfNull(parent);
        ArgumentNullException.ThrowIfNull(renderAnchor);
        ArgumentNullException.ThrowIfNull(renderContent);

        _ = parent.Element("div", flyout =>
        {
            _ = flyout.Class($"{ClassName} {WebClassNames.FlyoutPlacement(placement)}");

            RenderAnchor(flyout, renderAnchor);
            RenderContent(flyout, renderContent);
        });
    }

    /// <summary>The part the flyout opens from.</summary>
    public static void RenderAnchor(IHtmlElementBuilder flyout, Action<IHtmlElementBuilder> render)
    {
        ArgumentNullException.ThrowIfNull(flyout);
        ArgumentNullException.ThrowIfNull(render);

        _ = flyout.Element("div", anchor =>
        {
            _ = anchor.Class("ui-flyout__anchor");
            render(anchor);
        });
    }

    /// <summary>The panel the flyout shows: a dialog that can take focus without being a tab stop.</summary>
    public static void RenderContent(IHtmlElementBuilder flyout, Action<IHtmlElementBuilder> render)
    {
        ArgumentNullException.ThrowIfNull(flyout);
        ArgumentNullException.ThrowIfNull(render);

        _ = flyout.Element("div", content =>
        {
            _ = content.Class(WebClassNames.FlyoutContent);
            _ = content.Attribute("role", "dialog");

            // Focusable without being a tab stop, so an opened flyout has somewhere to put focus.
            _ = content.Attribute("tabindex", "-1");

            render(content);
        });
    }
}
