using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a <see cref="UITextAppearance"/> as a text-role class, or inline font styles when a size is set.</summary>
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
