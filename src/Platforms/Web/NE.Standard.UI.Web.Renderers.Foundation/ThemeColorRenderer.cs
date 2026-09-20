using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>Renders a <see cref="UIThemeColor"/> as a <c>ui-color--*</c> class or inline style; fit only for CSS <c>color</c>.</summary>
public static class ThemeColorRenderer
{
    public static void RenderThemeColor(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, target, property, static (t, value) =>
        {
            if (value is not UIThemeColor color)
                return;

            if (color.Light is not null || color.Dark is not null)
                _ = t.Style("color", WebCssValues.ThemeColor(color));
            else if (color.Style is UIColorStyle style)
                _ = t.Class(WebClassNames.Color(style));
        }, [
            // Inline only for a variant: a style colour goes by class, whose rule is the ink, not the raw colour.
            WebDomOperation.Style("color", converter: WebDomConverters.ThemeColorInlineCss),
            WebDomOperation.Class(converter: WebDomConverters.ThemeColorClass)
        ]);
    }

    /// <summary>
    /// The colour a series takes by its place in the theme's categorical run — <c>--ui-color-series-{n}</c>, cycled by
    /// <c>--ui-color-series-count</c>; an author's own <see cref="UIThemeColor"/> outranks it.
    /// </summary>
    public static string SeriesColorCss(WebRenderContext context, int index, UIThemeColor? own = null)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentOutOfRangeException.ThrowIfNegative(index);

        if (own is UIThemeColor color && WebCssValues.ThemeColor(color) is { Length: > 0 } css)
            return css;

        // The shorter run of the two palettes: a series past it would change colour with the theme's mode.
        var count = Math.Max(1, Math.Min(context.Theme.Light.Series.Count, context.Theme.Dark.Series.Count));

        return $"var(--ui-color-series-{((index % count) + 1).ToString(CultureInfo.InvariantCulture)})";
    }
}
