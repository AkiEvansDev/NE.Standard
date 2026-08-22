using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// Describes a filter applied to an items view.
/// </summary>
public sealed class UIItemsFilter
{
    /// <summary>
    /// Creates a filter whose active state is controlled by a source property.
    /// </summary>
    public UIItemsFilter(UIPropertyReference source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.Like, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        Source = new UIItemsRuleSource(source, activeOperator, activeValue);
        ItemProperty = itemProperty;
        Operator = @operator;
    }

    /// <summary>
    /// Creates an unconditionally active filter with no source, comparing <paramref name="itemProperty"/>
    /// against a constant <paramref name="value"/>.
    /// </summary>
    public UIItemsFilter(string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.Like, object? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        Source = new UIItemsRuleSource(null);
        ItemProperty = itemProperty;
        Operator = @operator;
        Value = value;
    }

    /// <summary>
    /// Gets the source that controls whether the filter is active.
    /// </summary>
    public UIItemsRuleSource Source { get; }

    /// <summary>
    /// Gets the item property compared by the filter.
    /// </summary>
    public string ItemProperty { get; }

    /// <summary>
    /// Gets the comparison operator applied by the filter.
    /// </summary>
    public UIComparisonOperator Operator { get; }

    /// <summary>
    /// Gets the constant value compared against <see cref="ItemProperty"/> when <see cref="Source"/> is absent.
    /// </summary>
    public object? Value { get; }
}
