using System;
using System.Diagnostics.CodeAnalysis;
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

    private static readonly WebDomOperation[] SizeOperations = [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)];

    /// <summary>Writes the size class and colour a glyph wears.</summary>
    public static void RenderIconAppearance(WebRenderContext context, IHtmlElementBuilder target, UIProperty sizeProperty, UIProperty colorProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, target, sizeProperty, static (t, value) =>
        {
            if (value is UIIconSize size)
                _ = t.Class(WebClassNames.IconSize(size));
        }, SizeOperations);

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

            // `.ui-icon::before` stays hidden until this says there is something to draw.
            if (Draws(icon))
                _ = element.Attribute(WebAttributes.Icon);

            _ = element.Attribute("aria-hidden", "true");
            RenderIconValue(element, icon);
        });
    }

    /// <summary>
    /// Whether an icon value names something to draw — a glyph name with a letter or digit, or a picture the page may load; the
    /// server's twin of <see cref="WebValueCondition.DrawsIcon"/>.
    /// </summary>
    /// <remarks>Names, not draws: a pack's rule for the name is the stylesheet's business, which neither side can see.</remarks>
    public static bool Draws([NotNullWhen(true)] string? value)
        => WebIconValue.Names(value);

    /// <summary>
    /// Writes the icon onto <paramref name="target"/>: a glyph as its pack's class, a picture as the image URL and its form's class; a
    /// name with no letter or digit (an emoji, a stray symbol) writes nothing.
    /// </summary>
    public static void RenderIconValue(IHtmlElementBuilder target, string value)
    {
        ArgumentNullException.ThrowIfNull(target);

        if (WebIconValue.TryReadImage(value, out var source, out var tinted))
        {
            _ = target.Style(WebIconValue.ImageSourceProperty, WebIconValue.ImageSourceCss(source));
            _ = target.Class(tinted ? WebIconValue.MaskClassName : WebIconValue.ImageClassName);
            return;
        }

        // A glyph's class, or nothing for a value that names none.
        var className = WebIconValue.ClassName(value);

        if (className.Length > 0)
            _ = target.Class(className);
    }
}
