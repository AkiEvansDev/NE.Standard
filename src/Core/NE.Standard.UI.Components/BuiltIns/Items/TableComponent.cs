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
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A table that shows the rows of a keyed collection under a header, one template per column. It filters and sorts by rule,
/// chooses rows and scrolls the way an items view does; sorting by header, editing and paging are an add-on's.
/// </summary>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
public abstract partial class TableComponent<T> : RowItemsComponentBase<T, IBindableItem, DefaultRowTemplate>, IItemsHostComponent, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent
    where T : TableComponent<T>, IUIComponentDefinition
{
    private const int DefaultWindowSize = 50;

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

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = UIItemsHostMode.Plain, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public UIItemsHostMode HostMode { get; private set; }

    /// <summary>
    /// Gets or sets how many rows one window holds; not bindable, the client reads it once.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = DefaultWindowSize, GenerateBinder = false, IsBindable = false)]
    public int WindowSize { get; set; } = DefaultWindowSize;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = null, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public int? WindowOffset { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = null, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public int? WindowTotalCount { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = false, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public bool WindowHasMoreBefore { get; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsHostComponent), DefaultValue = false, GenerateSetter = false, GenerateBinder = false, IsBindable = false)]
    public bool WindowHasMoreAfter { get; }

    /// <summary>
    /// Initializes a table with the built-in empty template and the row template every row is a copy of.
    /// </summary>
    protected TableComponent(string? id = null) : base(id)
    {
        _ = SetRowTemplate(new DefaultRowTemplate());
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>
    /// Adds a column whose cells render <paramref name="template"/> against the row: bind it relatively to the row's properties.
    /// The track is <see cref="UIGridUnit.Auto"/> unless given, and the key names the column's template variant.
    /// </summary>
    public T AddColumn(string caption, IVisualComponent template, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null)
        => AddColumn(new UITableColumn(key ?? (_columns.Count + 1).ToString(CultureInfo.InvariantCulture), caption, width ?? UIGridUnit.Auto(), alignment), template);

    /// <summary>
    /// Adds a column a derived table built itself — a package's column, carrying more than a caption, a track and an alignment.
    /// </summary>
    protected T AddColumn(UITableColumn column, IVisualComponent template)
    {
        ArgumentNullException.ThrowIfNull(column);
        ArgumentNullException.ThrowIfNull(template);

        column.Validate();

        for (var i = 0; i < _columns.Count; i++)
        {
            if (string.Equals(_columns[i].Key, column.Key, StringComparison.Ordinal))
                throw new ArgumentException($"'{TypeKey}' already has a column keyed '{column.Key}'.", nameof(column));
        }

        _columns.Add(column);

        return SetTemplateVariantCore(column.TemplateKey, template);
    }

    /// <summary>
    /// Adds a column showing the row's text at <paramref name="propertyPath"/> — a string property, in the row's own words.
    /// </summary>
    public T AddTextColumn(string caption, string propertyPath, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyPath);

        DefaultTextTemplate cell = new DefaultTextTemplate().BindTitle(propertyPath, UIBindingScope.Relative);

        // The cell's box follows the column; the words inside it follow the same edge.
        if (alignment is UITextAlignment textAlignment)
            _ = cell.SetTextAlignment(textAlignment);

        return AddColumn(caption, cell, width, alignment, key);
    }

    /// <summary>
    /// Keeps only the rows in view in the document, for a collection the client holds whole.
    /// </summary>
    public T Virtualized()
    {
        if (HostMode == UIItemsHostMode.Windowed)
            throw new InvalidOperationException("A windowed table already keeps only its window; it cannot be virtualized as well.");

        HostMode = UIItemsHostMode.Virtualized;
        return Self;
    }

    /// <summary>
    /// Binds the table's rows to a windowed source on the controller.
    /// </summary>
    /// <remarks>The path names the source; the compiler appends the property holding its realized window.</remarks>
    public T BindSource(string path, UIBindingScope scope = UIBindingScope.Root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        if (HostMode == UIItemsHostMode.Virtualized)
            throw new InvalidOperationException("A virtualized table holds its collection whole; a source hands over one window at a time instead.");

        HostMode = UIItemsHostMode.Windowed;

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
