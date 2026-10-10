using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>The shared text body plus the wrap and max-lines properties that let a paragraph run.</summary>
public sealed class ParagraphComponentRenderer : TextContentRendererBase
{
    /// <summary>A paragraph that is the note under the field before it (<c>FieldNote</c>).</summary>
    public const string FieldNoteClassName = "ui-paragraph--field-note";

    public override string ComponentTypeKey => ParagraphComponent.ComponentTypeKey;

    protected override string ClassName => "ui-text";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-paragraph");
        _ = root.Class(WebClassNames.ContentText);

        // Render-time only: set back by the field before it (ui-input.less), as the field's message is.
        _ = ResolveRenderValue(context, ParagraphComponent.FieldNoteProperty, out bool? note, out _);

        if (note == true)
            _ = root.Class(FieldNoteClassName);

        RenderTooltip(context, root);
        RenderParagraphFlow(context, root, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = UITextBadgePlacement.Inline
        });
    }
}
