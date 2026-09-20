using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
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
    /// Gets where the panel stands: centred, or a sheet against one viewport edge; a shortcut over the size/alignment members
    /// below, which win when set.
    /// </summary>
    public UIDialogPlacement Placement { get; init; } = UIDialogPlacement.Center;

    /// <summary>
    /// Gets the panel's width on the overlay, per tier; unset, a centred panel is sized to its content under the platform's cap.
    /// </summary>
    public UIResponsive<UILayoutLength>? Width { get; init; }

    /// <summary>
    /// Gets the least width the panel takes, per tier.
    /// </summary>
    public UIResponsive<UILayoutLength>? MinWidth { get; init; }

    /// <summary>
    /// Gets the most width the panel takes, per tier.
    /// </summary>
    public UIResponsive<UILayoutLength>? MaxWidth { get; init; }

    /// <summary>
    /// Gets the panel's height on the overlay, per tier; unset, the panel is as tall as its content.
    /// </summary>
    public UIResponsive<UILayoutLength>? Height { get; init; }

    /// <summary>
    /// Gets the least height the panel takes, per tier.
    /// </summary>
    public UIResponsive<UILayoutLength>? MinHeight { get; init; }

    /// <summary>
    /// Gets the most height the panel takes, per tier.
    /// </summary>
    public UIResponsive<UILayoutLength>? MaxHeight { get; init; }

    /// <summary>
    /// Gets where the panel stands across the overlay; unset, <see cref="Placement"/> decides.
    /// </summary>
    public UIAlignment? HorizontalAlignment { get; init; }

    /// <summary>
    /// Gets where the panel stands down the overlay; unset, <see cref="Placement"/> decides.
    /// </summary>
    public UIAlignment? VerticalAlignment { get; init; }

    /// <summary>
    /// Gets the room kept between the panel and the overlay's edges, per tier.
    /// </summary>
    public UIResponsive<UIThickness>? Margin { get; init; }

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
    /// Registers a command invoked when the viewer dismisses the dialog (Escape or a backdrop click); a server-requested close
    /// raises nothing.
    /// </summary>
    /// <remarks>The event is registered on the dialog's content component, which is what the client raises it on.</remarks>
    public UIDialog OnClose(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        _ = Content.On(EventNames.Close, command, arguments);
        return this;
    }
}
