using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// Describes a sort rule applied to an items view.
/// </summary>
public sealed class UIItemsSort
{
    /// <summary>
    /// Creates a sort rule whose active state is controlled by a source property.
    /// </summary>
    public UIItemsSort(UIPropertyReference source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, UIComparisonOperator activeOperator = UIComparisonOperator.Equal, object? activeValue = null, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        activeValue ??= true;

        Source = new UIItemsRuleSource(source, activeOperator, activeValue);
        ItemProperty = itemProperty;
        Direction = direction;
        Priority = priority;
    }

    /// <summary>
    /// Creates an unconditionally active sort rule with no source.
    /// </summary>
    public UIItemsSort(string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        Source = new UIItemsRuleSource(null);
        ItemProperty = itemProperty;
        Direction = direction;
        Priority = priority;
    }

    /// <summary>
    /// Gets the source that controls whether the sort rule is active.
    /// </summary>
    public UIItemsRuleSource Source { get; }

    /// <summary>
    /// Gets the item property used for sorting.
    /// </summary>
    public string ItemProperty { get; }

    /// <summary>
    /// Gets the sort direction.
    /// </summary>
    public UIItemsSortDirection Direction { get; }

    /// <summary>
    /// Gets the sort priority. Lower values are applied first.
    /// </summary>
    public int Priority { get; }
}
