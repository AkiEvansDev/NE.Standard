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

            _ = target.Style("overflow", WebCssValues.Overflow(overflow));

            // Inert unless the overflow above resolves to `clip`, so it needs no operation of its own.
            _ = target.Style("overflow-clip-margin", "content-box");
        }, [WebDomOperation.Style("overflow", converter: WebDomConverters.OverflowCss)]);
    }
}
