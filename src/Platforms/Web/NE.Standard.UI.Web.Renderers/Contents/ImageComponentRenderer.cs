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

        _ = RenderProperty<string?>(context, root, ImageComponent.SourceProperty, static (target, value)
            => target.Attribute("src", value ?? string.Empty), [WebDomOperation.Attribute("src")]);

        _ = RenderProperty<string?>(context, root, ImageComponent.FallbackSourceProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("data-ui-fallback-src", value);
        }, [WebDomOperation.Attribute("data-ui-fallback-src")]);

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

        _ = RenderProperty<string?>(context, root, ImageComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);
    }
}
