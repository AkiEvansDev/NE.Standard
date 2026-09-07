using System;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// A validation message a controller puts on an input: the severity and the text. Null on the property means none.
/// </summary>
public readonly record struct UIValidationMessage
{
    public UIValidationMessage(UIValidationSeverity severity, string message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        Severity = severity;
        Message = message;
    }

    public UIValidationSeverity Severity { get; }

    public string Message { get; }

    public static UIValidationMessage Error(string message)
        => new(UIValidationSeverity.Error, message);

    public static UIValidationMessage Warning(string message)
        => new(UIValidationSeverity.Warning, message);

    public static UIValidationMessage Info(string message)
        => new(UIValidationSeverity.Info, message);
}
