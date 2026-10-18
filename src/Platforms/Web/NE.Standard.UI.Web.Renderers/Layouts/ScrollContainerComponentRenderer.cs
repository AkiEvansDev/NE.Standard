using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class ScrollContainerComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => ScrollContainerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-scroll";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root, includeOverflow: false);

        ScrollStyleRenderer.RenderScroll(context, root);

        RenderChildren(context, root);
    }
}
