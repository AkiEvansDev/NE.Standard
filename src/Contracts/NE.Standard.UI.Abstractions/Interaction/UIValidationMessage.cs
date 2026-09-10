using System;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// A validation message a controller puts on an input: the severity and the text. Null on the property means none.
/// </summary>
public readonly record struct UIValidationMessage
{
    /// <summary>A message of the given severity; the text may not be empty.</summary>
    public UIValidationMessage(UIValidationSeverity severity, string message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        Severity = severity;
        Message = message;
    }

    /// <summary>How the message is drawn and whether it refuses a submit.</summary>
    public UIValidationSeverity Severity { get; }

    /// <summary>The text shown under the input, or in its marker's tooltip.</summary>
    public string Message { get; }

    /// <summary>A message that refuses the value.</summary>
    public static UIValidationMessage Error(string message)
        => new(UIValidationSeverity.Error, message);

    /// <summary>A message that warns about the value without refusing it.</summary>
    public static UIValidationMessage Warning(string message)
        => new(UIValidationSeverity.Warning, message);

    /// <summary>A message that only tells the viewer something about the value.</summary>
    public static UIValidationMessage Info(string message)
        => new(UIValidationSeverity.Info, message);
}
