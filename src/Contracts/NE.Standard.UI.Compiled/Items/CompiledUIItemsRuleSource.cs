using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compiled.Items;

/// <summary>
/// Represents a compiled source that controls whether an items rule is active.
/// </summary>
public readonly record struct CompiledUIItemsRuleSource
{
    /// <summary>
    /// Creates a compiled rule source from its resolved property address and activation settings.
    /// </summary>
    public CompiledUIItemsRuleSource(UIPropertyAddress? source, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        Source = source;
        ActiveOperator = activeOperator;
        ActiveValue = activeValue;
    }

    /// <summary>
    /// Gets the resolved source property address, or <see langword="null"/> if the rule is unconditionally active.
    /// </summary>
    public UIPropertyAddress? Source { get; }

    /// <summary>
    /// Gets the operator used to determine whether the rule is active.
    /// </summary>
    public UIComparisonOperator ActiveOperator { get; }

    /// <summary>
    /// Gets the value used to determine whether the rule is active.
    /// </summary>
    public object? ActiveValue { get; }
}
