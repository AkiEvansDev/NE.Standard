using System;
using System.Collections.Generic;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A caption strip over pages rendered from a collection, both halves out of one item template.</summary>
public sealed class TabsViewComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-tabs-view__item";

    private static readonly WebDomOperation[] TabMenuEntriesOperations = [WebDomOperation.Attribute(WebAttributes.TabsMenu, converter: WebDomConverters.TabMenuEntriesAttribute)];

    public override string ComponentTypeKey => TabsViewComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tabs-view";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        TabsSelectionRenderer.RenderSelectedKey(context, root, TabsViewComponent.SelectedKeyProperty);

        // The switches: the engine reads the attributes, the stylesheet the class. Removable refused for the whole strip means no
        // caption shows a close, with no room reserved.
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

        RenderTabMenu(context, root);
    }

    /// <summary>
    /// The strip's tab menu, a named context menu its captions open, and the built-in entries chosen for it; the client leaves out
    /// what was not chosen or the tab it was opened on does not allow.
    /// </summary>
    private static void RenderTabMenu(WebRenderContext context, IHtmlElementBuilder root)
    {
        CompiledView view = context.ViewResolution.View;

        // A template with a menu of its own is the nearer owner and would always open first, so the strip draws none it never shows.
        if (!view.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Template, out UIComponentSlot? template)
            || view.Graph.TryGetSlot(template.RootComponentId, UIComponentSlotKind.ContextMenu, out _))
        {
            return;
        }

        _ = RenderProperty<UITabMenuEntries?>(context, root, TabsViewComponent.TabMenuEntriesProperty, static (target, value) =>
        {
            if (value is UITabMenuEntries entries && WebClassNames.TabMenuEntries(entries) is { Length: > 0 } tokens)
                _ = target.Attribute(WebAttributes.TabsMenu, tokens);
        }, TabMenuEntriesOperations);

        // The remove entry does what the tab's own close does, so it is offered only where that raises a command.
        if (view.Events.TryGet(new CompiledUIEventAddress(template.RootComponentId, EventNames.Remove), out _))
            _ = root.Attribute(WebAttributes.TabsRemoves);

        RenderContextMenuRegion(context, root, UITabMenu.Name, RegionNames.TabMenu);
    }

    /// <summary>Tabs live in an inner host: the client resolves one with a <c>querySelector</c> over descendants only.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-tabs-view__host", items, isBound, ItemClassName, configureHost: host => host.Attribute("role", "tablist"));
    }
}
