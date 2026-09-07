using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Layouts;

namespace NE.Standard.UI.Web.Renderers.Items;

/// <summary>
/// Renders a table as one grid: the header row and the rows' host are subgrids of the root, so a header cell and the cells under
/// it share a track whatever their content, while the host alone scrolls. A row is a composite of one slot per column.
/// </summary>
/// <remarks>
/// Open, and its writers virtual, so a package's grid over <see cref="TableComponent{T}"/> renders through this one rather than a
/// copy of it.
/// </remarks>
public class TableComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The authored track list; a viewer's resized columns sit over it in the stylesheet's chain.</summary>
    public const string ColumnsVariable = "--ui-table-columns";

    protected const string HeaderClassName = "ui-table__header";
    protected const string HeaderCellClassName = "ui-table__header-cell";
    protected const string CaptionClassName = "ui-table__caption";
    protected const string ResizerClassName = "ui-table__resizer";
    protected const string HostClassName = "ui-table__host";
    protected const string RowClassName = "ui-table__row";
    protected const string CellClassName = "ui-table__cell";

    public override string ComponentTypeKey => TableComponent.ComponentTypeKey;

    protected override string ClassName => "ui-table";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("role", "table");

        SurfaceStyleRenderer.RenderSurface(context, root, ISurfaceStyleComponent.SurfaceProperty);
        BorderStyleRenderer.RenderBorderStyle(context, root);
        RenderFlags(context, root);
        RenderSelection(context, root);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        IReadOnlyList<UITableColumn> columns = ResolveColumns(context);

        RenderTracks(root, columns);
        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, composite: CreateComposite(columns));
        RegisterItemsFilterSortMetadata(context);
        RenderHeader(context, root, columns);
        RenderRows(context, root, columns);
    }

    /// <summary>The six switches, each a modifier the stylesheet reads; a bound one flips live.</summary>
    protected virtual void RenderFlags(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderFlagClass(context, root, TableComponent.ShowHeaderProperty, "ui-table--no-header", WebValueCondition.IsFalse);
        RenderFlagClass(context, root, TableComponent.StripedProperty, "ui-table--striped");
        RenderFlagClass(context, root, TableComponent.ShowColumnSeparatorsProperty, "ui-table--column-lines");
        RenderFlagClass(context, root, TableComponent.ShowRowSeparatorsProperty, "ui-table--no-separators", WebValueCondition.IsFalse);
        RenderFlagClass(context, root, IRowHoverableComponent.RowHoverableProperty, "ui-table--row-hover");
        RenderFlagClass(context, root, TableComponent.ResizableColumnsProperty, "ui-table--resizable");
    }

    protected static IReadOnlyList<UITableColumn> ResolveColumns(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        _ = ResolveRenderValue(context, TableComponent.ColumnsProperty, out IReadOnlyList<UITableColumn>? columns, out _);

        return columns ?? [];
    }

    /// <summary>The authored tracks as a variable on the root, and the bounds the resize handle clamps to.</summary>
    protected virtual void RenderTracks(IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(columns);

        if (columns.Count == 0)
            return;

        List<UIGridUnit> units = new(columns.Count);

        for (var i = 0; i < columns.Count; i++)
            units.Add(columns[i].Width);

        _ = root.Style(ColumnsVariable, ContainerComponentRenderer.ToCssGridTemplate(units));

        var limits = WebCssValues.GridTrackLimits(units);

        if (limits.Length > 0)
            _ = root.Attribute(WebAttributes.ColumnLimits, limits);
    }

    /// <summary>The client mirror of <see cref="RenderRow"/>: one slot per column, in the column's cell.</summary>
    protected virtual WebRenderItemsCompositeMetadata CreateComposite(IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(columns);

        WebRenderItemsCompositeSlotMetadata[] slots = new WebRenderItemsCompositeSlotMetadata[columns.Count];

        for (var i = 0; i < columns.Count; i++)
            slots[i] = new WebRenderItemsCompositeSlotMetadata { VariantKey = columns[i].TemplateKey, WrapperClassName = CellClass(columns[i]), WrapperRole = "cell" };

        return new WebRenderItemsCompositeMetadata { ItemClassName = RowClassName, ItemRole = "row", HostSlotVariantKey = TemplateNames.Row, Slots = slots };
    }

    /// <summary>The cell's class with its alignment modifier; the header cell of the same column wears the same modifier.</summary>
    protected virtual string CellClass(UITableColumn column)
    {
        ArgumentNullException.ThrowIfNull(column);

        return column.Alignment switch
        {
            UITextAlignment.Center => $"{CellClassName} {CellClassName}--center",
            UITextAlignment.End => $"{CellClassName} {CellClassName}--end",
            _ => CellClassName
        };
    }

    /// <summary>The captions, always rendered so a bound <c>ShowHeader</c> can show them later; each cell ends in the handle that sizes its column.</summary>
    protected virtual void RenderHeader(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(columns);

        _ = root.Element("div", header =>
        {
            _ = header.Class(HeaderClassName);
            _ = header.Attribute("role", "row");

            for (var i = 0; i < columns.Count; i++)
                RenderHeaderCell(context, header, columns[i], i);
        });
    }

    /// <summary>One caption cell: its alignment modifier, the caption, and the resize handle carrying the column's index.</summary>
    protected virtual void RenderHeaderCell(WebRenderContext context, IHtmlElementBuilder header, UITableColumn column, int index)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(header);
        ArgumentNullException.ThrowIfNull(column);

        _ = header.Element("div", cell =>
        {
            _ = cell.Class(HeaderCellClassName);
            _ = cell.Attribute("role", "columnheader");

            if (column.Alignment == UITextAlignment.Center)
                _ = cell.Class($"{HeaderCellClassName}--center");
            else if (column.Alignment == UITextAlignment.End)
                _ = cell.Class($"{HeaderCellClassName}--end");

            _ = cell.Element("span", caption =>
            {
                _ = caption.Class(CaptionClassName);

                if (!string.IsNullOrEmpty(column.Caption))
                    _ = caption.Text(context.Translate(column.Caption));
            });

            _ = cell.Element("div", resizer =>
            {
                _ = resizer.Class(ResizerClassName);
                _ = resizer.Attribute("role", "separator");
                _ = resizer.Attribute("tabindex", "0");
                _ = resizer.Attribute("aria-orientation", "vertical");
                _ = resizer.Attribute("aria-label", context.Translate(UIStrings.TableResizeColumn));
                _ = resizer.Attribute(WebAttributes.TableColumn, index.ToString(CultureInfo.InvariantCulture));
            });
        });
    }

    /// <summary>Renders the rows into an inner host, the element that scrolls; the client's lookup searches descendants only, so the root cannot be it.</summary>
    protected virtual void RenderRows(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(columns);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        UIItemsHostMode hostMode = ResolveHostMode(context);

        RenderItemsHost(context, root, HostClassName, items, isBound, RowClassName, configureHost: host =>
        {
            _ = host.Attribute("role", "rowgroup");

            ApplyHostScroll(context, host);
            ApplyHostMode(host, hostMode);
            ApplyWindowProperties(context, host, hostMode);
            RenderSelectedKeys(context, host);
        }, renderItems: host =>
        {
            HashSet<string> selected = ResolveSelectedKeys(context);
            var virtualized = hostMode == UIItemsHostMode.Virtualized;

            // A virtualized table hands the client every value and only the first rows; the client draws the rest from them.
            RegisterServerRenderedItemValues(context, items, always: virtualized);

            var count = virtualized && items.Count > VirtualizedFirstPaintRows ? VirtualizedFirstPaintRows : items.Count;

            for (var i = 0; i < count; i++)
                RenderRow(context, host, items[i], columns, selected);
        });
    }

    protected virtual void RenderRow(WebRenderContext context, IHtmlElementBuilder host, object? item, IReadOnlyList<UITableColumn> columns, HashSet<string> selected)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(columns);

        _ = host.Element("div", row =>
        {
            _ = row.Class(RowClassName);
            _ = row.Attribute("role", "row");

            StampTemplateSlotAsHost(context, row, item, TemplateNames.Row);
            RenderStampedRowAbilities(context, row, item);
            MarkSelected(row, item, selected);

            for (var i = 0; i < columns.Count; i++)
                RenderNamedTemplateSlot(context, row, item, columns[i].TemplateKey, CellClass(columns[i]), role: "cell");
        });
    }
}
