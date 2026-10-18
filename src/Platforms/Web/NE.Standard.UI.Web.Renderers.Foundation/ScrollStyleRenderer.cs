using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders the <see cref="IScrollableComponent"/> block — both scroll modes and the snap as classes, the anchor as an attribute — onto
/// the element that scrolls: the root, or an element inside it that the operations' selector names.
/// </summary>
public static class ScrollStyleRenderer
{
    private static readonly WebDomOperation[] XOperations = [WebDomOperation.Class(converter: WebDomConverters.ScrollXClass)];
    private static readonly WebDomOperation[] YOperations = [WebDomOperation.Class(converter: WebDomConverters.ScrollYClass)];
    private static readonly WebDomOperation[] SnapOperations = [WebDomOperation.Class(converter: WebDomConverters.ScrollSnapClass)];
    private static readonly WebDomOperation[] AnchorOperations = [WebDomOperation.Attribute(WebAttributes.ScrollAnchor)];

    /// <summary>Onto the component's root, which scrolls itself.</summary>
    public static void RenderScroll(WebRenderContext context, IHtmlElementBuilder root)
        => RenderScroll(context, root, XOperations, YOperations, SnapOperations, AnchorOperations);

    /// <summary>Onto an element inside the root, each property's patch aimed by its own operations.</summary>
    public static void RenderScroll(WebRenderContext context, IHtmlElementBuilder target, WebDomOperation[] horizontal, WebDomOperation[] vertical, WebDomOperation[] snap, WebDomOperation[] anchor)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIScrollMode?>(context, target, IScrollableComponent.HorizontalScrollProperty, static (element, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = element.Class(WebClassNames.ScrollX(scrollMode));
        }, horizontal);

        _ = WebComponentRendererBase.RenderProperty<UIScrollMode?>(context, target, IScrollableComponent.VerticalScrollProperty, static (element, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = element.Class(WebClassNames.ScrollY(scrollMode));
        }, vertical);

        _ = WebComponentRendererBase.RenderProperty<UIScrollSnapMode?>(context, target, IScrollableComponent.ScrollSnapProperty, static (element, value) =>
        {
            if (value is UIScrollSnapMode scrollSnap)
                _ = element.Class(WebClassNames.ScrollSnap(scrollSnap));
        }, snap);

        // The enum name, not a lowercased form: a patched value arrives as the name and is compared against it.
        _ = WebComponentRendererBase.RenderProperty<UIScrollAnchor?>(context, target, IScrollableComponent.ScrollAnchorProperty, static (element, value) =>
        {
            if (value is UIScrollAnchor anchor)
                _ = element.Attribute(WebAttributes.ScrollAnchor, anchor.ToString());
        }, anchor);
    }
}
