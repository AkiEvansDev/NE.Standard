using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the data contract for text content with optional description and layout metadata.
/// </summary>
public interface ITextModel : ITextBaseModel
{
    /// <summary>
    /// Gets the secondary text.
    /// </summary>
    string? Description { get; }

    /// <summary>
    /// Gets the secondary text type.
    /// </summary>
    UITextAppearance? DescriptionType { get; }

    /// <summary>
    /// Gets the secondary text color.
    /// </summary>
    UIThemeColor? DescriptionColor { get; }

    /// <summary>
    /// Gets the text alignment.
    /// </summary>
    UITextAlignment? TextAlignment { get; }

    /// <summary>
    /// Gets the text wrapping behavior.
    /// </summary>
    UITextWrapMode? WrapMode { get; }

    /// <summary>
    /// Gets the maximum number of rendered text lines.
    /// </summary>
    int? MaxLines { get; }

    /// <summary>
    /// Gets whether the text can be selected.
    /// </summary>
    bool? Selectable { get; }
}
