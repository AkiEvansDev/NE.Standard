using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
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
    private const string TablistClassName = WebClassNames.TabsViewTablist;

    private static readonly WebDomOperation[] TablistNameOperations = [WebDomOperation.Attribute("aria-label", target: "." + TablistClassName, converter: WebDomConverters.NonBlankText)];
    private static readonly WebDomOperation[] TabMenuEntriesOperations = [WebDomOperation.Attribute(WebAttributes.TabsMenu, converter: WebDomConverters.TabMenuEntriesAttribute)];

    public override string ComponentTypeKey => TabsViewComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.TabsView;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        TabsSelectionRenderer.RenderSelectedKey(context, root);

        // The switches: the engine reads the attributes, the stylesheet the class. Removable refused for the whole strip means no
        // caption shows a close, with no room reserved.
        RenderFlagAttribute(context, root, TabsViewComponent.RenamableProperty, WebAttributes.TabsRenamable);
        RenderFlagAttribute(context, root, TabsViewComponent.DraggableProperty, WebAttributes.TabsDraggable);
        RenderFlagAttribute(context, root, TabsViewComponent.RemovableProperty, WebAttributes.TabsUnremovable, WebValueCondition.IsFalse);
        RenderFlagClass(context, root, TabsViewComponent.ShowOverflowProperty, WebClassNames.TabsViewNoOverflow, WebValueCondition.IsFalse);
        RenderEmptyStateSwitch(context, root);

        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderTablist(context, root);
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

    /// <summary>
    /// The strip's tablist: a tab's caption and its page are one template's, side by side in the items host, so the tablist cannot
    /// wrap the captions alone; it owns their tabs instead (<c>aria-owns</c>, tabs-view-engine.ts), and no page or close is in it.
    /// </summary>
    private static void RenderTablist(WebRenderContext context, IHtmlElementBuilder root)
        => _ = root.Element("div", tablist =>
        {
            _ = tablist.Class(TablistClassName).Attribute("role", "tablist");

            RenderAccessibleName(context, tablist, TablistNameOperations);
        });

    /// <summary>
    /// Tabs live in an inner host: the client resolves one with a <c>querySelector</c> over descendants only. A strip none of whose tabs
    /// can be closed is marked, so it keeps no room for a close; tabs-view-engine.ts keeps the mark.
    /// </summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);
        var removable = false;

        RenderItemsHost(context, root, "ui-tabs-view__host", items, isBound, ItemClassName, appendItem: (row, item, _) => removable |= !RefusesRemoval(context, row, item));

        if (!removable)
            _ = root.Attribute(WebAttributes.TabsNoneRemovable);
    }

    /// <summary>Whether a tab may not be closed: its item says so, or its template's root does, as each writes it on the row or the tab.</summary>
    private static bool RefusesRemoval(WebRenderContext context, IHtmlElementBuilder row, object? item)
        => (item is IItemAbilitiesModel abilities && abilities.CanRemove == false)
            || ReadItemRootValue<bool?>(context, row, item, IItemAbilitiesComponent.CanRemoveProperty) == false;
}
