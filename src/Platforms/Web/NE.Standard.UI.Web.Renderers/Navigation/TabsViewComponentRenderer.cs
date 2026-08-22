using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A caption strip over pages rendered from a collection. Both halves of a tab come out of one item template,
/// and the grid below is what puts the captions in a row and the pages under them.
/// </summary>
public sealed class TabsViewComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-tabs-view__item";
    private const string SelectedAttribute = "data-ui-tabs-selected";

    public override string ComponentTypeKey => TabsViewComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs-view";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The same attribute the plain variant uses, so one client engine drives both: it is the single fact
        // a click flips and a server patch writes.
        _ = RenderProperty<string?>(context, root, TabsViewComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(SelectedAttribute, value);
        }, [WebDomOperation.Attribute(SelectedAttribute, target: "root")]);

        _ = RenderProperty<bool?>(context, root, TabsViewComponent.RenamableProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("data-ui-tabs-renamable");
        }, [WebDomOperation.ToggleAttribute("data-ui-tabs-renamable", condition: WebValueCondition.IsTrue, target: "root")]);

        _ = RenderProperty<bool?>(context, root, TabsViewComponent.ReorderableProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("data-ui-tabs-reorderable");
        }, [WebDomOperation.ToggleAttribute("data-ui-tabs-reorderable", condition: WebValueCondition.IsTrue, target: "root")]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>
    /// Tabs live in an inner host, the way every bound collection must — the client resolves a host with
    /// <c>root.querySelector("[data-ui-items-host]")</c>, which searches descendants only.
    /// </summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-tabs-view__host");
            _ = host.Attribute("data-ui-items-host");
            _ = host.Attribute("role", "tablist");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RenderItemList(context, host, items, ItemClassName);
        });
    }
}
