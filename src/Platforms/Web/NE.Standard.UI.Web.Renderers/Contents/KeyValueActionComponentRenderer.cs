using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Contents;

/// <summary>
/// A row per item, each with three fixed, named template slots ("key"/"value"/"action" —
/// <see cref="ItemsCollectionRendererBase.RenderNamedTemplateSlot"/>, not
/// <see cref="ItemsCollectionRendererBase.RenderItem"/>'s per-item template-key selection among
/// variants, since all three always apply together rather than one being chosen per item).
/// </summary>
public sealed class KeyValueActionComponentRenderer : ItemsCollectionRendererBase
{
    private const string RowClassName = "ui-key-value-action__row";
    private const string KeyClassName = "ui-key-value-action__key";
    private const string ValueClassName = "ui-key-value-action__value";
    private const string ActionClassName = "ui-key-value-action__action";

    // The client mirror of RenderRow below: which variants make up one row, in which wrappers, and which
    // one only lends the row element its compiled identity. Hoisted rather than built per render (CA1861).
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

    public override string ComponentTypeKey => KeyValueActionComponent.ComponentTypeKey;

    protected override string ClassName => "ui-key-value-action";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<bool?>(context, root, KeyValueActionComponent.ShowRowSeparatorsProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-key-value-action--no-separators");
        }, [WebDomOperation.ToggleClass("ui-key-value-action--no-separators", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, KeyValueActionComponent.StretchValueProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-key-value-action--no-stretch");
        }, [WebDomOperation.ToggleClass("ui-key-value-action--no-stretch", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, KeyValueActionComponent.ShowActionsProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-key-value-action--no-actions");
        }, [WebDomOperation.ToggleClass("ui-key-value-action--no-actions", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, KeyValueActionComponent.ShowBorderProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-key-value-action--no-border");
        }, [WebDomOperation.ToggleClass("ui-key-value-action--no-border", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, KeyValueActionComponent.RowHoverableProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-key-value-action--row-hover");
        }, [WebDomOperation.ToggleClass("ui-key-value-action--row-hover")]);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, composite: CompositeItem);
        RegisterItemsFilterSortMetadata(context);

        RenderRows(context, root);
    }

    /// <summary>
    /// Rows live in an inner host rather than directly under the root, mirroring
    /// <c>ItemsViewComponentRenderer</c>/<c>CommandBarComponentRenderer</c>: the client resolves a
    /// collection's host with <c>root.querySelector("[data-ui-items-host]")</c>, which searches
    /// descendants only, so a bound collection whose root *is* the container has nowhere to render into
    /// and silently stays empty.
    /// </summary>
    private static void RenderRows(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-key-value-action__host");
            _ = host.Attribute("data-ui-items-host");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RegisterServerRenderedItemValues(context, items);

            for (var i = 0; i < items.Count; i++)
                RenderRow(context, host, items[i]);
        });
    }

    private static void RenderRow(WebRenderContext context, IHtmlElementBuilder host, object? item)
    {
        _ = host.Element("div", row =>
        {
            _ = row.Class(RowClassName);

            StampTemplateSlotAsHost(context, row, item, TemplateNames.Row);

            RenderNamedTemplateSlot(context, row, item, TemplateNames.Key, KeyClassName);
            RenderNamedTemplateSlot(context, row, item, TemplateNames.Value, ValueClassName);
            RenderNamedTemplateSlot(context, row, item, TemplateNames.Action, ActionClassName);
        });
    }
}
