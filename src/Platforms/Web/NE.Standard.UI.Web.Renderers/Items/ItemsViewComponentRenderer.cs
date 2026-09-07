using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

public sealed class ItemsViewComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-items-view__item";

    public override string ComponentTypeKey => ItemsViewComponent.ComponentTypeKey;

    protected override string ClassName => "ui-items-view";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderLayout(context, root, ItemsViewComponent.LayoutTypeProperty, ItemsViewComponent.OrientationProperty, ItemsViewComponent.SpacingProperty);
        RenderSelection(context, root);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);
        RenderFlagClass(context, root, IRowHoverableComponent.RowHoverableProperty, "ui-items-view--row-hover");
        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);
        RenderItems(context, root);
    }

    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        UIItemsHostMode hostMode = ResolveHostMode(context);

        // Host properties apply either way; only the item content waits for the client.
        RenderItemsHost(context, root, "ui-items-view__host", items, isBound, ItemClassName, configureHost: host =>
        {
            ApplyHostScroll(context, host);
            ApplyHostMode(host, hostMode);
            ApplyWindowProperties(context, host, hostMode);
            RenderSelectedKeys(context, host);
        }, renderItems: host =>
        {
            HashSet<string> selected = ResolveSelectedKeys(context);
            var virtualized = hostMode == UIItemsHostMode.Virtualized;

            // A virtualized host hands the client every value and only the first rows: the client draws the rest, headers included.
            RenderItemList(context, host, items, ItemClassName, decorateItem: (itemRoot, item, _) => MarkSelected(itemRoot, item, selected), limit: virtualized ? VirtualizedFirstPaintRows : null, publishValues: virtualized);
        });
    }
}
