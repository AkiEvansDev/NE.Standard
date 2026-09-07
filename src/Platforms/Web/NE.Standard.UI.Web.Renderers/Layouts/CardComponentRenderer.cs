using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class CardComponentRenderer : SurfaceRendererBase
{
    public override string ComponentTypeKey => CardComponent.ComponentTypeKey;

    protected override string ClassName => "ui-card";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderSurface(context, root);

        RenderHeader(context, root);

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

    /// <summary>Draws the header band, only when a header region or a header action is present.</summary>
    private static void RenderHeader(WebRenderContext context, IHtmlElementBuilder root)
    {
        var hasHeader = HasRegion(context, RegionNames.Header);
        var hasAction = HasRegion(context, RegionNames.HeaderAction);

        if (!hasHeader && !hasAction)
            return;

        _ = root.Element("div", header =>
        {
            _ = header.Class("ui-card__header");

            if (hasHeader)
            {
                _ = header.Element("div", text =>
                {
                    _ = text.Class("ui-card__header-content");

                    RenderRegion(context, text, RegionNames.Header);
                });
            }

            if (hasAction)
            {
                _ = header.Element("div", action =>
                {
                    _ = action.Class("ui-card__header-action");

                    RenderRegion(context, action, RegionNames.HeaderAction);
                });
            }
        });
    }
}
