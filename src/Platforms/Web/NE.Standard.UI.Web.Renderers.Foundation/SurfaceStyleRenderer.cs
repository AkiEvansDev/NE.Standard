using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The author's colour, written to <c>--ui-surface-color</c> so <see cref="UISurfaceStyle"/> decides how to use it; the picture over it to <c>--ui-surface-image</c>.</summary>
public static class SurfaceStyleRenderer
{
    public static void RenderBackground(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, target, property, static (element, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
                _ = element.Style("--ui-surface-color", css);
        }, [WebDomOperation.Style("--ui-surface-color", converter: WebDomConverters.ThemeColorCss)]);
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
        }, [WebDomOperation.Style("--ui-surface-image", converter: WebDomConverters.BackgroundImageCss)]);

        _ = WebComponentRendererBase.RenderProperty<UIImageFit?>(context, target, ISurfaceComponent.BackgroundImageFitProperty, static (element, value) =>
        {
            if (value is UIImageFit fit)
                _ = element.Style("--ui-surface-image-size", WebCssValues.ImageFitSize(fit));
        }, [WebDomOperation.Style("--ui-surface-image-size", converter: WebDomConverters.ImageFitSizeCss)]);
    }

    public static void RenderSurface(WebRenderContext context, IHtmlElementBuilder target, UIProperty property)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(target);

        _ = WebComponentRendererBase.RenderProperty<UISurfaceStyle?>(context, target, property, static (element, value) =>
        {
            if (value is UISurfaceStyle surface)
                _ = element.Class(WebClassNames.SurfaceStyle(surface));
        }, [WebDomOperation.Class(converter: WebDomConverters.SurfaceStyleClass)]);
    }
}
