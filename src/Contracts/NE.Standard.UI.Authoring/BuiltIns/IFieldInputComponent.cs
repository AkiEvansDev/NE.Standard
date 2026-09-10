using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input that draws a field surface of its own — the family that can be filled or underlined.
/// </summary>
public interface IFieldInputComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Appearance"/>.
    /// </summary>
    static UIProperty AppearanceProperty { get; } = new(nameof(Appearance));

    /// <summary>
    /// Gets or sets how the field surface is drawn; settable so a host that puts a field in a row of its own can choose the shape
    /// it takes there, as the key-value list makes an unset editor a filled box.
    /// </summary>
    UIInputAppearance? Appearance { get; set; }
}
