using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;
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
    /// Creates a validation rule that reports a key with its arguments — or the author's text, which may not be empty — and the severity,
    /// when the comparison fails.
    /// </summary>
    public UIValidationRule(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIValidationSeverity severity, UIPhrase message)
    {
        ArgumentNullException.ThrowIfNull(message);

        // A refusal with no words would mark the field and say nothing of why.
        if (!UIPhrase.HasWords(message))
            throw new ArgumentException("A validation rule needs a message.", nameof(message));

        Trigger = trigger;
        Operator = @operator;
        Value = value;
        Severity = severity;
        Message = message;
    }

    /// <summary>
    /// Creates a rule comparing the value with another field's value — "Password again" equal to "New password" — reporting the message
    /// and severity when the comparison fails.
    /// </summary>
    /// <remarks>A presence or a pattern names no other field: <c>Required</c>, <c>Regex</c> and <c>RegexEach</c> are refused.</remarks>
    public UIValidationRule(UIValidationTrigger trigger, UIComparisonOperator @operator, UIPropertyReference valueSource, UIValidationSeverity severity, UIPhrase message)
        : this(trigger, @operator, null, severity, message)
    {
        if (@operator is UIComparisonOperator.Required or UIComparisonOperator.Regex or UIComparisonOperator.RegexEach)
            throw new ArgumentException($"A rule against another field compares two values; '{@operator}' takes no field.", nameof(@operator));

        ValueSource = valueSource;
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
    /// Gets the field whose value the rule compares with in place of <see cref="Value"/>, or null for a fixed value.
    /// </summary>
    public UIPropertyReference? ValueSource { get; }

    /// <summary>
    /// Gets the validation severity.
    /// </summary>
    public UIValidationSeverity Severity { get; }

    /// <summary>
    /// Gets the validation message shown when the rule fails: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.
    /// </summary>
    public UIPhrase Message { get; }
}
