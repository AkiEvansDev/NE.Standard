using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a container's padding, background, border and overflow onto its root element.</summary>
public static class ContainerStyleRenderer
{
    public static void RenderContainerStyle(WebRenderContext context, IHtmlElementBuilder root, bool includeOverflow = true)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ISurfaceComponent.PaddingProperty, "--ui-padding");

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);
        SurfaceStyleRenderer.RenderBackgroundImage(context, root);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        if (includeOverflow)
            OverflowStyleRenderer.RenderOverflow(context, root);
    }
}
