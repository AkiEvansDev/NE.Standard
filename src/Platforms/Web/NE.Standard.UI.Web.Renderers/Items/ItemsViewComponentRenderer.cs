using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

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
        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context);
        RegisterItemsFilterSortMetadata(context);
        RenderItems(context, root);
    }

    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-items-view__host");
            _ = host.Attribute("data-ui-items-host");

            ApplyHostProperties(context, host);
            ApplyWindowProperties(context, host);
            ApplyVirtualization(context, host);

            // Host properties apply either way; only the item content waits for the client.
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

    /// <summary>
    /// Marks a host that lays out only the rows in view. Bindable, unlike the window size: which parts of a
    /// page are worth virtualizing can follow the data.
    /// </summary>
    private static void ApplyVirtualization(WebRenderContext context, IHtmlElementBuilder host)
    {
        _ = RenderProperty<bool?>(context, host, IVirtualizedItemsComponent.VirtualizeProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Attribute("data-ui-virtualized", "");
        }, [WebDomOperation.ToggleAttribute("data-ui-virtualized", "[data-ui-items-host]")]);
    }

    /// <summary>
    /// Writes the window's geometry onto the host, where the client engine reads it: how many items a request
    /// asks for, where the window sits, and whether either side has more. All but the size are patched live,
    /// because a source that loads a further window changes them.
    /// </summary>
    private static void ApplyWindowProperties(WebRenderContext context, IHtmlElementBuilder host)
    {
        _ = ResolveRenderValue(context, ISourceItemsComponent.IsWindowedProperty, out bool? isWindowed, out _);

        if (isWindowed != true)
            return;

        _ = ResolveRenderValue(context, ISourceItemsComponent.WindowSizeProperty, out int? windowSize, out _);

        _ = host.Attribute("data-ui-windowed", "");
        _ = host.Attribute("data-ui-window-size", (windowSize ?? 0).ToString(CultureInfo.InvariantCulture));

        RenderWindowValue(context, host, ISourceItemsComponent.WindowOffsetProperty, "data-ui-window-offset");
        RenderWindowValue(context, host, ISourceItemsComponent.WindowTotalCountProperty, "data-ui-window-total");
        RenderWindowValue(context, host, ISourceItemsComponent.WindowHasMoreBeforeProperty, "data-ui-window-more-before");
        RenderWindowValue(context, host, ISourceItemsComponent.WindowHasMoreAfterProperty, "data-ui-window-more-after");
    }

    private static void RenderWindowValue(WebRenderContext context, IHtmlElementBuilder host, UIProperty property, string attribute)
    {
        _ = RenderProperty<object?>(context, host, property, (target, value) =>
        {
            // Lowercase for a bool: a live patch writes what JavaScript's String() produces, and "True" and
            // "true" would be two different answers to the same question.
            if (value is bool flag)
                _ = target.Attribute(attribute, flag ? "true" : "false");
            else if (value is not null)
                _ = target.Attribute(attribute, Convert.ToString(value, CultureInfo.InvariantCulture) ?? "");
        }, [WebDomOperation.Attribute(attribute, "[data-ui-items-host]")]);
    }

    private static void ApplyHostProperties(WebRenderContext context, IHtmlElementBuilder host)
    {
        _ = RenderProperty<UIScrollMode?>(context, host, ItemsViewComponent.HorizontalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = target.Class(WebClassNames.ScrollX(scrollMode));
        }, [WebDomOperation.Class("[data-ui-items-host]", WebDomConverters.ScrollXClass)]);

        _ = RenderProperty<UIScrollMode?>(context, host, ItemsViewComponent.VerticalScrollProperty, static (target, value) =>
        {
            if (value is UIScrollMode scrollMode)
                _ = target.Class(WebClassNames.ScrollY(scrollMode));
        }, [WebDomOperation.Class("[data-ui-items-host]", WebDomConverters.ScrollYClass)]);

        _ = RenderProperty<UIScrollSnapMode?>(context, host, ItemsViewComponent.ScrollSnapProperty, static (target, value) =>
        {
            if (value is UIScrollSnapMode scrollSnap)
                _ = target.Class(WebClassNames.ScrollSnap(scrollSnap));
        }, [WebDomOperation.Class("[data-ui-items-host]", WebDomConverters.ScrollSnapClass)]);

        // The enum name, not a lowercased form — same rule as ScrollContainerComponentRenderer: a patched
        // value arrives as the name, and ScrollAnchorEngine compares the attribute against it.
        _ = RenderProperty<UIScrollAnchor?>(context, host, ItemsViewComponent.ScrollAnchorProperty, static (target, value) =>
        {
            if (value is UIScrollAnchor anchor)
                _ = target.Attribute("data-ui-scroll-anchor", anchor.ToString());
        }, [WebDomOperation.Attribute("data-ui-scroll-anchor", "[data-ui-items-host]")]);
    }
}
