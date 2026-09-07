using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Writes <c>SelectionStyle</c> as the four custom properties the <c>selected</c> mixins read.</summary>
public static class SelectionStyleRenderer
{
    public const string BackgroundVariable = "--ui-selected-background";
    public const string ForegroundVariable = "--ui-selected-foreground";
    public const string MarkColorVariable = "--ui-selected-mark-color";
    public const string MarkVariable = "--ui-selected-mark";
    public const string FontWeightVariable = "--ui-selected-font-weight";

    public static void RenderSelectionStyle(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UISelectionStyle?>(context, root, ISelectionStyleComponent.SelectionStyleProperty, static (target, value) =>
        {
            if (value is not UISelectionStyle style)
                return;

            if (style.Background is UIThemeColor background)
                _ = target.Style(BackgroundVariable, WebCssValues.ThemeColor(background));

            if (style.Foreground is UIThemeColor foreground)
                _ = target.Style(ForegroundVariable, WebCssValues.ThemeColor(foreground));

            if (style.MarkColor is UIThemeColor markColor)
                _ = target.Style(MarkColorVariable, WebCssValues.ThemeColor(markColor));

            if (style.Mark is UISelectionMark mark)
                _ = target.Style(MarkVariable, WebCssValues.SelectionMark(mark));

            if (style.Bold is bool bold)
                _ = target.Style(FontWeightVariable, WebCssValues.SelectionFontWeight(bold));
        }, [
            WebDomOperation.Style(BackgroundVariable, converter: WebDomConverters.SelectionBackgroundCss),
            WebDomOperation.Style(ForegroundVariable, converter: WebDomConverters.SelectionForegroundCss),
            WebDomOperation.Style(MarkColorVariable, converter: WebDomConverters.SelectionMarkColorCss),
            WebDomOperation.Style(MarkVariable, converter: WebDomConverters.SelectionMarkCss),
            WebDomOperation.Style(FontWeightVariable, converter: WebDomConverters.SelectionFontWeightCss)
        ]);
    }
}
