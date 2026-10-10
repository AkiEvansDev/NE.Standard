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
    private static readonly WebDomOperation[] Operations =
    [
        WebDomOperation.Class(converter: WebDomConverters.TextAppearanceClass),
        WebDomOperation.Style("font-size", converter: WebDomConverters.TextAppearanceFontSizeCss),
        WebDomOperation.Style("font-weight", converter: WebDomConverters.TextAppearanceFontWeightCss),
        WebDomOperation.Style("line-height", converter: WebDomConverters.TextAppearanceLineHeightCss),
        WebDomOperation.Style("letter-spacing", converter: WebDomConverters.TextAppearanceLetterSpacingCss)
    ];

    // The role again on the text body, whose icon takes the description's line height when there is no title (ui-text.less).
    private static readonly WebDomOperation[] DescriptionOperations =
    [
        .. Operations,
        WebDomOperation.Class(target: ".ui-text", converter: WebDomConverters.TextDescriptionTypeClass)
    ];

    public static void RenderTextAppearance(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UITextAppearance?>(context, target, property, static (t, value) => WriteAppearance(t, value), Operations);
    }

    /// <summary>A text body's description appearance, its role also written on <paramref name="text"/>, the body around it.</summary>
    public static void RenderDescriptionAppearance(WebRenderContext context, IHtmlElementBuilder description, IHtmlElementBuilder text, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(description);
        ArgumentNullException.ThrowIfNull(text);

        _ = WebComponentRendererBase.RenderProperty<UITextAppearance?>(context, description, property, (t, value) =>
        {
            WriteAppearance(t, value);

            if (value is { Size: null, Role: UITextType role })
                _ = text.Class(WebClassNames.TextDescriptionType(role));
        }, DescriptionOperations);
    }

    private static void WriteAppearance(IHtmlElementBuilder target, UITextAppearance? value)
    {
        if (value is not UITextAppearance appearance)
            return;

        if (appearance.Size is double size)
        {
            _ = target.Style("font-size", WebCssValues.Pixels(size));

            if (appearance.Weight is int weight)
                _ = target.Style("font-weight", weight.ToString(CultureInfo.InvariantCulture));

            if (appearance.LineHeight is double lineHeight)
                _ = target.Style("line-height", WebCssValues.Pixels(lineHeight));

            if (appearance.LetterSpacing is double letterSpacing)
                _ = target.Style("letter-spacing", WebCssValues.Pixels(letterSpacing));
        }
        else if (appearance.Role is UITextType role)
        {
            _ = target.Class(WebClassNames.TextType(role));
        }
    }
}
