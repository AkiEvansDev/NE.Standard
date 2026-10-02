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
    /// <summary>On a surface showing a background picture: what the stylesheet draws its dim and blur over.</summary>
    public const string ImageAttribute = "data-ui-surface-image";

    /// <summary><c>vignette</c> while the picture's dim lies on its edges alone; absent, it lies evenly.</summary>
    public const string ImageDimAttribute = "data-ui-surface-image-dim";

    private static readonly WebDomOperation[] BackgroundOperations =
    [
        WebDomOperation.Style("--ui-surface-color", converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.Style("--ui-ground", converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.Style("--ui-faint-base", converter: WebDomConverters.ThemeOnColorCss)
    ];

    private static readonly WebDomOperation[] BackgroundImageOperations =
    [
        WebDomOperation.Style("--ui-surface-image", converter: WebDomConverters.BackgroundImageCss),
        WebDomOperation.Attribute(ImageAttribute, converter: WebDomConverters.BackgroundImageAttribute)
    ];

    private static readonly WebDomOperation[] BackgroundImageFitOperations = [WebDomOperation.Style("--ui-surface-image-size", converter: WebDomConverters.ImageFitSizeCss)];
    private static readonly WebDomOperation[] BackgroundImageDimOperations = [WebDomOperation.Style("--ui-surface-image-dim", converter: WebDomConverters.BackgroundImageDimCss)];
    private static readonly WebDomOperation[] BackgroundImageDimModeOperations = [WebDomOperation.Attribute(ImageDimAttribute, converter: WebDomConverters.BackgroundImageDimModeAttribute)];

    private static readonly WebDomOperation[] BackgroundImageBlurOperations =
    [
        WebDomOperation.Style("--ui-surface-image-blur", converter: WebDomConverters.BackgroundImageBlurCss),
        WebDomOperation.Attribute(WebAttributes.SurfaceImageBlur, converter: WebDomConverters.BackgroundImageBlurAttribute)
    ];
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

    /// <summary>
    /// The custom properties the root's Less reads — the picture, its <c>background-size</c>, its dim and its blur — and the attributes
    /// saying a picture is shown, blurred, and dimmed at the edges alone. The browser draws the dim and the blur
    /// (<c>mixins/surface-image.less</c>), so a bound value moves them with no new picture.
    /// </summary>
    public static void RenderBackgroundImage(WebRenderContext context, IHtmlElementBuilder target)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<string?>(context, target, ISurfaceComponent.BackgroundImageProperty, static (element, value) =>
        {
            if (WebIconValue.TryReadImage(value, out var source, out _))
                _ = element.Style("--ui-surface-image", WebIconValue.ImageSourceCss(source)).Attribute(ImageAttribute);
        }, BackgroundImageOperations);

        _ = WebComponentRendererBase.RenderProperty<UIImageFit?>(context, target, ISurfaceComponent.BackgroundImageFitProperty, static (element, value) =>
        {
            if (value is UIImageFit fit)
                _ = element.Style("--ui-surface-image-size", WebCssValues.ImageFitSize(fit));
        }, BackgroundImageFitOperations);

        // Held to its range rather than refused: a bound value is the reader's (a slider), and a static one was refused at authoring.
        _ = WebComponentRendererBase.RenderProperty<double?>(context, target, ISurfaceComponent.BackgroundImageDimProperty, static (element, value) =>
        {
            if (value is double dim && WebCssValues.BackgroundImageDim(dim) is { Length: > 0 } css)
                _ = element.Style("--ui-surface-image-dim", css);
        }, BackgroundImageDimOperations);

        _ = WebComponentRendererBase.RenderProperty<UIBackgroundDimMode?>(context, target, ISurfaceComponent.BackgroundImageDimModeProperty, static (element, value) =>
        {
            if (value == UIBackgroundDimMode.Vignette)
                _ = element.Attribute(ImageDimAttribute, "vignette");
        }, BackgroundImageDimModeOperations);

        _ = WebComponentRendererBase.RenderProperty<double?>(context, target, ISurfaceComponent.BackgroundImageBlurProperty, static (element, value) =>
        {
            if (value is double blur && WebCssValues.IsBackgroundImageBlurred(blur))
                _ = element.Style("--ui-surface-image-blur", WebCssValues.BackgroundImageBlur(blur)).Attribute(WebAttributes.SurfaceImageBlur);
        }, BackgroundImageBlurOperations);
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
