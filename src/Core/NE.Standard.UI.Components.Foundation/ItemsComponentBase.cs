using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for components that render item collections with optional filtering and sorting rules.
/// </summary>
public abstract partial class ItemsComponentBase<TComponent, TItem>(string? id = null) : TemplatedComponentBase<TComponent>(id), IItemsComponent
    where TComponent : ItemsComponentBase<TComponent, TItem>, IUIComponentDefinition
    where TItem : class
{
    private readonly List<TItem> _items = [];
    private readonly List<UIItemsFilter> _filters = [];
    private readonly List<UIItemsSort> _sorts = [];
    private readonly List<UIItemsSort> _defaultSorts = [];
    private readonly List<string> _itemReads = [];
    private bool _itemsAuthored;
    private bool _readsWholeItems;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), DefaultValue = null, GenerateSetter = false)]
    public IReadOnlyList<TItem>? Items => _items;

    /// <inheritdoc/>
    IReadOnlyList<object?> IBindableItemsComponent.Items => _items;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), DefaultValue = null, GenerateSetter = false)]
    public UIItemsView? ItemsView
        => _filters.Count == 0 && _sorts.Count == 0 && _defaultSorts.Count == 0
            ? null
            : new UIItemsView(_filters, BuildEffectiveSorts());

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public UIItemsQuery? Query { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), IsBindable = false, DefaultValue = null, GenerateSetter = false)]
    public UIItemReads? ItemReads
        => _readsWholeItems
            ? UIItemReads.Whole
            : _itemReads.Count == 0 ? null : new UIItemReads(_itemReads);

    /// <inheritdoc/>
    public bool HasItems => _items.Count > 0;

    /// <summary>
    /// Names item paths the page reads off the rows beyond what the templates bind, so each row carries them.
    /// </summary>
    public TComponent AddItemReads<TRow>(params Expression<Func<TRow, object?>>[] paths)
    {
        ArgumentNullException.ThrowIfNull(paths);

        var resolved = new string[paths.Length];

        for (var i = 0; i < paths.Length; i++)
            resolved[i] = RecursivePath.FromExpression(paths[i]).ToString();

        return AddItemReads(resolved);
    }

    /// <summary>
    /// Names item paths the page reads off the rows beyond what the templates bind (a client engine reading <c>rows.itemOf</c>), so
    /// each row carries them; dotted, as a binding's path.
    /// </summary>
    public TComponent AddItemReads(params string[] paths)
    {
        ArgumentNullException.ThrowIfNull(paths);

        for (var i = 0; i < paths.Length; i++)
            ArgumentException.ThrowIfNullOrWhiteSpace(paths[i]);

        _itemReads.AddRange(paths);
        return Self;
    }

    /// <summary>
    /// Sends every row's item whole: something on the page reads it raw, past what the compile can see.
    /// </summary>
    public TComponent ReadsWholeItems()
    {
        _readsWholeItems = true;
        return Self;
    }

    /// <summary>
    /// Adds an item to the component.
    /// </summary>
    public TComponent AddItem(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        _itemsAuthored = true;
        _items.Add(item);
        OnItemsChanged();
        return Self;
    }

    /// <summary>
    /// Adds items to the component.
    /// </summary>
    public TComponent AddItems(IEnumerable<TItem> items)
    {
        ArgumentNullException.ThrowIfNull(items);

        TItem[] buffer = [.. items];

        for (var i = 0; i < buffer.Length; i++)
            ArgumentNullException.ThrowIfNull(buffer[i]);

        _itemsAuthored = true;
        _items.AddRange(buffer);
        OnItemsChanged();
        return Self;
    }

    /// <summary>
    /// Replaces the component items.
    /// </summary>
    public TComponent SetItems(IEnumerable<TItem> items)
    {
        ArgumentNullException.ThrowIfNull(items);

        TItem[] buffer = [.. items];

        for (var i = 0; i < buffer.Length; i++)
            ArgumentNullException.ThrowIfNull(buffer[i]);

        _itemsAuthored = true;
        _items.Clear();
        _items.AddRange(buffer);
        OnItemsChanged();

        return Self;
    }

    /// <summary>
    /// Runs after authored items are added or replaced.
    /// </summary>
    protected virtual void OnItemsChanged()
    {
    }

    /// <summary>
    /// Adds a filter controlled by a local component property.
    /// </summary>
    public TComponent FilterBy<TRow>(UIProperty source, Expression<Func<TRow, object?>> itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
        => FilterBy(source, RecursivePath.FromExpression(itemProperty).ToString(), @operator, activeOperator, activeValue);

    /// <summary>
    /// Adds a filter controlled by a local component property.
    /// </summary>
    /// <remarks>Defaults to a case-insensitive substring match; pass the operator explicitly where case matters.</remarks>
    public TComponent FilterBy(UIProperty source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
        => FilterBy(Id, source, itemProperty, @operator, activeOperator, activeValue);

    /// <summary>
    /// Adds a filter controlled by another component property.
    /// </summary>
    public TComponent FilterBy<TRow>(string sourceComponentId, UIProperty source, Expression<Func<TRow, object?>> itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
        => FilterBy(sourceComponentId, source, RecursivePath.FromExpression(itemProperty).ToString(), @operator, activeOperator, activeValue);

    /// <summary>
    /// Adds a filter controlled by another component property.
    /// </summary>
    public TComponent FilterBy(string sourceComponentId, UIProperty source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);

        return FilterBy(new UIPropertyReference(sourceComponentId, source), itemProperty, @operator, activeOperator, activeValue);
    }

    /// <summary>
    /// Adds a filter controlled by a property reference.
    /// </summary>
    public TComponent FilterBy<TRow>(UIPropertyReference source, Expression<Func<TRow, object?>> itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
        => FilterBy(source, RecursivePath.FromExpression(itemProperty).ToString(), @operator, activeOperator, activeValue);

    /// <summary>
    /// Adds a filter controlled by a property reference.
    /// </summary>
    public TComponent FilterBy(UIPropertyReference source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        _filters.Add(new UIItemsFilter(source, itemProperty, @operator, activeOperator, activeValue));
        return Self;
    }

    /// <summary>
    /// Adds an unconditionally active filter with no source, comparing against a constant value.
    /// </summary>
    public TComponent FilterBy<TRow>(Expression<Func<TRow, object?>> itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, object? value = null)
        => FilterBy(RecursivePath.FromExpression(itemProperty).ToString(), @operator, value);

    /// <summary>
    /// Adds an unconditionally active filter with no source, comparing against a constant value.
    /// </summary>
    public TComponent FilterBy(string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, object? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        _filters.Add(new UIItemsFilter(itemProperty, @operator, value));
        return Self;
    }

    /// <summary>
    /// Adds a sort rule controlled by a local component property.
    /// </summary>
    public TComponent SortBy<TRow>(UIProperty source, Expression<Func<TRow, object?>> itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
        => SortBy(source, RecursivePath.FromExpression(itemProperty).ToString(), direction, activeOperator, activeValue, priority);

    /// <summary>
    /// Adds a sort rule controlled by a local component property.
    /// </summary>
    public TComponent SortBy(UIProperty source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
        => SortBy(Id, source, itemProperty, direction, activeOperator, activeValue, priority);

    /// <summary>
    /// Adds a sort rule controlled by another component property.
    /// </summary>
    public TComponent SortBy<TRow>(string sourceComponentId, UIProperty source, Expression<Func<TRow, object?>> itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
        => SortBy(sourceComponentId, source, RecursivePath.FromExpression(itemProperty).ToString(), direction, activeOperator, activeValue, priority);

    /// <summary>
    /// Adds a sort rule controlled by another component property.
    /// </summary>
    public TComponent SortBy(string sourceComponentId, UIProperty source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceComponentId);

        return SortBy(new UIPropertyReference(sourceComponentId, source), itemProperty, direction, activeOperator, activeValue, priority);
    }

    /// <summary>
    /// Adds a sort rule controlled by a property reference.
    /// </summary>
    public TComponent SortBy<TRow>(UIPropertyReference source, Expression<Func<TRow, object?>> itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
        => SortBy(source, RecursivePath.FromExpression(itemProperty).ToString(), direction, activeOperator, activeValue, priority);

    /// <summary>
    /// Adds a sort rule controlled by a property reference.
    /// </summary>
    public TComponent SortBy(UIPropertyReference source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        _sorts.Add(new UIItemsSort(source, itemProperty, direction, activeOperator, activeValue, priority));
        return Self;
    }

    /// <summary>
    /// Adds an unconditionally active sort rule with no source.
    /// </summary>
    public TComponent SortBy<TRow>(Expression<Func<TRow, object?>> itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
        => SortBy(RecursivePath.FromExpression(itemProperty).ToString(), direction, priority);

    /// <summary>
    /// Adds an unconditionally active sort rule with no source.
    /// </summary>
    public TComponent SortBy(string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        _sorts.Add(new UIItemsSort(itemProperty, direction, priority));
        return Self;
    }

    /// <summary>Installs a built-in default sort rule without marking it as authored.</summary>
    protected void AddDefaultSort(string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        _defaultSorts.Add(new UIItemsSort(itemProperty, direction, priority));
    }

    private List<UIItemsSort> BuildEffectiveSorts()
    {
        if (_defaultSorts.Count == 0)
            return _sorts;

        if (_sorts.Count == 0)
            return _defaultSorts;

        List<UIItemsSort> combined = [.. _sorts];

        for (var i = 0; i < _defaultSorts.Count; i++)
        {
            if (!ContainsMatchingSort(combined, _defaultSorts[i]))
                combined.Add(_defaultSorts[i]);
        }

        return combined;
    }

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();
        TItem[] ownItems = _items.Count > 0 ? [.. _items] : [];
        var hadOwnItems = _itemsAuthored;
        var hadOwnItemsBinding = HasNonOptionalBinding(IItemsComponent.ItemsProperty);
        UIItemsFilter[] ownFilters = _filters.Count > 0 ? [.. _filters] : [];
        UIItemsSort[] ownSorts = _sorts.Count > 0 ? [.. _sorts] : [];
        var ownItemReads = _itemReads.Count > 0 ? _itemReads.ToArray() : [];
        var ownReadsWholeItems = _readsWholeItems;

        _items.Clear();
        _itemsAuthored = false;
        _filters.Clear();
        _sorts.Clear();

        return () =>
        {
            restoreBase?.Invoke();

            if (hadOwnItems)
            {
                _items.Clear();
                _items.AddRange(ownItems);
                _itemsAuthored = true;
                OnItemsChanged();

                if (!hadOwnItemsBinding)
                    RemoveNonOptionalBinding(IItemsComponent.ItemsProperty);
            }
            else if (hadOwnItemsBinding && _items.Count > 0)
            {
                _items.Clear();
                _itemsAuthored = false;
            }

            if (ownFilters.Length > 0)
            {
                UIItemsFilter[] ruleFilters = _filters.Count > 0 ? [.. _filters] : [];
                _filters.Clear();

                for (var i = 0; i < ruleFilters.Length; i++)
                {
                    if (!ContainsMatchingFilter(ownFilters, ruleFilters[i]))
                        _filters.Add(ruleFilters[i]);
                }

                _filters.AddRange(ownFilters);
            }

            if (ownSorts.Length > 0)
            {
                UIItemsSort[] ruleSorts = _sorts.Count > 0 ? [.. _sorts] : [];
                _sorts.Clear();
                _sorts.AddRange(ownSorts);

                for (var i = 0; i < ruleSorts.Length; i++)
                {
                    if (!ContainsMatchingSort(_sorts, ruleSorts[i]))
                        _sorts.Add(ruleSorts[i]);
                }
            }

            if (ownItemReads.Length > 0)
            {
                for (var i = 0; i < ownItemReads.Length; i++)
                {
                    if (!_itemReads.Contains(ownItemReads[i]))
                        _itemReads.Add(ownItemReads[i]);
                }
            }

            if (ownReadsWholeItems)
                _readsWholeItems = true;
        };
    }

    private static bool ContainsMatchingFilter(UIItemsFilter[] filters, UIItemsFilter candidate)
    {
        for (var i = 0; i < filters.Length; i++)
        {
            if (filters[i].Source.Equals(candidate.Source)
                && string.Equals(filters[i].ItemProperty, candidate.ItemProperty, StringComparison.Ordinal)
                && (candidate.Source.Source is not null || filters[i].Operator == candidate.Operator))
            {
                return true;
            }
        }

        return false;
    }

    private static bool ContainsMatchingSort(List<UIItemsSort> sorts, UIItemsSort candidate)
    {
        for (var i = 0; i < sorts.Count; i++)
        {
            if (sorts[i].Source.Equals(candidate.Source)
                && string.Equals(sorts[i].ItemProperty, candidate.ItemProperty, StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }
}

/// <summary>
/// An items component whose item template must be a <typeparamref name="TTemplate"/>.
/// </summary>
public abstract class ItemsComponentBase<TComponent, TItem, TTemplate>(string? id = null) : ItemsComponentBase<TComponent, TItem>(id)
    where TComponent : ItemsComponentBase<TComponent, TItem, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    /// <summary>
    /// Gets the item template.
    /// </summary>
    public new TTemplate? Template => (TTemplate?)base.Template;

    /// <summary>
    /// The item template, which a registration that configures the template in hand needs.
    /// </summary>
    protected TTemplate RequiredTemplate => Template ?? throw new InvalidOperationException($"'{TypeKey}' has no item template.");

    /// <summary>
    /// Writes an item event on the item template and on every one <see cref="SetTemplate"/> sets later.
    /// </summary>
    protected TComponent OnItemTemplate(Action<TTemplate> register)
        => OnTemplate(null, register);

    /// <summary>
    /// Sets the item template.
    /// </summary>
    public TComponent SetTemplate(TTemplate visualTemplate)
        => SetTemplateCore(visualTemplate);

    /// <summary>
    /// Adds or replaces a named template variant.
    /// </summary>
    public TComponent AddTemplateVariant(string key, TTemplate visualTemplate)
        => SetTemplateVariantCore(key, visualTemplate);
}
