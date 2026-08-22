using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
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

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), DefaultValue = null, GenerateSetter = false)]
    public IReadOnlyList<TItem>? Items => _items;

    /// <inheritdoc/>
    IReadOnlyList<object?> IBindableItemsComponent.Items => _items;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IItemsComponent), DefaultValue = null, GenerateSetter = false)]
    public UIItemsView? ItemsView
        => _filters.Count == 0 && _sorts.Count == 0
            ? null
            : new UIItemsView(_filters, _sorts);

    /// <inheritdoc/>
    public bool HasItems => _items.Count > 0;

    /// <summary>
    /// Adds an item to the component.
    /// </summary>
    public TComponent AddItem(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        _items.Add(item);
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

        _items.AddRange(buffer);
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

        _items.Clear();
        _items.AddRange(buffer);

        return Self;
    }

    /// <summary>
    /// Adds a filter controlled by a local component property.
    /// </summary>
    /// <remarks>
    /// The default operator is a case-insensitive substring match, because what drives a list filter is
    /// almost always a text box: an exact <see cref="UIComparisonOperator.Like"/> made "Deploy" and "deploy"
    /// different searches. Pass it explicitly where case is meant to matter.
    /// </remarks>
    public TComponent FilterBy(UIProperty source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
        => FilterBy(Id, source, itemProperty, @operator, activeOperator, activeValue);

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
    public TComponent FilterBy(UIPropertyReference source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.LikeIgnoreCase, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        _filters.Add(new UIItemsFilter(source, itemProperty, @operator, activeOperator, activeValue));
        return Self;
    }

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
    public TComponent SortBy(UIProperty source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
        => SortBy(Id, source, itemProperty, direction, activeOperator, activeValue, priority);

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
    public TComponent SortBy(string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        _sorts.Add(new UIItemsSort(itemProperty, direction, priority));
        return Self;
    }
}
