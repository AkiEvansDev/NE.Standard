using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public class TextComponentRenderer : TextContentRendererBase
{
    private static readonly WebDomOperation[] RenamableOperations =
    [
        WebDomOperation.ToggleAttribute(WebAttributes.TextRenamable, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute(WebAttributes.NoRowOpen, condition: WebValueCondition.IsTrue),
        WebDomOperation.ToggleAttribute("tabindex", condition: WebValueCondition.IsTrue, value: "0")
    ];

    private static readonly WebDomOperation[] RenamedTitleOperations = [WebDomOperation.Attribute(WebAttributes.TextRenamedTitle, converter: WebDomConverters.NonBlankText)];

    public override string ComponentTypeKey => TextComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.Text;

    /// <summary>Whether the component is reading words on the page rather than a control's or a section's header.</summary>
    protected virtual bool IsReadingWords => true;

    /// <summary>Where the text's badge stands when the component does not set <c>BadgePlacement</c>.</summary>
    protected virtual UITextBadgePlacement DefaultBadgePlacement => UITextBadgePlacement.Inline;

    /// <summary>What the region's owner keeps in step with whether the text shows anything (<see cref="WebTextBodyOptions.PartsShownOperation"/>).</summary>
    protected virtual WebDomOperation? PartsShownOperation => null;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // Reading words: the reader may select them where they stand on the page, not in a row, a menu or a control.
        if (IsReadingWords)
            _ = root.Class(WebClassNames.ContentText);

        RenderTooltip(context, root);
        RenderTextWrap(context, root);
        RenderRename(context, root);

        RenderTextBody(context, root, root, new WebTextBodyOptions
        {
            IncludeTextLayout = true,
            DefaultBadgePlacement = DefaultBadgePlacement,
            PartsShownOperation = PartsShownOperation
        });
    }

    private static void RenderRename(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = RenderProperty<bool?>(context, root, TextComponent.RenamableProperty, static (element, renamable) =>
        {
            if (renamable == true)
            {
                _ = element
                    .Attribute(WebAttributes.TextRenamable, string.Empty)
                    .Attribute(WebAttributes.NoRowOpen, string.Empty)
                    .Attribute("tabindex", "0");
            }
        }, RenamableOperations);

        _ = ResolveRenderValue(context, IRenamableComponent.RenamedTitleProperty, out string? renamedTitle, out CompiledUIBinding? binding);

        if (!string.IsNullOrWhiteSpace(renamedTitle)
            || binding is not null
            || context.Metadata.IsExposed(new UIPropertyAddress(context.Node.ComponentId, IRenamableComponent.RenamedTitleProperty)))
        {
            _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TextTitle);
            _ = RenderProperty<string?>(context, root, IRenamableComponent.RenamedTitleProperty, static (element, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                    _ = element.Attribute(WebAttributes.TextRenamedTitle, value);
            }, RenamedTitleOperations);
        }
    }
}
