using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// Describes the component property that controls whether an items rule is active.
/// </summary>
public readonly record struct UIItemsRuleSource
{
    /// <summary>
    /// Creates a rule source from an optional property reference and the comparison used to determine activity.
    /// </summary>
    public UIItemsRuleSource(UIPropertyReference? source, UIComparisonOperator activeOperator = UIComparisonOperator.Required, object? activeValue = null)
    {
        Source = source;
        ActiveOperator = activeOperator;
        ActiveValue = activeValue;
    }

    /// <summary>
    /// Gets the source property reference, or <see langword="null"/> if the rule is unconditionally active.
    /// </summary>
    public UIPropertyReference? Source { get; }

    /// <summary>
    /// Gets the operator used to determine whether the rule is active.
    /// </summary>
    public UIComparisonOperator ActiveOperator { get; }

    /// <summary>
    /// Gets the value used to determine whether the rule is active.
    /// </summary>
    public object? ActiveValue { get; }
}
