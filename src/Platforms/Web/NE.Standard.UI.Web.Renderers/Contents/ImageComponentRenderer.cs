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
    public override string ComponentTypeKey => ImageComponent.ComponentTypeKey;

    protected override string ElementName => "img";

    protected override string ClassName => "ui-image";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, ImageComponent.SourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute("src", value);
        }, [WebDomOperation.Attribute("src", converter: WebDomConverters.SafeImageSource)]);

        _ = RenderProperty<string?>(context, root, ImageComponent.FallbackSourceProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeImageSource(value))
                _ = target.Attribute(WebAttributes.FallbackSrc, value);
        }, [WebDomOperation.Attribute(WebAttributes.FallbackSrc, converter: WebDomConverters.SafeImageSource)]);

        _ = RenderProperty<string?>(context, root, ImageComponent.AltTextProperty, static (target, value)
            => target.Attribute("alt", value ?? string.Empty), [WebDomOperation.Attribute("alt")]);

        _ = RenderProperty<UIImageFit?>(context, root, ImageComponent.FitProperty, static (target, value) =>
        {
            if (value is UIImageFit fit)
                _ = target.Class(WebClassNames.ImageFit(fit));
        }, [WebDomOperation.Class(converter: WebDomConverters.ImageFitClass)]);

        _ = RenderProperty<UICornerRadius?>(context, root, ImageComponent.CornerRadiusProperty, static (target, value) =>
        {
            if (value is UICornerRadius radius)
                _ = target.Style("border-radius", WebCssValues.Radius(radius));
        }, [WebDomOperation.Style("border-radius", converter: WebDomConverters.RadiusCss)]);

        RenderTooltip(context, root);
    }
}
