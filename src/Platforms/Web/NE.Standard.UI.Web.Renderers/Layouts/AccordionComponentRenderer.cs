using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>A column of expanders; the "one open at a time" rule lives in the client engine, which matches on the class.</summary>
public sealed class AccordionComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => AccordionComponent.ComponentTypeKey;

    protected override string ClassName => "ui-accordion";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        RenderChildren(context, root);
    }
}
