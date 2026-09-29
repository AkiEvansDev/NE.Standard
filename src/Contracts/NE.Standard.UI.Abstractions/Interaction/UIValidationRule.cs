using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>Describes a validation rule for a UI value.</summary>
/// <remarks>
/// The message is translatable as <see cref="UIValidationMessage.Message"/> is: a text is looked up as a plain value on a
/// translatable property is — under key prefixes only a prefixed one — and a <see cref="UIPhrase"/> always; the page shows it in its
/// language and again after a switch.
/// </remarks>
public readonly record struct UIValidationRule
{
    /// <summary>
    /// Creates a validation rule that reports the given message — the author's text or a key — and severity when the comparison fails.
    /// </summary>
    public UIValidationRule(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIValidationSeverity severity, string message)
        : this(trigger, @operator, value, severity, UIPhrase.Text(message))
    {
    }

    /// <summary>
    /// Creates a validation rule that reports a key with its arguments, and the severity, when the comparison fails.
    /// </summary>
    public UIValidationRule(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIValidationSeverity severity, UIPhrase message)
    {
        ArgumentNullException.ThrowIfNull(message);

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
    public UIValidationSeverity Severity { get; }

    /// <summary>
    /// Gets the validation message shown when the rule fails: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.
    /// </summary>
    public UIPhrase Message { get; }
}
