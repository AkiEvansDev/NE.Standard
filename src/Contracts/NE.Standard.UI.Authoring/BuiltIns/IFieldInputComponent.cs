using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input that draws a field surface of its own — the family that can be filled or underlined.
/// Toggles and sliders are inputs but draw no field, and are deliberately not part of it.
/// </summary>
public interface IFieldInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Appearance"/>.
    /// </summary>
    static UIProperty AppearanceProperty { get; } = new(nameof(Appearance));

    /// <summary>
    /// Gets how the field surface is drawn.
    /// </summary>
    UIInputAppearance? Appearance { get; }
}
