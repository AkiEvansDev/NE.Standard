using System;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Regions;

/// <summary>A region that is a text body and nothing else: a card's or an expander's header, a tab's caption.</summary>
public abstract class TextRegionRendererBase : TextContentRendererBase
{
    /// <summary>What the region's owner keeps in step with whether the text shows anything (<see cref="WebTextBodyOptions.PartsShownOperation"/>).</summary>
    protected virtual WebDomOperation? PartsShownOperation => null;

    protected sealed override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);
        RenderTextWrap(context, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = UITextBadgePlacement.Trailing,
            PartsShownOperation = PartsShownOperation
        });
    }
}
