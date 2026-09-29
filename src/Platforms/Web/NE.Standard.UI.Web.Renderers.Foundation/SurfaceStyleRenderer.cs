using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// The author's colour, written to <c>--ui-surface-color</c> so <see cref="UISurfaceStyle"/> decides how to use it, and to
/// <c>--ui-ground</c> for a part cut out of it, with its on-colour as the muted text's base; the picture over it to
/// <c>--ui-surface-image</c>.
/// </summary>
public static class SurfaceStyleRenderer
{
    private static readonly WebDomOperation[] BackgroundOperations =
    [
        WebDomOperation.Style("--ui-surface-color", converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.Style("--ui-ground", converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.Style("--ui-faint-base", converter: WebDomConverters.ThemeOnColorCss)
    ];

    private static readonly WebDomOperation[] BackgroundImageOperations = [WebDomOperation.Style("--ui-surface-image", converter: WebDomConverters.BackgroundImageCss)];
    private static readonly WebDomOperation[] BackgroundImageFitOperations = [WebDomOperation.Style("--ui-surface-image-size", converter: WebDomConverters.ImageFitSizeCss)];
    private static readonly WebDomOperation[] SurfaceOperations = [WebDomOperation.Class(converter: WebDomConverters.SurfaceStyleClass)];

    public static void RenderBackground(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, target, property, static (element, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
            {
                _ = element.Style("--ui-surface-color", css);

                // A part cut out of this ground (a chart's hollow marker) paints this colour; a Tinted surface overrides it with its mix.
                _ = element.Style("--ui-ground", css);

                // Muted text and links on this ground take its on-colour, not the page's ink (.ui-color--muted, a link read the base);
                // the page's own grounds (Surface, Background) reset it, so a card of them reads as the page does.
                if (WebCssValues.ThemeOnColor(background) is { Length: > 0 } onColor)
                    _ = element.Style("--ui-faint-base", onColor);
            }
        }, BackgroundOperations);
    }

    /// <summary>Two custom properties the root's Less reads: the picture and its <c>background-size</c>.</summary>
    public static void RenderBackgroundImage(WebRenderContext context, IHtmlElementBuilder target)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, target, ISurfaceComponent.BackgroundImageProperty, static (element, value) =>
        {
            if (WebIconValue.TryReadImage(value, out var source, out _))
                _ = element.Style("--ui-surface-image", WebIconValue.ImageSourceCss(source));
        }, BackgroundImageOperations);

        _ = WebComponentRendererBase.RenderProperty<UIImageFit?>(context, target, ISurfaceComponent.BackgroundImageFitProperty, static (element, value) =>
        {
            if (value is UIImageFit fit)
                _ = element.Style("--ui-surface-image-size", WebCssValues.ImageFitSize(fit));
        }, BackgroundImageFitOperations);
    }

    public static void RenderSurface(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UISurfaceStyle?>(context, target, property, static (element, value) =>
        {
            if (value is UISurfaceStyle surface)
                _ = element.Class(WebClassNames.SurfaceStyle(surface));
        }, SurfaceOperations);
    }
}
