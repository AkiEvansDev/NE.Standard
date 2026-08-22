using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the shared data contract for text-based UI models.
/// </summary>
public interface ITextBaseModel : IBadgeModel
{
    /// <summary>
    /// Gets the leading icon name.
    /// </summary>
    string? Icon { get; }

    /// <summary>
    /// Gets the leading icon color.
    /// </summary>
    UIThemeColor? IconColor { get; }

    /// <summary>
    /// Gets the leading icon size.
    /// </summary>
    UIIconSize? IconSize { get; }

    /// <summary>
    /// Gets the primary text.
    /// </summary>
    string? Title { get; }

    /// <summary>
    /// Gets the primary text type.
    /// </summary>
    UITextAppearance? TitleType { get; }

    /// <summary>
    /// Gets the primary text color.
    /// </summary>
    UIThemeColor? TitleColor { get; }

    /// <summary>
    /// Gets where badge content is placed.
    /// </summary>
    UITextBadgePlacement? BadgePlacement { get; }

    /// <summary>
    /// Gets the tooltip for the primary content.
    /// </summary>
    string? Tooltip { get; }

    /// <summary>
    /// Gets whether the model should be visible, optionally overridden per breakpoint — shares
    /// <see cref="UIResponsive{T}"/> with <see cref="Components.IVisualComponent.Visible"/>
    /// since a real visual component (e.g. <c>TextComponent</c>) implements both contracts through the
    /// same property; the responsive tiers are rarely useful for a plain bound item model, but nothing
    /// stops one from using them.
    /// </summary>
    UIResponsive<bool>? Visible { get; }

    /// <summary>
    /// Gets whether the model should be enabled.
    /// </summary>
    bool? Enabled { get; }
}
