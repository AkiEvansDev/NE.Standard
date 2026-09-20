using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A table that shows the rows of a keyed collection under a header, one template per column, filtering and sorting by rule,
/// selecting and scrolling like an items view. Sorting by header, editing and paging are an add-on's.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IItemsHostComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
public abstract partial class TableComponent<T> : RowItemsComponentBase<T, IBindableItem, DefaultRowTemplate>, IItemsHostComponent, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent
    where T : TableComponent<T>, IUIComponentDefinition
{
    private static readonly UIThickness DefaultBorderThickness = UIThickness.Uniform(1);

    private readonly List<UITableColumn> _columns = [];

    /// <summary>
    /// Gets or sets the border thickness; the table draws an edge by default.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBorderedComponent), DefaultValueMember = nameof(DefaultBorderThickness))]
    public UIThickness? BorderThickness { get; set; }

    /// <summary>
    /// Gets the columns in order; each one's cell template is the table's template variant keyed by the column.
    /// </summary>
    /// <remarks>Render-time only: the columns are how the table is built.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UITableColumn> Columns => _columns;

    /// <summary>
    /// Gets or sets whether the header row of captions is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowHeader { get; set; }

    /// <summary>
    /// Gets or sets whether every other row is tinted.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Striped { get; set; }

    /// <summary>
    /// Gets or sets whether a line is drawn between columns.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowColumnSeparators { get; set; }

    /// <summary>
    /// Gets or sets whether a line is drawn between rows.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? ShowRowSeparators { get; set; }


    /// <summary>
    /// Gets or sets whether the viewer may drag a column's edge in the header to resize it; the widths stay on the client.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ResizableColumns { get; set; }

    /// <summary>
    /// Gets or sets whether the viewer may drag a column by its caption to reorder it; the order stays client-side, like widths.
    /// Pinned columns and a control's own column keep their place.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ReorderableColumns { get; set; }

    /// <summary>
    /// Initializes a table with the built-in empty template and the row template every row is a copy of.
    /// </summary>
    protected TableComponent(string? id = null) : base(id)
    {
        _ = SetRowTemplate(new DefaultRowTemplate());
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Adds a column rendering <paramref name="template"/> against the row, bound relatively to the row's properties. Defaults to
    /// <see cref="UIGridUnit.Auto"/> width and a positional key; a <paramref name="pinned"/> column stays fixed while the table
    /// scrolls, and pinned columns must lead.
    /// </summary>
    /// <remarks>Virtual, as <see cref="AddTextColumn"/> is: a package's grid builds its own column through the same verb.</remarks>
    public virtual T AddColumn(string caption, IVisualComponent template, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null, bool pinned = false)
        => AddColumn(new UITableColumn(key ?? NextColumnKey(), caption, width ?? UIGridUnit.Auto(), alignment) { Pinned = pinned }, template);

    /// <summary>The key a column gets when the author names none: its one-based position.</summary>
    protected string NextColumnKey()
        => (_columns.Count + 1).ToString(CultureInfo.InvariantCulture);

    /// <summary>
    /// Hides the column keyed <paramref name="key"/> below viewport <paramref name="tier"/>; a viewer's chooser may still show it.
    /// Applied after the column is added, so the adding verbs stay short.
    /// </summary>
    public T HideColumnBelow(string key, UIResponsiveTier tier)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        for (var i = 0; i < _columns.Count; i++)
        {
            if (string.Equals(_columns[i].Key, key, StringComparison.Ordinal))
            {
                ReplaceColumn(i, _columns[i] with { HideBelow = tier });
                return Self;
            }
        }

        throw new ArgumentException($"'{TypeKey}' has no column keyed '{key}'.", nameof(key));
    }

    /// <summary>Puts a column back in its place with more said about it — a package marking one filterable after the fact; the key and the template stay.</summary>
    protected void ReplaceColumn(int index, UITableColumn column)
    {
        ArgumentNullException.ThrowIfNull(column);
        ArgumentOutOfRangeException.ThrowIfNegative(index);
        ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(index, _columns.Count);

        if (!string.Equals(_columns[index].Key, column.Key, StringComparison.Ordinal))
            throw new ArgumentException($"A column keeps its key when it is put back; '{column.Key}' is not '{_columns[index].Key}'.", nameof(column));

        column.Validate();
        _columns[index] = column;
    }

    /// <summary>
    /// Adds a column built by a derived table — one carrying more than a caption, track and alignment.
    /// </summary>
    /// <remarks>Every verb that adds a column ends here, so a derived table overriding it hears about all of them.</remarks>
    protected virtual T AddColumn(UITableColumn column, IVisualComponent template)
    {
        ArgumentNullException.ThrowIfNull(column);
        ArgumentNullException.ThrowIfNull(template);

        column.Validate();

        for (var i = 0; i < _columns.Count; i++)
        {
            if (string.Equals(_columns[i].Key, column.Key, StringComparison.Ordinal))
                throw new ArgumentException($"'{TypeKey}' already has a column keyed '{column.Key}'.", nameof(column));
        }

        // A pinned column sticks at the sum of the pinned widths before it, which is only a sum while the pinned ones come first.
        if (column.Pinned && _columns.Count > 0 && !_columns[^1].Pinned)
            throw new ArgumentException($"'{TypeKey}' pins '{column.Key}' after an unpinned column; pinned columns lead the table.", nameof(column));

        _columns.Add(column);

        return SetTemplateVariantCore(column.TemplateKey, template);
    }

    /// <summary>
    /// Adds a column showing the row's text at <paramref name="propertyPath"/> — a string property, in the row's own words.
    /// </summary>
    public virtual T AddTextColumn(string caption, string propertyPath, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null, bool pinned = false)
        => AddColumn(caption, CreateTextCell(propertyPath, alignment), width, alignment, key, pinned);

    /// <summary>The cell a text column renders: the built-in text template, its title the row's property.</summary>
    protected static DefaultTextTemplate CreateTextCell(string propertyPath, UITextAlignment? alignment)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyPath);

        DefaultTextTemplate cell = new DefaultTextTemplate().BindTitle(propertyPath, UIBindingScope.Relative);

        // The cell's box follows the column; the words inside it follow the same edge.
        if (alignment is UITextAlignment textAlignment)
            _ = cell.SetTextAlignment(textAlignment);

        return cell;
    }

    /// <summary>
    /// Keeps only the rows in view in the document, for a collection the client holds whole.
    /// </summary>
    public T Virtualized()
    {
        HostMode = ItemsHostModes.Virtualize(HostMode);
        return Self;
    }

    /// <summary>
    /// Binds the table's rows to a windowed source on the controller.
    /// </summary>
    /// <remarks>The path names the source; the compiler appends the property holding its realized window.</remarks>
    public T BindSource(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        HostMode = ItemsHostModes.Window(HostMode);

        return BindItems(path, scope);
    }
}

/// <summary>
/// A table that shows the rows of a keyed collection under a header, one template per column.
/// </summary>
public sealed class TableComponent(string? id = null) : TableComponent<TableComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.table";
}
