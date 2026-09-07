using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A caption strip over pages rendered from a collection, both halves out of one item template.</summary>
public sealed class TabsViewComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-tabs-view__item";

    public override string ComponentTypeKey => TabsViewComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs-view";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        // The same attribute the plain variant uses, so one client engine drives both.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TabsSelected);
        _ = RenderProperty<string?>(context, root, TabsViewComponent.SelectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.TabsSelected, value);
        }, [WebDomOperation.Attribute(WebAttributes.TabsSelected, target: "root")]);

        // The switches: the engine reads the attributes, the stylesheet the class. Removable refused for the whole strip means
        // no caption shows a close and the strip keeps no room for one.
        RenderFlagAttribute(context, root, TabsViewComponent.RenamableProperty, WebAttributes.TabsRenamable);
        RenderFlagAttribute(context, root, TabsViewComponent.DraggableProperty, WebAttributes.TabsDraggable);
        RenderFlagAttribute(context, root, TabsViewComponent.RemovableProperty, WebAttributes.TabsUnremovable, WebValueCondition.IsFalse);
        RenderFlagClass(context, root, TabsViewComponent.ShowOverflowProperty, "ui-tabs-view--no-overflow", WebValueCondition.IsFalse);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);

        // Outside the items host, whose children are the items alone; the stylesheet stands it at the strip's end.
        RenderTabOverflowButton(context, root);
    }

    /// <summary>Tabs live in an inner host: the client resolves one with a <c>querySelector</c> over descendants only.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-tabs-view__host", items, isBound, ItemClassName, configureHost: host => host.Attribute("role", "tablist"));
    }
}
