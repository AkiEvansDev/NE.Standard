using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders the chrome every bordered surface shares: a container's style, then the surface's fill.</summary>
public static class SurfaceChromeRenderer
{
    public static void RenderChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);
    }
}
