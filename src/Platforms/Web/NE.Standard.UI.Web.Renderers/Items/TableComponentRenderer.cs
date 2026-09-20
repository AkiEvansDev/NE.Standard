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
/// Renders a table as one grid: the header row and the rows' host are subgrids sharing tracks, while only the host scrolls. A row
/// is a composite of one slot per column.
/// </summary>
/// <remarks>
/// Open, with virtual writers, so a package's grid over <see cref="TableComponent{T}"/> renders through this one rather than a copy.
/// </remarks>
public class TableComponentRenderer : ItemsCollectionRendererBase
{
    /// <summary>The authored track list; a viewer's resized columns sit over it in the stylesheet's chain.</summary>
    public const string ColumnsVariable = "--ui-table-columns";

    /// <summary>The prefix of the variables the columns engine writes on the root: where a pinned column after the first sticks, in pixels.</summary>
    public const string PinVariablePrefix = "--ui-table-pin-";

    /// <summary>What the host's viewport attribute says when the box around it scrolls for it.</summary>
    public const string ParentViewport = "parent";

    /// <summary>The box that holds the table proper — the tracks, the frame, the ground — and scrolls; the root holds it and the chrome around it.</summary>
    protected const string ScrollClassName = "ui-table__scroll";

    protected const string HeaderClassName = "ui-table__header";
    protected const string HeaderCellClassName = "ui-table__header-cell";
    protected const string CaptionClassName = "ui-table__caption";
    protected const string ResizerClassName = "ui-table__resizer";
    protected const string HostClassName = "ui-table__host";
    protected const string RowClassName = "ui-table__row";
    protected const string CellClassName = "ui-table__cell";
    protected const string PinnedModifier = "--pinned";
    protected const string PinnedEdgeModifier = "--pinned-edge";

    public override string ComponentTypeKey => TableComponent.ComponentTypeKey;

    protected override string ClassName => "ui-table";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("role", "table");

        RenderFlags(context, root);
        RenderWideMode(context, root);
        RenderSelection(context, root);
        SelectionStyleRenderer.RenderSelectionStyle(context, root);

        IReadOnlyList<UITableColumn> columns = ResolveColumns(context);
        // Once per render: the same slots draw every server row and tell the client how to draw its own.
        WebRenderItemsCompositeMetadata composite = CreateComposite(columns);

        RenderTracks(root, columns);
        RenderTemplates(context, root);
        RegisterItemsTemplateMetadata(context, composite: composite);
        RegisterItemsFilterSortMetadata(context);

        RenderOverTable(context, root, columns);

        _ = root.Element("div", scroll =>
        {
            _ = scroll.Class(ScrollClassName);

            // The frame and the ground belong to the scrolling box, not the root, so what a package draws over/under the table
            // (a grid's band, its pager) stands beside the frame, not inside it.
            SurfaceStyleRenderer.RenderSurface(context, scroll, ISurfaceStyleComponent.SurfaceProperty);
            BorderStyleRenderer.RenderBorderStyle(context, scroll);

            RenderHeader(context, scroll, columns);
            RenderRows(context, scroll, columns, composite);
        });

        RenderUnderTable(context, root, columns);
    }

    /// <summary>The seven switches, each a modifier the stylesheet reads; a bound one flips live.</summary>
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
        RenderFlagClass(context, root, TableComponent.ReorderableColumnsProperty, "ui-table--reorderable");
    }

    /// <summary>
    /// The root's class sets the scroll mode so the box scrolls both axes and the header moves with the rows; static here since
    /// live changes ride on the host's property instead.
    /// </summary>
    private static void RenderWideMode(WebRenderContext context, IHtmlElementBuilder root)
    {
        if (ResolveHorizontalScroll(context) is UIScrollMode mode)
            _ = root.Class(WebClassNames.ScrollX(mode));
    }

    private static UIScrollMode? ResolveHorizontalScroll(WebRenderContext context)
    {
        _ = ResolveRenderValue(context, IScrollableComponent.HorizontalScrollProperty, out UIScrollMode? mode, out _);

        return mode;
    }

    /// <summary>The columns the table draws: the authored ones, and whatever a package puts among them — a grid's column of checkboxes.</summary>
    protected virtual IReadOnlyList<UITableColumn> ResolveColumns(WebRenderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        _ = ResolveRenderValue(context, TableComponent.ColumnsProperty, out IReadOnlyList<UITableColumn>? columns, out _);

        return columns ?? [];
    }

    /// <summary>The client mirror of <see cref="RenderRow"/>: one slot per column, in the column's cell.</summary>
    protected virtual WebRenderItemsCompositeMetadata CreateComposite(IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(columns);

        WebRenderItemsCompositeSlotMetadata[] slots = new WebRenderItemsCompositeSlotMetadata[columns.Count];

        for (var i = 0; i < columns.Count; i++)
            slots[i] = new WebRenderItemsCompositeSlotMetadata { VariantKey = columns[i].TemplateKey, WrapperClassName = CellClasses(columns, i), WrapperRole = "cell", WrapperAttributes = CellAttributes(columns, i) };

        return new WebRenderItemsCompositeMetadata { ItemClassName = RowClassName, ItemRole = "row", HostSlotVariantKey = TemplateNames.Row, Slots = slots };
    }

    /// <summary>The cell's classes in its row: <see cref="CellClass"/>, and the edge modifier on the last pinned column, which draws the line the rest scroll under.</summary>
    protected string CellClasses(IReadOnlyList<UITableColumn> columns, int index)
    {
        ArgumentNullException.ThrowIfNull(columns);

        var classes = CellClass(columns[index]);

        return IsPinnedEdge(columns, index) ? $"{classes} {CellClassName}{PinnedEdgeModifier}" : classes;
    }

    /// <summary>The cell's class with its alignment modifier, and the pinned one; the header cell of the same column wears the same modifiers.</summary>
    protected virtual string CellClass(UITableColumn column)
    {
        ArgumentNullException.ThrowIfNull(column);

        var classes = column.Alignment switch
        {
            UITextAlignment.Center => $"{CellClassName} {CellClassName}--center",
            UITextAlignment.End => $"{CellClassName} {CellClassName}--end",
            _ => CellClassName
        };

        return column.Pinned ? $"{classes} {CellClassName}{PinnedModifier}" : classes;
    }

    /// <summary>Whether the column is the last pinned one.</summary>
    private static bool IsPinnedEdge(IReadOnlyList<UITableColumn> columns, int index)
        => columns[index].Pinned && (index == columns.Count - 1 || !columns[index + 1].Pinned);

    /// <summary>
    /// Per-cell attributes beside its classes: the column's index (for the stylesheet to hide it), and for a pinned column past the
    /// first, its offset variable (the width before it is resizable). A derived table adds its own.
    /// </summary>
    protected virtual IReadOnlyDictionary<string, string>? CellAttributes(IReadOnlyList<UITableColumn> columns, int index)
    {
        ArgumentNullException.ThrowIfNull(columns);

        Dictionary<string, string> attributes = new(2, StringComparer.Ordinal) { [WebAttributes.TableColumn] = index.ToString(CultureInfo.InvariantCulture) };

        if (columns[index].Pinned && index > 0)
            attributes["style"] = PinOffset(index);

        return attributes;
    }

    /// <summary>The inline rule that puts a pinned cell at its offset.</summary>
    private static string PinOffset(int index)
        => $"left:var({PinVariablePrefix}{index.ToString(CultureInfo.InvariantCulture)})";

    /// <summary>The authored tracks as a variable on the root, and the bounds the resize handle clamps to.</summary>
    protected virtual void RenderTracks(IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(root);
        ArgumentNullException.ThrowIfNull(columns);

        if (columns.Count == 0)
            return;

        List<UIGridUnit> units = new(columns.Count);
        List<UIGridUnit> tracks = new(columns.Count);

        for (var i = 0; i < columns.Count; i++)
        {
            units.Add(columns[i].Width);
            tracks.Add(ToColumnTrack(columns[i].Width));
        }

        _ = root.Style(ColumnsVariable, ContainerComponentRenderer.ToCssGridTemplate(tracks));

        // The splitter's bounds are the author's own, not the floor the track carries: a column may be dragged below the width it was given.
        var limits = WebCssValues.GridTrackLimits(units);

        if (limits.Length > 0)
            _ = root.Attribute(WebAttributes.ColumnLimits, limits);
    }

    /// <summary>
    /// A column's width is a floor and a share, not an exact size: an absolute width becomes a star with that width as its floor,
    /// so a hidden column's width redistributes rather than vanishing. A narrower table still scrolls past the floors.
    /// </summary>
    private static UIGridUnit ToColumnTrack(UIGridUnit width)
        => width is { Unit: UIGridUnitType.Absolute, Value: > 0 }
            ? UIGridUnit.Star(width.Value, min: width.Value)
            : width;

    /// <summary>What a package draws over the table and outside its frame — a grid's band of search and filters; nothing here.</summary>
    protected virtual void RenderOverTable(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
    }

    /// <summary>The captions, always rendered so a bound <c>ShowHeader</c> can show them later; each cell ends in the handle that sizes its column.</summary>
    protected virtual void RenderHeader(WebRenderContext context, IHtmlElementBuilder parent, IReadOnlyList<UITableColumn> columns)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(parent);
        ArgumentNullException.ThrowIfNull(columns);

        _ = parent.Element("div", header =>
        {
            _ = header.Class(HeaderClassName);
            _ = header.Attribute("role", "row");

            for (var i = 0; i < columns.Count; i++)
                RenderHeaderCell(context, header, columns, i);
        });
    }

    /// <summary>One caption cell: its alignment and pinned modifiers, then what <see cref="RenderHeaderCellContent"/> puts in it.</summary>
    protected virtual void RenderHeaderCell(WebRenderContext context, IHtmlElementBuilder header, IReadOnlyList<UITableColumn> columns, int index)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(header);
        ArgumentNullException.ThrowIfNull(columns);

        UITableColumn column = columns[index];

        _ = header.Element("div", cell =>
        {
            _ = cell.Class(HeaderCellClassName);
            _ = cell.Attribute("role", "columnheader");

            if (column.Alignment == UITextAlignment.Center)
                _ = cell.Class($"{HeaderCellClassName}--center");
            else if (column.Alignment == UITextAlignment.End)
                _ = cell.Class($"{HeaderCellClassName}--end");

            // The column's index, key and tier, for the columns engine that hides it and the stylesheet that reads the index.
            _ = cell.Attribute(WebAttributes.TableColumn, index.ToString(CultureInfo.InvariantCulture));
            _ = cell.Attribute(WebAttributes.TableColumnKey, column.Key);

            if (column.Fixed)
                _ = cell.Attribute(WebAttributes.TableFixed);

            if (column.HideBelow is UIResponsiveTier tier)
                _ = cell.Attribute(WebAttributes.TableHideBelow, tier.ToString().ToLowerInvariant());

            RenderPinned(cell, HeaderCellClassName, columns, index);
            RenderHeaderCellContent(context, cell, column, index);
        });
    }

    /// <summary>The pinned modifiers and the offset on a cell that is not a slot wrapper — a header cell, a package's footer cell.</summary>
    protected static void RenderPinned(IHtmlElementBuilder cell, string className, IReadOnlyList<UITableColumn> columns, int index)
    {
        ArgumentNullException.ThrowIfNull(cell);
        ArgumentNullException.ThrowIfNull(columns);

        if (!columns[index].Pinned)
            return;

        _ = cell.Class($"{className}{PinnedModifier}");

        if (IsPinnedEdge(columns, index))
            _ = cell.Class($"{className}{PinnedEdgeModifier}");

        if (index > 0)
            _ = cell.Attribute("style", PinOffset(index));
    }

    /// <summary>The caption and the resize handle; a grid puts its own marks and attributes between them.</summary>
    protected virtual void RenderHeaderCellContent(WebRenderContext context, IHtmlElementBuilder cell, UITableColumn column, int index)
    {
        RenderCaption(context, cell, column);
        RenderResizer(context, cell, column, index);
    }

    protected static void RenderCaption(WebRenderContext context, IHtmlElementBuilder cell, UITableColumn column)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(cell);
        ArgumentNullException.ThrowIfNull(column);

        _ = cell.Element("span", caption =>
        {
            _ = caption.Class(CaptionClassName);

            if (!string.IsNullOrEmpty(column.Caption))
                _ = caption.Text(context.Translate(column.Caption));
        });
    }

    /// <summary>The handle that sizes the column, carrying the column's index for the client; a fixed column is the control's own and carries none.</summary>
    protected static void RenderResizer(WebRenderContext context, IHtmlElementBuilder cell, UITableColumn column, int index)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(cell);
        ArgumentNullException.ThrowIfNull(column);

        if (column.Fixed)
            return;

        _ = cell.Element("div", resizer =>
        {
            _ = resizer.Class(ResizerClassName);
            _ = resizer.Attribute("role", "separator");
            _ = resizer.Attribute("tabindex", "0");
            _ = resizer.Attribute("aria-orientation", "vertical");
            _ = resizer.Attribute("aria-label", context.Translate(UIStrings.TableResizeColumn));
            _ = resizer.Attribute(WebAttributes.TableColumn, index.ToString(CultureInfo.InvariantCulture));
        });
    }

    /// <summary>Renders the rows into an inner host, the element that scrolls; the client's lookup searches descendants only, so the box cannot be it.</summary>
    protected virtual void RenderRows(WebRenderContext context, IHtmlElementBuilder parent, IReadOnlyList<UITableColumn> columns, WebRenderItemsCompositeMetadata composite)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(parent);
        ArgumentNullException.ThrowIfNull(columns);
        ArgumentNullException.ThrowIfNull(composite);

        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        UIItemsHostMode hostMode = ResolveHostMode(context);

        RenderItemsHost(context, parent, HostClassName, items, isBound, RowClassName, configureHost: host =>
        {
            _ = host.Attribute("role", "rowgroup");

            // A wide table's box is the scroller (RenderWideMode); the host says so for the engines that read the scroll, and the root's
            // class follows the same property live.
            if (ResolveHorizontalScroll(context) is UIScrollMode.Auto or UIScrollMode.Always)
                _ = host.Attribute(WebAttributes.HostViewport, ParentViewport);

            ApplyHostScroll(context, host, WebDomOperation.Class("root", WebDomConverters.ScrollXClass), WebDomOperation.Attribute(WebAttributes.HostViewport, $"[{WebAttributes.ItemsHost}]", WebDomConverters.HostViewport));
            ApplyHostMode(host, hostMode);
            ApplyWindowProperties(context, host, hostMode);
            RenderSelectedKeys(context, host);
            ConfigureHost(context, host);
        }, renderItems: host =>
        {
            HashSet<string> selected = ResolveSelectedKeys(context);
            var virtualized = hostMode == UIItemsHostMode.Virtualized;

            // A virtualized table hands the client every value and only the first rows; the client draws the rest from them.
            RegisterServerRenderedItemValues(context, items, always: virtualized || PublishItemValues);

            var count = virtualized && items.Count > VirtualizedFirstPaintRows ? VirtualizedFirstPaintRows : items.Count;

            for (var i = 0; i < count; i++)
                RenderRow(context, host, items[i], composite, selected);
        });
    }

    /// <summary>What a derived table writes on the host beside the table's own — a grid's paged window; nothing here.</summary>
    protected virtual void ConfigureHost(WebRenderContext context, IHtmlElementBuilder host)
    {
    }

    /// <summary>
    /// Whether a static table hands the client every row's value with no rule to read it — needed when a grid sorts client-side
    /// on values with no authored rule.
    /// </summary>
    protected virtual bool PublishItemValues => false;

    /// <summary>One row: the slots of <paramref name="composite"/>, each in its cell, as the client draws a row of its own.</summary>
    protected virtual void RenderRow(WebRenderContext context, IHtmlElementBuilder host, object? item, WebRenderItemsCompositeMetadata composite, HashSet<string> selected)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(host);
        ArgumentNullException.ThrowIfNull(composite);

        _ = host.Element("div", row =>
        {
            _ = row.Class(RowClassName);
            _ = row.Attribute("role", "row");

            StampTemplateSlotAsHost(context, row, item, TemplateNames.Row);
            RenderStampedRowAbilities(context, row, item);
            MarkSelected(row, item, selected);

            for (var i = 0; i < composite.Slots.Count; i++)
            {
                WebRenderItemsCompositeSlotMetadata slot = composite.Slots[i];

                RenderNamedTemplateSlot(context, row, item, slot.VariantKey, slot.WrapperClassName, slot.VariantKeyPropertyName, slot.WrapperRole, slot.WrapperAttributes);
            }
        });
    }

    /// <summary>What a package draws under the table and outside its frame — a grid's pager; nothing here.</summary>
    protected virtual void RenderUnderTable(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<UITableColumn> columns)
    {
    }
}
