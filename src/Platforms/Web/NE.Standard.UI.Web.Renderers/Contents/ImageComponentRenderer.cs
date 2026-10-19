using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>
/// A picture in a box of its own: the box takes the size, shape and corners, the picture fills it, and one with no picture shows its
/// fallback glyph over the box (<c>image-fallback-engine.ts</c>), which an <c>&lt;img&gt;</c> alone could not hold.
/// </summary>
public sealed class ImageComponentRenderer : WebComponentRendererBase
{
    private static readonly WebDomOperation[] SourceOperations = [WebDomOperation.Attribute("src", converter: WebDomConverters.SafeImageSource)];
    private static readonly WebDomOperation[] FallbackSourceOperations = [WebDomOperation.Attribute(WebAttributes.FallbackSrc, converter: WebDomConverters.SafeImageSource)];
    private static readonly WebDomOperation[] AltTextOperations = [WebDomOperation.Attribute("alt")];
    private static readonly WebDomOperation[] FitOperations = [WebDomOperation.Class(converter: WebDomConverters.ImageFitClass)];
    private static readonly WebDomOperation[] ShapeOperations = [WebDomOperation.Class(converter: WebDomConverters.ImageShapeClass)];

    public override string ComponentTypeKey => ImageComponent.ComponentTypeKey;

    protected override string ElementName => "span";

    protected override string ClassName => WebClassNames.Image;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIImageFit?>(context, root, ImageComponent.FitProperty, static (target, value) =>
        {
            if (value is UIImageFit fit)
                _ = target.Class(WebClassNames.ImageFit(fit));
        }, FitOperations);

        // Through the border's radius chain, which the shape's circle outranks in the stylesheet.
        ResponsiveRenderer.ApplyResponsiveRadius(context, root, ImageComponent.BorderRadiusProperty, WebResponsiveCss.BorderRadiusVariable);

        _ = RenderProperty<UIImageShape?>(context, root, ImageComponent.ShapeProperty, static (target, value) =>
        {
            if (value is UIImageShape shape && WebClassNames.ImageShape(shape) is { Length: > 0 } className)
                _ = target.Class(className);
        }, ShapeOperations);

        RenderTooltip(context, root);

        _ = ResolveRenderValue(context, ImageComponent.FallbackIconProperty, out string? fallbackIcon, out _);

        if (IconValueRenderer.Draws(fallbackIcon))
            _ = root.Attribute(WebAttributes.FallbackIcon, fallbackIcon);

        _ = root.Element("img", picture => RenderPicture(context, picture));

        RenderStandIn(context, root, fallbackIcon);
    }

    private static void RenderPicture(WebRenderContext context, IHtmlElementBuilder picture)
    {
        _ = picture.Class(WebClassNames.ImagePicture);

        // A long list of pictures fetches only those near the viewport, and none of them holds up the frame while it decodes.
        _ = picture.Attribute("loading", "lazy");
        _ = picture.Attribute("decoding", "async");

        _ = RenderProperty<string?>(context, picture, ImageComponent.SourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute("src", value);
        }, SourceOperations);

        _ = RenderProperty<string?>(context, picture, ImageComponent.FallbackSourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute(WebAttributes.FallbackSrc, value);
        }, FallbackSourceOperations);

        _ = RenderProperty<string?>(context, picture, ImageComponent.AltTextProperty, static (target, value)
            => target.Attribute("alt", value ?? string.Empty), AltTextOperations);
    }

    /// <summary>
    /// A picture with neither a source nor a fallback source shows its glyph from the first paint, the person's on a round one and a
    /// picture's on any other; one that fails later is the client's to answer.
    /// </summary>
    private static void RenderStandIn(WebRenderContext context, IHtmlElementBuilder root, string? fallbackIcon)
    {
        _ = ResolveRenderValue(context, ImageComponent.SourceProperty, out string? source, out _);
        _ = ResolveRenderValue(context, ImageComponent.FallbackSourceProperty, out string? fallbackSource, out _);

        if (WebUrlSafety.IsSafeImageSource(source) || WebUrlSafety.IsSafeImageSource(fallbackSource))
            return;

        _ = ResolveRenderValue(context, ImageComponent.ShapeProperty, out UIImageShape? shape, out _);
        _ = root.Attribute(WebAttributes.ImageFailed);
        IconValueRenderer.RenderStandInGlyph(root, fallbackIcon, shape == UIImageShape.Circle);
    }
}
