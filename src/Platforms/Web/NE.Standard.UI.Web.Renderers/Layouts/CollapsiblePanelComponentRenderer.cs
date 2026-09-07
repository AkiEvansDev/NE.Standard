using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>A panel that folds: the collapsible chrome, then content in a band the stylesheet drops from the flow when collapsed.</summary>
public sealed class CollapsiblePanelComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => CollapsiblePanelComponent.ComponentTypeKey;

    protected override string ClassName => "ui-collapsible-panel";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root, includeOverflow: false);
        CollapsibleChromeRenderer.RenderCollapsible(context, root);

        if (!HasRegion(context, RegionNames.Content))
            return;

        _ = root.Element("div", content =>
        {
            _ = content.Class("ui-collapsible-panel__content").Class(CollapsibleChromeRenderer.ContentClassName);

            RenderRegion(context, content, RegionNames.Content);
        });
    }
}
