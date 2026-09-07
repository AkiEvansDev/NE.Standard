using System;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>The items view's default row: a text component that also carries the row's abilities.</summary>
public sealed class DefaultTextTemplateRenderer : TextComponentRenderer
{
    public override string ComponentTypeKey => DefaultTextTemplate.ComponentTypeKey;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        base.RenderComponent(context, root);
        ItemAbilitiesRenderer.RenderItemAbilities(context, root);
    }
}
