using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Defines a dialog declared by an authored UI view.
/// </summary>
public sealed class UIDialog
{
    /// <summary>
    /// Gets the stable dialog key.
    /// </summary>
    public required string Key { get; init; }

    /// <summary>
    /// Gets the root dialog content component.
    /// </summary>
    public required IVisualComponent Content { get; init; }

    /// <summary>
    /// Gets what the dialog's panel is made of.
    /// </summary>
    /// <remarks>
    /// A card is the right answer for a question asked over a page. A dialog that fills most of the screen and
    /// holds a whole task is not a card floating over anything — it is a screen, and the page background
    /// inside a border is what says so.
    /// </remarks>
    public UIDialogSurface Surface { get; init; } = UIDialogSurface.Card;

    /// <summary>
    /// Gets whether the dialog blocks interaction with the underlying view.
    /// </summary>
    public bool Modal { get; init; } = true;

    /// <summary>
    /// Gets whether clicking the backdrop closes the dialog.
    /// </summary>
    public bool CloseOnBackdrop { get; init; } = true;

    /// <summary>
    /// Gets whether pressing Escape closes the dialog.
    /// </summary>
    public bool CloseOnEscape { get; init; } = true;
}
