using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled validation rule for a component property.
/// </summary>
public sealed class CompiledUIValidationRule
{
    /// <summary>
    /// Gets the validated property address.
    /// </summary>
    public required UIPropertyAddress Target { get; init; }

    /// <summary>
    /// Gets when the validation rule is evaluated.
    /// </summary>
    public required UIValidationTrigger Trigger { get; init; }

    /// <summary>
    /// Gets the comparison operator used by the rule.
    /// </summary>
    public required UIComparisonOperator Operator { get; init; }

    /// <summary>
    /// Gets the comparison value used by the rule.
    /// </summary>
    public object? Value { get; init; }

    /// <summary>
    /// Gets the validation severity.
    /// </summary>
    public required UIColorStyle Severity { get; init; }

    /// <summary>
    /// Gets the validation message shown when the rule fails.
    /// </summary>
    public required string Message { get; init; }
}
