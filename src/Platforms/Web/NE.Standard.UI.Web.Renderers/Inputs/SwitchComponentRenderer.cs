using System;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Inputs;

public sealed class SwitchComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => SwitchComponent.ComponentTypeKey;

    protected override string ElementName => "label";

    protected override string ClassName => "ui-switch";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        CheckboxComponentRenderer.RenderCheckable(context, root, ClassName);
    }
}
