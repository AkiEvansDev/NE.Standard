using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input whose value is entered and displayed as formatted text, so parsing it needs the component's own
/// format and culture, not just the target type.
/// </summary>
public interface IFormattedInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Format"/>.
    /// </summary>
    static UIProperty FormatProperty { get; } = new(nameof(Format));

    /// <summary>
    /// Gets the registered property key for <see cref="DisplayFormat"/>.
    /// </summary>
    static UIProperty DisplayFormatProperty { get; } = new(nameof(DisplayFormat));

    /// <summary>
    /// Gets the registered property key for <see cref="Culture"/>.
    /// </summary>
    static UIProperty CultureProperty { get; } = new(nameof(Culture));

    /// <summary>
    /// Gets the registered property key for <see cref="FormatMessage"/>.
    /// </summary>
    static UIProperty FormatMessageProperty { get; } = new(nameof(FormatMessage));

    /// <summary>
    /// Gets the format string used to parse what the user typed.
    /// </summary>
    string? Format { get; }

    /// <summary>
    /// Gets the format string used to display the value.
    /// </summary>
    string? DisplayFormat { get; }

    /// <summary>
    /// Gets the culture used to parse and format the value.
    /// </summary>
    string? Culture { get; }

    /// <summary>
    /// Gets the message shown when what the user typed cannot be read as <see cref="Format"/>.
    /// </summary>
    string? FormatMessage { get; }
}
