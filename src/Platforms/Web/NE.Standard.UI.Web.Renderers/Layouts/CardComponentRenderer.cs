using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

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

    /// <summary>
    /// Draws the header band, only when a header region or a header action is present; it says which it holds, and whether its text
    /// shows nothing, which the text's own operations keep current (<see cref="Regions.CardHeaderRegionRenderer.ShownOperationKind"/>).
    /// </summary>
    private static void RenderHeader(WebRenderContext context, IHtmlElementBuilder root)
    {
        var hasHeader = HasRegion(context, RegionNames.Header);
        var hasAction = HasRegion(context, RegionNames.HeaderAction);

        if (!hasHeader && !hasAction)
            return;

        _ = root.Element("div", header =>
        {
            _ = header.Class(WebClassNames.CardHeader);

            if (hasHeader)
                _ = header.Class(HeaderContentClassName);

            if (hasAction)
                _ = header.Class(HeaderActionClassName);

            if (hasHeader && !HeaderTextShows(context))
                _ = header.Class(WebClassNames.CardHeaderEmpty);

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

    private const string HeaderContentClassName = "ui-card__header--content";
    private const string HeaderActionClassName = "ui-card__header--action";

    // Only the card's own header text says: another component in the region carries no operation that would keep the mark current.
    private static bool HeaderTextShows(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;

        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, RegionNames.Header)
            || !view.Graph.TryGet(slot.RootComponentId, out UIComponentNode? region)
            || region.TypeKey != CardHeaderRegion.ComponentTypeKey)
        {
            return true;
        }

        return TextContentRendererBase.ShowsAnyPart(context.ForNode(region, context.Html));
    }
}
