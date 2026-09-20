using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders <see cref="IOverflowComponent"/>'s Overflow as an inline style.</summary>
/// <remarks><c>ScrollContainer</c> must not call this: it decides its own overflow, which this default would clobber.</remarks>
public static class OverflowStyleRenderer
{
    public static void RenderOverflow(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UIOverflow?>(context, root, IOverflowComponent.OverflowProperty, static (target, value) =>
        {
            if (value is not UIOverflow overflow)
                return;

            // Clips at the padding box, not the content box; the content box crops text descenders since a line's ink exceeds its box height.
            _ = target.Style("overflow", WebCssValues.Overflow(overflow));
        }, [WebDomOperation.Style("overflow", converter: WebDomConverters.OverflowCss)]);
    }
}
