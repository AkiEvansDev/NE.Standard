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
    /// Gets the registered property key for <see cref="ShowFocusEdge"/>.
    /// </summary>
    static UIProperty ShowFocusEdgeProperty { get; } = new(nameof(ShowFocusEdge));

    /// <summary>
    /// Gets where the caption stands, decided once at render; a multi-line field's box always keeps it on top.
    /// </summary>
    UIInputTitlePlacement? TitlePlacement { get; }

    /// <summary>
    /// Gets or sets how the field surface is drawn; settable so a host can override the shape, as the key-value list does
    /// for an unset editor.
    /// </summary>
    UIInputAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets whether the field's edge takes the brand's colour while it holds the focus; off for a field its container and its
    /// caret already frame, as a composer that is a bubble's whole content. The hover and an open list still answer.
    /// </summary>
    bool? ShowFocusEdge { get; set; }
}
