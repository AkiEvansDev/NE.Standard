using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the data contract for button-like text content.
/// </summary>
public interface IButtonModel : ITextModel
{
    /// <summary>
    /// Gets the button visual type.
    /// </summary>
    UIButtonType? Type { get; }
}
