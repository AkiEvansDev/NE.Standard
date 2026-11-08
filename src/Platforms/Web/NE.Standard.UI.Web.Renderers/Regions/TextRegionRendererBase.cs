using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Renderers.Contents;

namespace NE.Standard.UI.Web.Renderers.Regions;

/// <summary>A region that is a text body and nothing else: a card's or an expander's header, a tab's caption.</summary>
public abstract class TextRegionRendererBase : TextComponentRenderer
{
    /// <inheritdoc />
    protected sealed override bool IsReadingWords => false;

    /// <inheritdoc />
    protected sealed override UITextBadgePlacement DefaultBadgePlacement => UITextBadgePlacement.Trailing;
}
