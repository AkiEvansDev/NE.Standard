using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
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
    public UISurfaceStyle Surface { get; init; } = UISurfaceStyle.Raised;

    /// <summary>
    /// Gets where the panel stands.
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
