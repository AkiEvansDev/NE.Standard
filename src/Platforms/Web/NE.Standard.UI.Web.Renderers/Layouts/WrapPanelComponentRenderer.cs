using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class WrapPanelComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => WrapPanelComponent.ComponentTypeKey;

    protected override string ClassName => "ui-wrap-panel";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, WrapPanelComponent.HorizontalGapProperty, "--ui-wrap-panel-horizontal-gap");
        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, WrapPanelComponent.VerticalGapProperty, "--ui-wrap-panel-vertical-gap");

        RenderChildren(context, root);
    }
}
