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

    /// <summary>
    /// Renders a standalone icon element — a package's chrome mark or the framework's <c>ne-</c> glyph beside a word. Decorative:
    /// a screen reader hears the words, not the mark.
    /// </summary>
    public static void RenderIcon(IHtmlElementBuilder parent, string icon, string? className = null)
    {
        ArgumentNullException.ThrowIfNull(parent);
        ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        _ = parent.Element("span", element =>
        {
            _ = element.Class(className is null ? "ui-icon" : $"ui-icon {className}");
            // `.ui-icon::before` stays hidden until this says there is a glyph to draw.
            _ = element.Attribute(WebAttributes.Icon);
            _ = element.Attribute("aria-hidden", "true");
            RenderIconValue(element, icon);
        });
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
