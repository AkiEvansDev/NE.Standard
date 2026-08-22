using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class CardComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => CardComponent.ComponentTypeKey;

    protected override string ClassName => "ui-card";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, CardComponent.PaddingProperty, "--ui-padding");

        _ = RenderProperty<UIThemeColor?>(context, root, CardComponent.BackgroundProperty, static (target, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
                _ = target.Style("background", css);
        }, [WebDomOperation.Style("background", converter: WebDomConverters.ThemeColorCss)]);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        _ = RenderProperty<bool?>(context, root, CardComponent.ClickableProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-card--clickable");
        }, [WebDomOperation.ToggleClass("ui-card--clickable")]);

        _ = root.Element("div", header =>
        {
            _ = header.Class("ui-card__header");

            RenderRegion(context, header, RegionNames.Header);
        });

        if (HasRegion(context, RegionNames.Content))
        {
            _ = root.Element("div", content =>
            {
                _ = content.Class("ui-card__content");

                RenderRegion(context, content, RegionNames.Content);
            });
        }

        if (HasRegion(context, RegionNames.Footer))
        {
            _ = root.Element("div", footer =>
            {
                _ = footer.Class("ui-card__footer");

                RenderRegion(context, footer, RegionNames.Footer);
            });
        }
    }
}
