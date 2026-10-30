using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Items;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// A table that shows the rows of a keyed collection under a header, one template per column, filtering and sorting by rule,
/// selecting and scrolling like an items view.
/// </summary>
/// <remarks>Sorting by header, editing and paging are an add-on's.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ISurfaceStyleComponent))]
[UIComponentPropertyBlock(typeof(IItemsHostComponent))]
[UIComponentPropertyBlock(typeof(IScrollableComponent))]
[UIComponentPropertyDefault(nameof(IScrollableComponent.HorizontalScroll), nameof(DefaultHorizontalScroll))]
[UIComponentPropertyBlock(typeof(ISelectableItemsComponent))]
[UIComponentPropertyBlock(typeof(ISelectionStyleComponent))]
[UIComponentPropertyBlock(typeof(IRowHoverableComponent))]
[UIComponentPropertyBlock(typeof(IEmptyStateComponent))]
[UIComponentPropertyBlock(typeof(IDraggableRowsComponent))]
[UIComponentPropertyBlock(typeof(IDragSourceComponent))]
[UIComponentPropertyBlock(typeof(IAccessibleNameComponent))]
public abstract partial class TableComponent<T> : RowItemsComponentBase<T, IBindableItem, DefaultRowTemplate>, IItemsHostComponent, IRegionContainerComponent, IBorderedComponent, ISurfaceStyleComponent, IScrollableComponent, ISelectableItemsComponent, ISelectionStyleComponent, IRowHoverableComponent, IDraggableRowsComponent, IDragSourceComponent, IEmptyStateComponent, IItemMoveComponent, IAccessibleNameComponent
    where T : TableComponent<T>, IUIComponentDefinition
{
    // Columns whose floors outrun the box scroll sideways with their header rather than being cut at its edge.
    private const UIScrollMode DefaultHorizontalScroll = UIScrollMode.Auto;

    /// <summary>
    /// The key of the table's own checkbox column, shown while many rows may be chosen; not in <see cref="Columns"/>.
    /// </summary>
    public const string SelectionColumnKey = "selection";

    /// <summary>The region of the checkbox over that column, which takes or clears the rows the table has drawn.</summary>
    public const string SelectAllRegionName = "selection-all";

    /// <summary>A row's checkbox name for a screen reader.</summary>
    public const string SelectRowWord = "ui.table.select.row";

    /// <summary>The name of the checkbox over the rows, for a screen reader.</summary>
    public const string SelectAllWord = "ui.table.select.all";

    private const string SelectionColumnTemplateKey = $"{UITableColumn.TemplatePrefix}:{SelectionColumnKey}";

    private readonly List<UITableColumn> _columns = [];

    // The header's checkbox and any regions a derived table adds stand outside every row: a template variant is compiled in the row's
    // scope, so each would carry the row's key in its address with no row around it to supply one.
    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);

    // Alone in their cells with no words of their own, so each is named for a screen reader; joined to the regions and templates only
    // while the table chooses many rows (SelectsMany).
    private readonly CheckboxComponent _selectAllCheckbox = new CheckboxComponent().SetHorizontalAlignment(UIAlignment.Center).SetAccessibleName(SelectAllWord);
    private readonly CheckboxComponent _selectRowCheckbox = new CheckboxComponent().SetHorizontalAlignment(UIAlignment.Center).SetAccessibleName(SelectRowWord);

    /// <summary>
    /// Gets the columns in order; each one's cell template is the table's template variant keyed by the column.
    /// </summary>
    /// <remarks>
    /// Render-time only: the columns are how the table is built. Their captions are its words, so <c>AsContent(ColumnsProperty)</c>
    /// shows every caption as written, as <see cref="UITableColumn.IsContent"/> does one column's.
    /// </remarks>
    [Translatable]
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = null)]
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

    /// <inheritdoc/>
    public virtual IReadOnlyDictionary<string, IVisualComponent> Regions
    {
        get
        {
            SetRegion(SelectAllRegionName, SelectsMany() ? _selectAllCheckbox : null);

            return _regions;
        }
    }

    /// <inheritdoc/>
    public bool HasRegions => Regions.Count > 0;

    /// <inheritdoc/>
    protected override IReadOnlyDictionary<string, IVisualComponent> Templates
    {
        get
        {
            if (SelectsMany())
                _ = SetTemplateVariantCore(SelectionColumnTemplateKey, _selectRowCheckbox);
            else
                _ = RemoveTemplateVariantCore(SelectionColumnTemplateKey);

            return base.Templates;
        }
    }

    /// <summary>Whether the table draws its column of checkboxes: <c>SelectionMode</c> set to <see cref="UISelectionMode.Many"/>, or bound.</summary>
    private bool SelectsMany()
    {
        if (SelectionMode == UISelectionMode.Many)
            return true;

        for (var i = 0; i < Bindings.Count; i++)
        {
            if (Bindings[i].Target.Equals(ISelectableItemsComponent.SelectionModeProperty))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Initializes a table with the built-in empty template and the row template every row is a copy of.
    /// </summary>
    protected TableComponent(string? id = null) : base(id)
    {
        _ = SetRowTemplate(new DefaultRowTemplate());
        _ = SetEmptyTemplate(new DefaultEmptyTemplate());
    }

    /// <summary>Sets or removes a region standing outside the table's rows.</summary>
    protected void SetRegion(string name, IVisualComponent? region)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        if (region is null)
            _ = _regions.Remove(name);
        else
            _regions[name] = region;
    }

    /// <summary>Finds a region standing outside the table's rows.</summary>
    protected bool TryGetRegion(string name, [NotNullWhen(true)] out IVisualComponent? region)
        => _regions.TryGetValue(name, out region);

    /// <summary>Adds a column rendering <paramref name="template"/> against the row, bound relatively to the row's properties.</summary>
    /// <remarks>
    /// Defaults to <see cref="UIGridUnit.Auto"/> width and a positional key; a <paramref name="pinned"/> column stays fixed while the
    /// table scrolls, and pinned columns must lead; <paramref name="icon"/> stands before the caption, a <paramref name="hidden"/>
    /// column starts hidden, and a <paramref name="content"/> caption is shown as written. The caption is a phrase: a string is the
    /// author's text, a key with arguments a phrase. Virtual, as <see cref="AddTextColumn"/> is: a package's grid builds its own column
    /// through the same verb.
    /// </remarks>
    public virtual T AddColumn(UIPhrase caption, IVisualComponent template, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null, bool pinned = false, string? icon = null, bool hidden = false, bool content = false)
        => AddColumn(new UITableColumn(key ?? NextColumnKey(), caption, width ?? UIGridUnit.Auto(), alignment) { Pinned = pinned, Icon = icon, Hidden = hidden, IsContent = content }, template);

    /// <summary>The key a column gets when the author names none: its one-based position.</summary>
    protected string NextColumnKey()
        => (_columns.Count + 1).ToString(CultureInfo.InvariantCulture);

    /// <summary>Hides the column keyed <paramref name="key"/> below viewport <paramref name="tier"/>; a viewer's chooser may still show it.</summary>
    /// <remarks>Applied after the column is added, so the adding verbs stay short.</remarks>
    public T HideColumnBelow(string key, UIResponsiveTier tier)
        => ChangeColumn(key, column => column with { HideBelow = tier });

    /// <summary>The column keyed <paramref name="key"/> put back with what <paramref name="change"/> says about it.</summary>
    private T ChangeColumn(string key, Func<UITableColumn, UITableColumn> change)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        for (var i = 0; i < _columns.Count; i++)
        {
            if (string.Equals(_columns[i].Key, key, StringComparison.Ordinal))
            {
                ReplaceColumn(i, change(_columns[i]));
                return Self;
            }
        }

        throw new ArgumentException($"'{TypeKey}' has no column keyed '{key}'.", nameof(key));
    }

    /// <summary>Starts the column keyed <paramref name="key"/> hidden at every width; a viewer's chooser may still show it, and that word is kept.</summary>
    /// <remarks>Applied after the column is added, as <see cref="HideColumnBelow"/> is. A plain table draws no chooser, so only a host that
    /// has one (the data grid) can show the column again.</remarks>
    public T HideColumn(string key)
        => ChangeColumn(key, column => column with { Hidden = true });

    /// <summary>Draws <paramref name="icon"/>, in <paramref name="color"/> when given, before the caption of the column keyed <paramref name="key"/>.</summary>
    public T SetColumnIcon(string key, string? icon, UIThemeColor? color = null)
        => ChangeColumn(key, column => column with { Icon = icon, IconColor = color });

    /// <summary>
    /// Makes the column keyed <paramref name="key"/> name its rows (<see cref="UITableColumn.IsRowHeader"/>) in place of the first
    /// column, which heads them while no column is marked.
    /// </summary>
    public T SetRowHeaderColumn(string key)
        => ChangeColumn(key, column => column with { IsRowHeader = true });

    /// <summary>Puts a column back in its place with more said about it — a package marking one filterable after the fact; the key and the template stay.</summary>
    /// <remarks>Virtual, so a derived table keeps what it built from the columns — a grid's chooser — level with the change.</remarks>
    protected virtual void ReplaceColumn(int index, UITableColumn column)
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

        if (string.Equals(column.Key, SelectionColumnKey, StringComparison.Ordinal))
            throw new ArgumentException($"'{SelectionColumnKey}' is the key of the table's own column of checkboxes.", nameof(column));

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
    public T AddTextColumn<TRow>(UIPhrase caption, Expression<Func<TRow, object?>> propertyPath, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null, bool pinned = false, string? icon = null, bool hidden = false, bool content = false)
        => AddTextColumn(caption, RecursivePath.FromExpression(propertyPath).ToString(), width, alignment, key, pinned, icon, hidden, content);

    /// <summary>
    /// Adds a column showing the row's text at <paramref name="propertyPath"/> — a string property, in the row's own words.
    /// </summary>
    public virtual T AddTextColumn(UIPhrase caption, string propertyPath, UIGridUnit? width = null, UITextAlignment? alignment = null, string? key = null, bool pinned = false, string? icon = null, bool hidden = false, bool content = false)
        => AddColumn(caption, CreateTextCell(propertyPath, alignment), width, alignment, key, pinned, icon, hidden, content);

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
    /// Writes a move registration on the row template, now and on every one <see cref="RowItemsComponentBase{TComponent, TItem, TRow}.SetRowTemplate"/>
    /// sets later: a row dropped at another place among the rows by a drag with <c>Draggable</c> on, or Alt+Up and Alt+Down.
    /// </summary>
    /// <remarks>
    /// The row stands there at once; the controller's Move of it keeps it there or puts it where the controller did, and an answer
    /// without one puts it back. The index is where <c>RecursiveCollection.Move</c> puts it; in a windowed host, its place in the
    /// source's whole query.
    /// </remarks>
    public void OnMovableItemTemplates(Action<IVisualComponent> register)
        => _ = OnRowTemplate(row => register(row));

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

    /// <summary>
    /// Binds the table's rows to a windowed source on the controller.
    /// </summary>
    /// <remarks>The path names the source; the compiler appends the property holding its realized window.</remarks>
    public T BindSource<TSource>(Expression<Func<TSource, object?>> path, UIBindingScope scope = UIBindingScope.Root)
    {
        HostMode = ItemsHostModes.Window(HostMode);

        return BindItems(RecursivePath.FromExpression(path), scope);
    }
}

/// <summary>
/// A table that shows the rows of a keyed collection under a header, one template per column.
/// </summary>
public sealed class TableComponent(string? id = null) : TableComponent<TableComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.table";
}
