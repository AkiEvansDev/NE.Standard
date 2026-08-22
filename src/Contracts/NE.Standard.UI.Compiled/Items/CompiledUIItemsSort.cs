using System;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Compiled.Items;

/// <summary>
/// Represents a compiled items sort rule with resolved runtime references.
/// </summary>
public sealed class CompiledUIItemsSort
{
    /// <summary>
    /// Creates a compiled items sort rule from its resolved source and sort settings.
    /// </summary>
    public CompiledUIItemsSort(CompiledUIItemsRuleSource source, string itemProperty, UIItemsSortDirection direction = UIItemsSortDirection.Ascending, int priority = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);
        ArgumentOutOfRangeException.ThrowIfNegative(priority);

        Source = source;
        ItemProperty = itemProperty;
        Direction = direction;
        Priority = priority;
    }

    /// <summary>
    /// Gets the resolved source that controls the sort rule.
    /// </summary>
    public CompiledUIItemsRuleSource Source { get; }

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
