using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class ImageComponentRenderer : WebComponentRendererBase
{
    private static readonly WebDomOperation[] SourceOperations = [WebDomOperation.Attribute("src", converter: WebDomConverters.SafeImageSource)];
    private static readonly WebDomOperation[] FallbackSourceOperations = [WebDomOperation.Attribute(WebAttributes.FallbackSrc, converter: WebDomConverters.SafeImageSource)];
    private static readonly WebDomOperation[] AltTextOperations = [WebDomOperation.Attribute("alt")];
    private static readonly WebDomOperation[] FitOperations = [WebDomOperation.Class(converter: WebDomConverters.ImageFitClass)];
    private static readonly WebDomOperation[] CornerRadiusOperations = [WebDomOperation.Style("border-radius", converter: WebDomConverters.RadiusCss)];

    public override string ComponentTypeKey => ImageComponent.ComponentTypeKey;

    protected override string ElementName => "img";

    protected override string ClassName => "ui-image";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // A long list of pictures fetches only those near the viewport, and none of them holds up the frame while it decodes.
        _ = root.Attribute("loading", "lazy");
        _ = root.Attribute("decoding", "async");

        _ = RenderProperty<string?>(context, root, ImageComponent.SourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute("src", value);
        }, SourceOperations);

        _ = RenderProperty<string?>(context, root, ImageComponent.FallbackSourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute(WebAttributes.FallbackSrc, value);
        }, FallbackSourceOperations);

        _ = RenderProperty<string?>(context, root, ImageComponent.AltTextProperty, static (target, value)
            => target.Attribute("alt", value ?? string.Empty), AltTextOperations);

        _ = RenderProperty<UIImageFit?>(context, root, ImageComponent.FitProperty, static (target, value) =>
        {
            if (value is UIImageFit fit)
                _ = target.Class(WebClassNames.ImageFit(fit));
        }, FitOperations);

        _ = RenderProperty<UICornerRadius?>(context, root, ImageComponent.CornerRadiusProperty, static (target, value) =>
        {
            if (value is UICornerRadius radius)
                _ = target.Style("border-radius", WebCssValues.Radius(radius));
        }, CornerRadiusOperations);

        RenderTooltip(context, root);
    }
}
