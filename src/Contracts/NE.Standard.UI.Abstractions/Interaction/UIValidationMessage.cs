using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>A validation message a controller puts on an input: the severity and the words. Null on the property means none.</summary>
/// <remarks>
/// The words are translatable as a label is: a text is looked up as a plain value on a translatable property is — under key
/// prefixes only a prefixed one — and a <see cref="UIPhrase"/> always; the page shows them in its language and again after a switch.
/// </remarks>
public readonly record struct UIValidationMessage
{
    /// <summary>A message of the given severity, from the author's text or key; the text may not be empty.</summary>
    public UIValidationMessage(UIValidationSeverity severity, string message)
        : this(severity, UIPhrase.Text(message))
    {
    }

    /// <summary>A message of the given severity, from a key with its arguments.</summary>
    public UIValidationMessage(UIValidationSeverity severity, UIPhrase message)
    {
        ArgumentNullException.ThrowIfNull(message);

        Severity = severity;
        Message = message;
    }

    /// <summary>How the message is drawn and whether it refuses a submit.</summary>
    public UIValidationSeverity Severity { get; }

    /// <summary>The words shown under the input, or in its marker's tooltip: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.</summary>
    public UIPhrase Message { get; }

    /// <summary>A message that refuses the value.</summary>
    public static UIValidationMessage Error(string message)
        => new(UIValidationSeverity.Error, message);

    /// <inheritdoc cref="Error(string)"/>
    public static UIValidationMessage Error(UIPhrase message)
        => new(UIValidationSeverity.Error, message);

    /// <summary>A message that warns about the value without refusing it.</summary>
    public static UIValidationMessage Warning(string message)
        => new(UIValidationSeverity.Warning, message);

    /// <inheritdoc cref="Warning(string)"/>
    public static UIValidationMessage Warning(UIPhrase message)
        => new(UIValidationSeverity.Warning, message);

    /// <summary>A message that only tells the viewer something about the value.</summary>
    public static UIValidationMessage Info(string message)
        => new(UIValidationSeverity.Info, message);

    /// <inheritdoc cref="Info(string)"/>
    public static UIValidationMessage Info(UIPhrase message)
        => new(UIValidationSeverity.Info, message);
}
