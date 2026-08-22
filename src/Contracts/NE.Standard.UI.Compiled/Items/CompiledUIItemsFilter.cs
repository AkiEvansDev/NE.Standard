using System;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compiled.Items;

/// <summary>
/// Represents a compiled items filter with resolved runtime references.
/// </summary>
public sealed class CompiledUIItemsFilter
{
    /// <summary>
    /// Creates a compiled items filter from its resolved source and comparison settings.
    /// </summary>
    public CompiledUIItemsFilter(CompiledUIItemsRuleSource source, string itemProperty, UIComparisonOperator @operator = UIComparisonOperator.Like, object? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        Source = source;
        ItemProperty = itemProperty;
        Operator = @operator;
        Value = value;
    }

    /// <summary>
    /// Gets the resolved source that controls the filter.
    /// </summary>
    public CompiledUIItemsRuleSource Source { get; }

    /// <summary>
    /// Gets the item property compared by the filter.
    /// </summary>
    public string ItemProperty { get; }

    /// <summary>
    /// Gets the comparison operator applied by the filter.
    /// </summary>
    public UIComparisonOperator Operator { get; }

    /// <summary>
    /// Gets the constant value compared against <see cref="ItemProperty"/> when <see cref="Source"/>'s source is absent.
    /// </summary>
    public object? Value { get; }
}
