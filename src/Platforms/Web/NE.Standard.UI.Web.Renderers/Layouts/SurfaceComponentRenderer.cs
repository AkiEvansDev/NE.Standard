using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class SurfaceComponentRenderer : SurfaceRendererBase
{
    public override string ComponentTypeKey => SurfaceComponent.ComponentTypeKey;

    protected override string ClassName => "ui-surface";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderSurface(context, root);

        // Straight onto the root, no wrapper: a plain surface has one region and nothing to separate it from.
        if (HasRegion(context, RegionNames.Content))
            RenderRegion(context, root, RegionNames.Content);
    }
}
