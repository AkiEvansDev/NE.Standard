using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>Renders a row per item, each with the three fixed named slots key, value and action.</summary>
public sealed class KeyValueActionComponentRenderer : ItemsCollectionRendererBase
{
    private const string RowClassName = "ui-key-value-action__row";
    private const string KeyClassName = "ui-key-value-action__key";
    private const string ValueClassName = "ui-key-value-action__value";
    private const string ActionClassName = "ui-key-value-action__action";
    private const string ValueInputClassName = "ui-key-value-action__value-input";
    private const string EditActionClassName = "ui-key-value-action__edit-action";
    private const string EditableClassName = "ui-key-value-action--editable";

    // The client mirror of RenderRow below; hoisted rather than built per render (CA1861).
    private static readonly WebRenderItemsCompositeMetadata CompositeItem = new()
    {
        ItemClassName = RowClassName,
        HostSlotVariantKey = TemplateNames.Row,
        Slots =
        [
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Key, WrapperClassName = KeyClassName },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Value, WrapperClassName = ValueClassName },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Action, WrapperClassName = ActionClassName }
        ]
    };

    // An editable row: the same three, plus the input the value becomes and the pair the action becomes, each laid into the cell it
    // stands in for; the input's slot takes a typed variant the row names.
    private static readonly WebRenderItemsCompositeMetadata EditableCompositeItem = new()
    {
        ItemClassName = RowClassName,
        HostSlotVariantKey = TemplateNames.Row,
        Slots =
        [
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Key, WrapperClassName = KeyClassName },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Value, WrapperClassName = ValueClassName },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.ValueInput, WrapperClassName = ValueInputClassName, VariantKeyPropertyName = nameof(IKeyValueActionModel.InputTemplate) },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Action, WrapperClassName = ActionClassName },
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.EditAction, WrapperClassName = EditActionClassName }
        ]
    };

    public override string ComponentTypeKey => KeyValueActionComponent.ComponentTypeKey;

    protected override string ClassName => "ui-key-value-action";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        OverflowStyleRenderer.RenderOverflow(context, root);

        RenderFlagClass(context, root, KeyValueActionComponent.ShowRowSeparatorsProperty, "ui-key-value-action--no-separators", WebValueCondition.IsFalse);
        RenderFlagClass(context, root, KeyValueActionComponent.StretchValueProperty, "ui-key-value-action--no-stretch", WebValueCondition.IsFalse);
        RenderFlagClass(context, root, KeyValueActionComponent.ShowActionsProperty, "ui-key-value-action--no-actions", WebValueCondition.IsFalse);

        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        RenderFlagClass(context, root, IRowHoverableComponent.RowHoverableProperty, "ui-key-value-action--row-hover");

        _ = ResolveRenderValue(context, KeyValueActionComponent.EditableProperty, out bool? editable, out _);

        if (editable == true)
            _ = root.Class(EditableClassName);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, composite: editable == true ? EditableCompositeItem : CompositeItem);
        RegisterItemsFilterSortMetadata(context);

        RenderRows(context, root, editable == true);
    }

    /// <summary>Renders the rows into an inner host; the client's lookup searches descendants only, so the root cannot be it.</summary>
    private static void RenderRows(WebRenderContext context, IHtmlElementBuilder root, bool editable)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-key-value-action__host", items, isBound, RowClassName, renderItems: host =>
        {
            RegisterServerRenderedItemValues(context, items);

            for (var i = 0; i < items.Count; i++)
                RenderRow(context, host, items[i], editable);
        });
    }

    private static void RenderRow(WebRenderContext context, IHtmlElementBuilder host, object? item, bool editable)
    {
        _ = host.Element("div", row =>
        {
            _ = row.Class(RowClassName);

            StampTemplateSlotAsHost(context, row, item, TemplateNames.Row);
            RenderStampedRowAbilities(context, row, item);

            // The row template is stamped, not rendered, so the flag it carries is written here under the slot's own context.
            if (editable && ForStampedSlot(context, row, item, TemplateNames.Row) is WebRenderContext rowContext)
                DefaultRowTemplateRenderer.RenderEditing(rowContext, row);

            RenderNamedTemplateSlot(context, row, item, TemplateNames.Key, KeyClassName);
            RenderNamedTemplateSlot(context, row, item, TemplateNames.Value, ValueClassName);

            if (editable)
                RenderNamedTemplateSlot(context, row, item, TemplateNames.ValueInput, ValueInputClassName, nameof(IKeyValueActionModel.InputTemplate));

            RenderNamedTemplateSlot(context, row, item, TemplateNames.Action, ActionClassName);

            if (editable)
                RenderNamedTemplateSlot(context, row, item, TemplateNames.EditAction, EditActionClassName);
        });
    }
}
