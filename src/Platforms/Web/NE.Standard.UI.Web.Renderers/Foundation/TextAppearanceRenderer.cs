using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Renders a <see cref="UITextAppearance"/>-typed property, either as a <c>ui-text-type--*</c> class
/// (semantic <see cref="UITextAppearance.Role"/>, tracks the live theme) or as inline
/// font-size/font-weight/line-height/letter-spacing styles (explicit <see cref="UITextAppearance.Size"/>
/// override, which always wins when set). Mirrors <see cref="ThemeColorRenderer"/> — the analogous
/// role-or-explicit union, just for text instead of color. Shared by every renderer with a themable text
/// role — see <c>TextContentRendererBase</c>, <c>BadgeComponentRenderer</c>, <c>LinkComponentRenderer</c>.
/// </summary>
public static class TextAppearanceRenderer
{
    public static void RenderTextAppearance(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UITextAppearance?>(context, target, property, static (t, value) =>
        {
            if (value is not UITextAppearance appearance)
                return;

            if (appearance.Size is double size)
            {
                _ = t.Style("font-size", WebCssValues.Pixels(size));

                if (appearance.Weight is int weight)
                    _ = t.Style("font-weight", weight.ToString(CultureInfo.InvariantCulture));

                if (appearance.LineHeight is double lineHeight)
                    _ = t.Style("line-height", WebCssValues.Pixels(lineHeight));

                if (appearance.LetterSpacing is double letterSpacing)
                    _ = t.Style("letter-spacing", WebCssValues.Pixels(letterSpacing));
            }
            else if (appearance.Role is UITextType role)
            {
                _ = t.Class(WebClassNames.TextType(role));
            }
        }, [
            WebDomOperation.Class(converter: WebDomConverters.TextAppearanceClass),
            WebDomOperation.Style("font-size", converter: WebDomConverters.TextAppearanceFontSizeCss),
            WebDomOperation.Style("font-weight", converter: WebDomConverters.TextAppearanceFontWeightCss),
            WebDomOperation.Style("line-height", converter: WebDomConverters.TextAppearanceLineHeightCss),
            WebDomOperation.Style("letter-spacing", converter: WebDomConverters.TextAppearanceLetterSpacingCss)
        ]);
    }
}
