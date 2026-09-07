using System;
using System.Collections.Generic;
using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Writes the runs <see cref="UIInlineMarkup"/> parses out of a description or a tooltip.</summary>
public static class InlineMarkupRenderer
{
    private const string FoldClass = "ui-text__fold";
    private const string FoldToggleClass = "ui-text__fold-toggle";
    private const string FoldContentClass = "ui-text__fold-content";

    /// <summary>Replaces the target's content with the parsed text, writing plain runs as text.</summary>
    public static void Render(IHtmlBuilder target, string? text)
    {
        ArgumentNullException.ThrowIfNull(target);

        IReadOnlyList<UIInlineSegment> segments = UIInlineMarkup.Parse(text);

        for (var i = 0; i < segments.Count; i++)
            RenderSegment(target, segments[i]);
    }

    private static void RenderSegment(IHtmlBuilder target, UIInlineSegment segment)
    {
        if (segment.IsPlain)
        {
            _ = target.Text(segment.Text);
            return;
        }

        // A mark carries no words, so it takes neither the styles nor the link around it.
        if (segment.Icon is { Length: > 0 } icon)
        {
            RenderIcon(target, icon);
            return;
        }

        if (segment.Url is { Length: > 0 } url)
        {
            _ = target.Element("a", anchor =>
            {
                _ = anchor.Class("ui-text__link");
                _ = anchor.Attribute("href", url);

                // A link out of the app opens in its own tab and never with a handle back to this one.
                if (IsExternalUrl(url))
                {
                    _ = anchor.Attribute("target", "_blank");
                    _ = anchor.Attribute("rel", "noopener noreferrer");
                }

                RenderStyles(anchor, segment);
            });

            return;
        }

        RenderStyles(target, segment);
    }

    /// <summary>Wraps the segment outermost first: bold, italic, underline, strikethrough, then code closest to the text.</summary>
    private static void RenderStyles(IHtmlBuilder target, UIInlineSegment segment)
    {
        if (segment.Styles.HasFlag(UIInlineStyles.Bold))
        {
            _ = target.Element("strong", element => RenderStyles(element, segment with { Styles = segment.Styles & ~UIInlineStyles.Bold }));
            return;
        }

        if (segment.Styles.HasFlag(UIInlineStyles.Italic))
        {
            _ = target.Element("em", element => RenderStyles(element, segment with { Styles = segment.Styles & ~UIInlineStyles.Italic }));
            return;
        }

        if (segment.Styles.HasFlag(UIInlineStyles.Underline))
        {
            _ = target.Element("u", element => RenderStyles(element, segment with { Styles = segment.Styles & ~UIInlineStyles.Underline }));
            return;
        }

        if (segment.Styles.HasFlag(UIInlineStyles.Strikethrough))
        {
            _ = target.Element("s", element => RenderStyles(element, segment with { Styles = segment.Styles & ~UIInlineStyles.Strikethrough }));
            return;
        }

        if (segment.Styles.HasFlag(UIInlineStyles.Code))
        {
            _ = target.Element("code", element =>
            {
                _ = element.Class("ui-text__code");
                RenderStyles(element, segment with { Styles = segment.Styles & ~UIInlineStyles.Code });
            });

            return;
        }

        if (segment.IsFold)
        {
            RenderFold(target, segment);
            return;
        }

        _ = target.Text(segment.Text);
    }

    /// <summary>
    /// A fold is its caption as a button and its text after it, folded until the button is pressed; the text is markup of its own.
    /// </summary>
    private static void RenderFold(IHtmlBuilder target, UIInlineSegment segment)
        => target.Element("span", fold =>
        {
            _ = fold.Class(FoldClass);

            _ = fold.Element("button", toggle =>
            {
                _ = toggle.Class(FoldToggleClass);
                _ = toggle.Attribute("type", "button");
                _ = toggle.Attribute("aria-expanded", "false");
                // A press unfolds the sentence and nothing else — never the click of the card or the row the sentence sits in.
                _ = toggle.Attribute(WebAttributes.EventBoundary);
                _ = toggle.Text(segment.Fold!);
            });

            _ = fold.Element("span", content =>
            {
                _ = content.Class(FoldContentClass);
                Render(content, segment.Text);
            });
        });

    /// <summary>Renders an inline glyph through the same element and value pipeline an <c>Icon</c> property uses.</summary>
    private static void RenderIcon(IHtmlBuilder target, string icon)
        => target.Element("i", element =>
        {
            _ = element.Class("ui-icon");
            _ = element.Class("ui-text__icon-inline");
            // `.ui-icon::before` stays hidden until this says there is a glyph to draw.
            _ = element.Attribute(WebAttributes.Icon);
            _ = element.Attribute("aria-hidden", "true");

            IconValueRenderer.RenderIconValue(element, icon);
        });

    private static bool IsExternalUrl(string url)
        => url.StartsWith("http:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith("https:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase)
        || url.StartsWith("tel:", StringComparison.OrdinalIgnoreCase);
}
