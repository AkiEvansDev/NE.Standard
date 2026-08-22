using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input whose value is entered and displayed as *formatted text* — a date typed as "03.04.2026", a
/// number typed with grouping — so turning what the user typed into a value needs the component's own
/// format and culture, not just the target type.
/// </summary>
/// <remarks>
/// The contract exists so those two are reachable from the runtime. Property keys declared with
/// <c>Contract = typeof(...)</c> put their <see cref="UIProperty"/> on the interface, and this assembly is
/// one of the few the engine is allowed to reference — a key living on the concrete component in
/// <c>NE.Standard.UI.Components</c> would be invisible to it, which is exactly why
/// <c>Format</c>/<c>Culture</c> were unreachable before.
/// </remarks>
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
