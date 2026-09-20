using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents an input that draws a field surface of its own — the family that can be filled or underlined.
/// </summary>
public interface IFieldInputComponent : ISizedInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Appearance"/>.
    /// </summary>
    static UIProperty AppearanceProperty { get; } = new(nameof(Appearance));

    /// <summary>
    /// Gets the registered property key for <see cref="TitlePlacement"/>.
    /// </summary>
    static UIProperty TitlePlacementProperty { get; } = new(nameof(TitlePlacement));

    /// <summary>
    /// Gets where the caption stands, decided once at render; a multi-line field's box always keeps it on top.
    /// </summary>
    UIInputTitlePlacement? TitlePlacement { get; }

    /// <summary>
    /// Gets or sets how the field surface is drawn; settable so a host can override the shape, as the key-value list does
    /// for an unset editor.
    /// </summary>
    UIInputAppearance? Appearance { get; set; }
}
