using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders the chrome every bordered surface shares: padding, background, edge, overflow and fill.</summary>
public static class SurfaceChromeRenderer
{
    public static void RenderChrome(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ISurfaceComponent.PaddingProperty, WebResponsiveCss.PaddingVariable);

        SurfaceStyleRenderer.RenderBackground(context, root, ISurfaceComponent.BackgroundProperty);
        SurfaceStyleRenderer.RenderBackgroundImage(context, root);

        BorderStyleRenderer.RenderBorderStyle(context, root);
        OverflowStyleRenderer.RenderOverflow(context, root);

        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);
    }
}
