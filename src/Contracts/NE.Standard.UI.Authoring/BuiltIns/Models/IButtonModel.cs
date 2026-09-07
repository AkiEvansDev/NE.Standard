using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the data contract for button-like text content.
/// </summary>
public interface IButtonModel : ITextModel, IBindableGroup
{
    /// <summary>
    /// Gets the button's visual variant — Primary, Accent, Danger, Outline, Ghost, Link, or Surface.
    /// </summary>
    UIButtonType? Type { get; }

    /// <summary>
    /// Gets how much room the button takes — Small, Medium, or Large.
    /// </summary>
    UIButtonSize? Size { get; }
}
