using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a container's padding, background, border and overflow onto its root element.</summary>
public static class ContainerStyleRenderer
{
    /// <remarks>
    /// The padding yields to the overlay bar's room wherever the box keeps it — a container that scrolls, a region's root (one form for
    /// every container: a patch registers one per type).
    /// </remarks>
    public static void RenderContainerStyle(WebRenderContext context, IHtmlElementBuilder root, bool includeOverflow = true)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsivePadding(context, root, ISurfaceComponent.PaddingProperty, WebResponsiveCss.PaddingVariable);

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);
        SurfaceStyleRenderer.RenderBackgroundImage(context, root);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        if (includeOverflow)
            OverflowStyleRenderer.RenderOverflow(context, root);
    }
}
