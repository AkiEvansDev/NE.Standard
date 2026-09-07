using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>The shared text body plus the wrap and max-lines properties that let a paragraph run.</summary>
public sealed class ParagraphComponentRenderer : TextContentRendererBase
{
    public override string ComponentTypeKey => ParagraphComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-paragraph");

        RenderTooltip(context, root);
        RenderParagraphFlow(context, root, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = UITextBadgePlacement.Inline
        });
    }
}
