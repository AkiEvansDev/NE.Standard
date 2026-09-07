using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>
/// Renders a tree as a list of rows, each a composite of the row template and the node's face chosen by its kind. The depth
/// and the fold are written here for the first paint from the nodes' parent keys; the client derives them again after every
/// change and lays the viewer's own fold over them.
/// </summary>
public sealed class TreeComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The step between levels, unitless: the stylesheet multiplies it into pixels.</summary>
    public const string IndentVariable = "--ui-tree-indent";

    /// <summary>A row's level from the root, unitless, on the row.</summary>
    public const string DepthVariable = "--ui-tree-depth";

    private const string HostClassName = "ui-tree__host";
    private const string RowClassName = "ui-tree__row";
    private const string FoldedClassName = "ui-tree__row--folded";
    private const string NodeClassName = "ui-tree__node";

    // The client mirror of RenderRow below: the row template as the row's identity, the node's face in one slot chosen by kind.
    private static readonly WebRenderItemsCompositeMetadata CompositeItem = new()
    {
        ItemClassName = RowClassName,
        ItemRole = "treeitem",
        HostSlotVariantKey = TemplateNames.Row,
        Slots =
        [
            new WebRenderItemsCompositeSlotMetadata { VariantKey = TemplateNames.Node, WrapperClassName = NodeClassName, VariantKeyPropertyName = nameof(ITreeNodeModel.Kind) }
        ]
    };

    public override string ComponentTypeKey => TreeComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tree";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("role", "tree");

        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);
        BorderStyleRenderer.RenderBorderStyle(context, root);

        _ = RenderProperty<double?>(context, root, TreeComponent.IndentProperty, static (target, value) =>
        {
            if (value is double indent && indent >= 0)
                _ = target.Style(IndentVariable, indent.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Style(IndentVariable)]);

        // The switches: the engine reads the attributes, the stylesheet the classes.
        RenderFlagAttribute(context, root, TreeComponent.RenamableProperty, WebAttributes.TreeRenamable);
        RenderFlagAttribute(context, root, TreeComponent.RenameOnDoubleClickProperty, WebAttributes.TreeRenameOnDoubleClick);
        RenderFlagAttribute(context, root, TreeComponent.DraggableProperty, WebAttributes.TreeDraggable);
        RenderFlagAttribute(context, root, TreeComponent.RemovableProperty, WebAttributes.TreeUnremovable, WebValueCondition.IsFalse);
        RenderFlagClass(context, root, IRowHoverableComponent.RowHoverableProperty, "ui-tree--row-hover");
        RenderFlagClass(context, root, TreeComponent.ShowFoldChevronProperty, "ui-tree--no-chevron", WebValueCondition.IsFalse);

        // The tree takes the focus whatever it chooses: the arrows fold and walk its rows.
        RenderSelection(context, root, focusable: true);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);
        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, composite: CompositeItem);
        RegisterItemsFilterSortMetadata(context);
        RenderRows(context, root);
    }

    /// <summary>Renders the rows into an inner host, the element that scrolls; the client's lookup searches descendants only, so the root cannot be it.</summary>
    private static void RenderRows(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, HostClassName, items, isBound, RowClassName, configureHost: host =>
        {
            _ = host.Attribute("role", "presentation");

            ApplyHostScroll(context, host);
            RenderSelectedKeys(context, host);
        }, renderItems: host =>
        {
            HashSet<string> selected = ResolveSelectedKeys(context);

            RegisterServerRenderedItemValues(context, items);

            // Depth and fold in one walk: the list is in walking order, so a parent has been placed before its children.
            Dictionary<string, TreePlacement> placed = new(StringComparer.Ordinal);

            for (var i = 0; i < items.Count; i++)
                RenderRow(context, host, items[i], placed, selected);
        });
    }

    /// <summary>Where a placed node stands: its level, whether it is on screen, and whether it is unfolded as authored.</summary>
    private readonly record struct TreePlacement(int Depth, bool Shown, bool Expanded);

    private static void RenderRow(WebRenderContext context, IHtmlElementBuilder host, object? item, Dictionary<string, TreePlacement> placed, HashSet<string> selected)
    {
        ITreeNodeModel? node = item as ITreeNodeModel;
        var expanded = node?.Expanded == true;
        var depth = 0;
        var shown = true;

        if (node?.ParentId is { Length: > 0 } parentId && placed.TryGetValue(parentId, out TreePlacement parent))
        {
            depth = parent.Depth + 1;
            shown = parent.Shown && parent.Expanded;
        }

        if (item is IBindableItem { Id: { Length: > 0 } id })
            placed[id] = new TreePlacement(depth, shown, expanded);

        _ = host.Element("div", row =>
        {
            _ = row.Class(RowClassName);
            _ = row.Attribute("role", "treeitem");
            _ = row.Attribute("aria-level", (depth + 1).ToString(CultureInfo.InvariantCulture));
            _ = row.Style(DepthVariable, depth.ToString(CultureInfo.InvariantCulture));

            if (!shown)
                _ = row.Class(FoldedClassName);

            // Only a node that says so is expandable here; one merely followed by children is found out by the client's walk.
            if (node?.HasChildren == true)
                _ = row.Attribute("aria-expanded", expanded ? "true" : "false");

            StampTemplateSlotAsHost(context, row, item, TemplateNames.Row);
            RenderStampedRowAbilities(context, row, item);
            MarkSelected(row, item, selected);

            RenderNamedTemplateSlot(context, row, item, TemplateNames.Node, NodeClassName, nameof(ITreeNodeModel.Kind));
        });
    }
}
