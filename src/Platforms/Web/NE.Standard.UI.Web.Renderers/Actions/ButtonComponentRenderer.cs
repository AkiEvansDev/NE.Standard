using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Actions;

public sealed class ButtonComponentRenderer : ButtonRendererBase
{
    public override string ComponentTypeKey => ButtonComponent.ComponentTypeKey;

    protected override string ClassName => "ui-button";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderButtonChrome(context, root);
        RenderRegion(context, root, RegionNames.Content);
    }
}
