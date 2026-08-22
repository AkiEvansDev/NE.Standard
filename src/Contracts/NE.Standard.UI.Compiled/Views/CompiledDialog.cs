using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compiled.Views;

/// <summary>
/// Represents a compiled dialog entry in a view.
/// </summary>
public sealed class CompiledDialog
{
    /// <summary>
    /// Gets the stable dialog key.
    /// </summary>
    public required string Key { get; init; }

    /// <summary>
    /// Gets the root component id rendered in the dialog.
    /// </summary>
    public required UIComponentId RootComponentId { get; init; }

    /// <summary>
    /// Gets what the dialog's panel is made of.
    /// </summary>
    public UIDialogSurface Surface { get; init; }

    /// <summary>
    /// Gets whether the dialog blocks interaction with the underlying view.
    /// </summary>
    public bool Modal { get; init; }

    /// <summary>
    /// Gets whether clicking the backdrop closes the dialog.
    /// </summary>
    public bool CloseOnBackdrop { get; init; }

    /// <summary>
    /// Gets whether pressing Escape closes the dialog.
    /// </summary>
    public bool CloseOnEscape { get; init; }
}
