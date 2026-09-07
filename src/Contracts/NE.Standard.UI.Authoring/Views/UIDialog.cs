using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// Defines a dialog declared by an authored UI view.
/// </summary>
public sealed class UIDialog
{
    /// <summary>
    /// Gets the dialog's stable key — the same key <see cref="OpenDialogEffect"/>,
    /// <see cref="CloseDialogEffect"/>, and the dialog service address it by.
    /// </summary>
    public required string Key { get; init; }

    /// <summary>
    /// Gets the component tree the dialog renders inside its panel.
    /// </summary>
    public required IVisualComponent Content { get; init; }

    /// <summary>
    /// Gets what the dialog's panel is made of.
    /// </summary>
    public UISurfaceStyle Surface { get; init; } = UISurfaceStyle.Raised;

    /// <summary>
    /// Gets where the panel stands: centred, or as a sheet against one edge of the viewport.
    /// </summary>
    public UIDialogPlacement Placement { get; init; } = UIDialogPlacement.Center;

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

    /// <summary>
    /// Registers a command invoked when the viewer dismisses the dialog — Escape or a click on the backdrop; a close the server
    /// asked for raises nothing.
    /// </summary>
    /// <remarks>The event is registered on the dialog's content component, which is what the client raises it on.</remarks>
    public UIDialog OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = Content.On(EventNames.Close, command, arguments);
        return this;
    }
}
