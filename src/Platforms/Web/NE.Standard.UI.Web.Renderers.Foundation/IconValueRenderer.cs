using System;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Constants;
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

    /// <summary>
    /// The operation that redraws a picture icon's stand-in after its value, shape or fallback changed (<c>icon-stand-in.ts</c>), named
    /// by the host's mark that shows the icon.
    /// </summary>
    public const string StandInOperationKind = "icon-stand-in";

    /// <summary>The glyph a picture shows while it has none, laid over the picture's place (<see cref="RenderStandInGlyph"/>).</summary>
    public const string StandInClassName = "ui-icon-stand-in";

    private static readonly WebDomOperation[] SizeOperations = [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)];

    // On a component root, the size its own glyph is drawn at where an author set one: only the stylesheet reads it (a glyph edge).
    private const string GlyphSizeAttribute = "data-ui-icon-size";

    // A component's own glyph: its class on the glyph, and the same size on the component's root for what reads it there.
    private static readonly WebDomOperation[] GlyphSizeOperations =
    [
        WebDomOperation.Class(converter: WebDomConverters.IconSizeClass),
        WebDomOperation.Attribute(GlyphSizeAttribute, "root", WebDomConverters.IconSizeAttribute)
    ];

    /// <summary>Writes the size class and colour a glyph wears.</summary>
    public static void RenderIconAppearance(WebRenderContext context, IHtmlElementBuilder target, UIProperty sizeProperty, UIProperty colorProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, target, sizeProperty, static (t, value) => WriteSize(t, value), SizeOperations);

        ThemeColorRenderer.RenderThemeColor(context, target, colorProperty);
    }

    /// <summary>
    /// Writes the size a component's own glyph is drawn at: its class on <paramref name="glyph"/> and, where an author set one and
    /// <paramref name="marksRoot"/>, the size on the component's root (<c>data-ui-icon-size</c>) — a glyph edge hangs an icon-only
    /// button by its glyph (<c>ui-button.less</c>), and the root cannot read a size its glyph's class sets. A component with two glyphs
    /// of one size marks its root from the first.
    /// </summary>
    public static void RenderGlyphSize(WebRenderContext context, IHtmlElementBuilder root, IHtmlElementBuilder glyph, UIProperty sizeProperty, bool marksRoot = true)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(glyph);

        _ = WebComponentRendererBase.RenderProperty<UIIconSize?>(context, glyph, sizeProperty, static (target, value) => WriteSize(target, value), GlyphSizeOperations);

        // Read again, not in the glyph's callback: one reaching the root would be a closure allocated per component.
        if (!marksRoot)
            return;

        _ = WebComponentRendererBase.ResolveRenderValue(context, sizeProperty, out UIIconSize? size, out _);

        if (size is UIIconSize authored)
            _ = root.Attribute(GlyphSizeAttribute, WebCssValues.IconSize(authored));
    }

    /// <summary>The same from values no property carries — an item's badge drawn from its own.</summary>
    public static void RenderIconAppearance(IHtmlElementBuilder target, UIIconSize? size, UIThemeColor color)
    {
        ArgumentNullException.ThrowIfNull(target);

        WriteSize(target, size);
        ThemeColorRenderer.RenderThemeColor(target, color);
    }

    private static void WriteSize(IHtmlElementBuilder target, UIIconSize? value)
    {
        if (value is UIIconSize size)
            _ = target.Class(WebClassNames.IconSize(size));
    }

    /// <summary>
    /// Writes the shape a picture icon is drawn in (<see cref="UIIconShape"/>; the stylesheet leaves a glyph as it is) and its fallback;
    /// a round one whose value draws nothing shows the fallback glyph on a neutral circle, and its host the mark that shows the icon. A
    /// picture of any shape that fails to load is the client's to answer (<c>icon-stand-in.ts</c>).
    /// </summary>
    public static void RenderIconShape(WebRenderContext context, IHtmlElementBuilder host, IHtmlElementBuilder icon, WebIconShapeSite site)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(icon);
        ArgumentNullException.ThrowIfNull(site);

        _ = WebComponentRendererBase.RenderProperty<UIIconShape?>(context, icon, site.ShapeProperty, static (t, value) =>
        {
            if (value is UIIconShape shape && WebClassNames.IconShape(shape) is { Length: > 0 } className)
                _ = t.Class(className);
        }, site.ShapeOperations.Span);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, site.FallbackProperty, static (t, value) =>
        {
            if (Draws(value))
                _ = t.Attribute(WebAttributes.FallbackIcon, value);
        }, site.FallbackOperations.Span);

        _ = WebComponentRendererBase.ResolveRenderValue(context, site.ShapeProperty, out UIIconShape? shape, out _);

        if (shape != UIIconShape.Circle)
            return;

        _ = WebComponentRendererBase.ResolveRenderValue(context, site.IconProperty, out string? value, out _);

        if (Draws(value))
            return;

        _ = WebComponentRendererBase.ResolveRenderValue(context, site.FallbackProperty, out string? fallback, out _);
        _ = host.Attribute(site.ShownAttribute);
        _ = icon.Attribute(WebAttributes.IconFailed, MissingReason);
        RenderStandInGlyph(icon, fallback, round: true);
    }

    /// <summary>Why a round icon shows its stand-in when it has no value at all, which the client tells from a picture that failed.</summary>
    public const string MissingReason = "missing";

    /// <summary>
    /// Renders the glyph a picture shows while it has none: <paramref name="fallback"/> where it names one, else the person on a
    /// <paramref name="round"/> one and a picture's glyph on any other.
    /// </summary>
    public static void RenderStandInGlyph(IHtmlElementBuilder parent, string? fallback, bool round)
        => RenderIcon(parent, Draws(fallback) ? fallback : round ? UIGlyphs.Person : UIGlyphs.Image, StandInClassName);

    /// <summary>
    /// Renders a standalone icon element — a package's chrome mark or the framework's <c>ne-</c> glyph beside a word. Decorative:
    /// a screen reader hears the words, not the mark.
    /// </summary>
    public static void RenderIcon(IHtmlElementBuilder parent, string icon, string? className = null)
        => RenderIcon(parent, icon, className, null);

    /// <summary>Renders a standalone icon element in <paramref name="color"/>, or in the ink around it when null — a table column's mark before its caption.</summary>
    public static void RenderIcon(IHtmlElementBuilder parent, string icon, string? className, UIThemeColor? color)
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

            if (color is UIThemeColor ink)
                ThemeColorRenderer.RenderThemeColor(element, ink);
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
