using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public class TextComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => TextComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Reading words: the reader may select them where they stand on the page, not in a row, a menu or a control.
        _ = root.Class(WebClassNames.ContentText);

        RenderTooltip(context, root);
        RenderTextWrap(context, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = UITextBadgePlacement.Inline
        });
    }
}
