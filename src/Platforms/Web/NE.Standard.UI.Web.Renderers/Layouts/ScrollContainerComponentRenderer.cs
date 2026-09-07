using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
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

        _ = RenderProperty<UIScrollMode?>(context, root, ScrollContainerComponent.HorizontalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scroll)
                _ = target.Class(WebClassNames.ScrollX(scroll));
        }, [WebDomOperation.Class(converter: WebDomConverters.ScrollXClass)]);

        _ = RenderProperty<UIScrollMode?>(context, root, ScrollContainerComponent.VerticalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scroll)
                _ = target.Class(WebClassNames.ScrollY(scroll));
        }, [WebDomOperation.Class(converter: WebDomConverters.ScrollYClass)]);

        _ = RenderProperty<UIScrollSnapMode?>(context, root, ScrollContainerComponent.ScrollSnapProperty, static (target, value) =>
        {
            if (value is UIScrollSnapMode scrollSnap)
                _ = target.Class(WebClassNames.ScrollSnap(scrollSnap));
        }, [WebDomOperation.Class(converter: WebDomConverters.ScrollSnapClass)]);

        // The enum name, not a lowercased form: a patched value arrives as the name and must read the same.
        _ = RenderProperty<UIScrollAnchor?>(context, root, ScrollContainerComponent.ScrollAnchorProperty, static (target, value) =>
        {
            if (value is UIScrollAnchor anchor)
                _ = target.Attribute(WebAttributes.ScrollAnchor, anchor.ToString());
        }, [WebDomOperation.Attribute(WebAttributes.ScrollAnchor)]);

        RenderChildren(context, root);
    }
}
