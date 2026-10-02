using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Writes <c>SelectionStyle</c> as the six custom properties the <c>selected</c> mixins read.</summary>
public static class SelectionStyleRenderer
{
    public const string BackgroundVariable = "--ui-selected-background";
    public const string ForegroundVariable = "--ui-selected-foreground";
    public const string MarkColorVariable = "--ui-selected-mark-color";
    public const string MarkVariable = "--ui-selected-mark";
    public const string FontWeightVariable = "--ui-selected-font-weight";
    public const string ActionBarBackgroundVariable = "--ui-selected-bar-ground";

    private static readonly WebDomOperation[] Operations =
    [
        WebDomOperation.Style(BackgroundVariable, converter: WebDomConverters.SelectionBackgroundCss),
        WebDomOperation.Style(ForegroundVariable, converter: WebDomConverters.SelectionForegroundCss),
        WebDomOperation.Style(MarkColorVariable, converter: WebDomConverters.SelectionMarkColorCss),
        WebDomOperation.Style(MarkVariable, converter: WebDomConverters.SelectionMarkCss),
        WebDomOperation.Style(FontWeightVariable, converter: WebDomConverters.SelectionFontWeightCss),
        WebDomOperation.Style(ActionBarBackgroundVariable, converter: WebDomConverters.SelectionActionBarBackgroundCss)
    ];

    public static void RenderSelectionStyle(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = WebComponentRendererBase.RenderProperty<UISelectionStyle?>(context, root, ISelectionStyleComponent.SelectionStyleProperty, static (target, value) =>
        {
            if (value is not UISelectionStyle style)
                return;

            // A style colour with no variable of its own (Default, Muted) is written as nothing, as the client's converter answers.
            if (style.Background is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } backgroundCss)
                _ = target.Style(BackgroundVariable, backgroundCss);

            if (style.Foreground is UIThemeColor foreground && WebCssValues.ThemeColor(foreground) is { Length: > 0 } foregroundCss)
                _ = target.Style(ForegroundVariable, foregroundCss);

            if (style.MarkColor is UIThemeColor markColor && WebCssValues.ThemeColor(markColor) is { Length: > 0 } markColorCss)
                _ = target.Style(MarkColorVariable, markColorCss);

            if (style.Mark is UISelectionMark mark)
                _ = target.Style(MarkVariable, WebCssValues.SelectionMark(mark));

            if (style.Bold is bool bold)
                _ = target.Style(FontWeightVariable, WebCssValues.SelectionFontWeight(bold));

            if (style.ActionBarBackground is UIThemeColor barGround && WebCssValues.ThemeColor(barGround) is { Length: > 0 } barGroundCss)
                _ = target.Style(ActionBarBackgroundVariable, barGroundCss);
        }, Operations);
    }
}
