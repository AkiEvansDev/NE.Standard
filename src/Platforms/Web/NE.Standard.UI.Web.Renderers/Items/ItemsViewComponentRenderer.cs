using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Regions;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

public sealed class ItemsViewComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-items-view__item";

    // What a row may be drawn from and still be an option: words, marks, pictures and the boxes they stand in.
    private static readonly FrozenSet<string> PassiveTypeKeys = new[]
    {
        TextComponent.ComponentTypeKey, ParagraphComponent.ComponentTypeKey, IconComponent.ComponentTypeKey, BadgeComponent.ComponentTypeKey,
        ImageComponent.ComponentTypeKey, SeparatorComponent.ComponentTypeKey, SpinnerComponent.ComponentTypeKey, ProgressComponent.ComponentTypeKey,
        ContainerComponent.ComponentTypeKey, StackPanelComponent.ComponentTypeKey, WrapPanelComponent.ComponentTypeKey, SurfaceComponent.ComponentTypeKey,
        CardComponent.ComponentTypeKey, CardHeaderRegion.ComponentTypeKey, DefaultTextTemplate.ComponentTypeKey, DefaultEmptyTemplate.ComponentTypeKey,
        DefaultGroupTemplate.ComponentTypeKey
    }.ToFrozenSet(StringComparer.Ordinal);

    public override string ComponentTypeKey => ItemsViewComponent.ComponentTypeKey;

    protected override string ClassName => "ui-items-view";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderLayout(context, root, ItemsViewComponent.LayoutTypeProperty, ItemsViewComponent.OrientationProperty, ItemsViewComponent.SpacingProperty);
        RenderSelection(context, root);

        // An option may hold no control of its own, so rows with buttons or fields are a list's items whatever the selection.
        var listbox = RenderSelectableRole(context, root) && !RowsHoldControls(context);

        _ = root.Attribute("role", listbox ? "listbox" : "list");

        SelectionStyleRenderer.RenderSelectionStyle(context, root);
        RenderFlagClass(context, root, IRowHoverableComponent.RowHoverableProperty, "ui-items-view--row-hover");
        RenderFlagClass(context, root, IEmptyStateComponent.ShowEmptyTemplateProperty, "ui-items-view--no-empty", WebValueCondition.IsFalse);
        RenderFlagAttribute(context, root, ItemsViewComponent.DraggableProperty, WebAttributes.RowsDraggable);
        RenderFlagAttribute(context, root, ItemsViewComponent.DragHandleProperty, WebAttributes.RowsDragHandle);
        RenderDragHandlePlacement(context, root, ItemsViewComponent.DragHandlePlacementProperty);
        RenderTemplates(context, root);

        var grip = DrawsRowGrip(context, ItemsViewComponent.DraggableProperty, ItemsViewComponent.DragHandleProperty);

        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName, rowDecorator: grip ? RowGripDecorator : null, itemWrapperRole: listbox ? "option" : "listitem", announcesSelection: listbox);
        RegisterItemsFilterSortMetadata(context);
        RenderItems(context, root, listbox, grip);
    }

    /// <summary>Whether a row template holds anything a press lands on — a button, a field, a link — rather than only words and pictures.</summary>
    private static bool RowsHoldControls(WebRenderContext context)
    {
        CompiledView view = context.ViewResolution.View;

        foreach (UIComponentSlot slot in context.Node.Slots)
        {
            if (slot.Kind is UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant && HoldsControl(view, slot.RootComponentId))
                return true;
        }

        return false;
    }

    private static bool HoldsControl(CompiledView view, UIComponentId componentId)
    {
        UIComponentNode node = view.Graph.GetRequired(componentId);

        if (!PassiveTypeKeys.Contains(node.TypeKey))
            return true;

        foreach (UIComponentId child in node.Children)
        {
            if (HoldsControl(view, child))
                return true;
        }

        // A right-click menu is a popup of its own, not a control inside the row.
        foreach (UIComponentSlot slot in node.Slots)
        {
            if (slot.Kind != UIComponentSlotKind.ContextMenu && HoldsControl(view, slot.RootComponentId))
                return true;
        }

        return false;
    }

    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root, bool listbox, bool grip)
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
            RenderItemList(context, host, items, ItemClassName, decorateItem: (itemRoot, item, index) =>
            {
                _ = itemRoot.Attribute("role", listbox ? "option" : "listitem");
                MarkSelected(itemRoot, item, selected, announce: listbox);
            }, appendItem: grip ? (itemRoot, _, _) => RenderRowGrip(context, itemRoot) : null, limit: virtualized ? VirtualizedFirstPaintRows : null, publishValues: virtualized);
        });
    }
}
