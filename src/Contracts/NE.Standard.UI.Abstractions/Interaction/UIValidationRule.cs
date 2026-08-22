using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Describes a validation rule for a UI value.
/// </summary>
public readonly record struct UIValidationRule
{
    /// <summary>
    /// Creates a validation rule that reports the given message and severity when the comparison fails.
    /// </summary>
    public UIValidationRule(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIColorStyle severity, string message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        Trigger = trigger;
        Operator = @operator;
        Value = value;
        Severity = severity;
        Message = message;
    }

    /// <summary>
    /// Gets when the validation rule is evaluated.
    /// </summary>
    public UIValidationTrigger Trigger { get; }

    /// <summary>
    /// Gets the comparison operator used by the rule.
    /// </summary>
    public UIComparisonOperator Operator { get; }

    /// <summary>
    /// Gets the comparison value used by the rule.
    /// </summary>
    public object? Value { get; }

    /// <summary>
    /// Gets the validation severity.
    /// </summary>
    public UIColorStyle Severity { get; }

    /// <summary>
    /// Gets the validation message shown when the rule fails.
    /// </summary>
    public string Message { get; }
}
