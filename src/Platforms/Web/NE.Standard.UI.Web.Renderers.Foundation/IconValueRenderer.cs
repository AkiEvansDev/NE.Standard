using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders one icon value onto an element: a glyph name as its pack's class, a URL as the picture behind it.</summary>
public static class IconValueRenderer
{
    /// <summary>The operations that apply the same value live. Prepend them to a site's own extras.</summary>
    public static readonly WebDomOperation[] Operations =
    [
        WebDomOperation.Class(converter: WebDomConverters.IconClass),
        WebDomOperation.Style(WebIconValue.ImageSourceProperty, converter: WebDomConverters.IconUrlCss)
    ];

    /// <summary>Writes the size class and colour a glyph wears.</summary>
    public static void RenderIconAppearance(WebRenderContext context, IHtmlElementBuilder target, UIProperty sizeProperty, UIProperty colorProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, target, sizeProperty, static (t, value) =>
        {
            if (value is UIIconSize size)
                _ = t.Class(WebClassNames.IconSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

        ThemeColorRenderer.RenderThemeColor(context, target, colorProperty);
    }

    /// <summary>Writes the icon onto <paramref name="target"/>: a glyph as its pack's class, a picture as the image URL.</summary>
    public static void RenderIconValue(IHtmlElementBuilder target, string value)
    {
        ArgumentNullException.ThrowIfNull(target);

        if (WebIconValue.TryReadImage(value, out var source, out var tinted))
        {
            _ = target.Style(WebIconValue.ImageSourceProperty, WebIconValue.ImageSourceCss(source));

            if (!tinted)
                _ = target.Class(WebIconValue.ImageClassName);

            return;
        }

        _ = target.Class(WebIconClassName.FromIconName(value));
    }
}
