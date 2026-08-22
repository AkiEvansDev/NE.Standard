using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the shared data contract for badge-based UI models.
/// </summary>
public interface IBadgeModel : IBindableItem
{
    /// <summary>
    /// Gets the badge visual variant.
    /// </summary>
    UIBadgeType? BadgeStyle { get; }

    /// <summary>
    /// Gets the badge icon name.
    /// </summary>
    string? BadgeIcon { get; }

    /// <summary>
    /// Gets the badge icon color.
    /// </summary>
    UIThemeColor? BadgeIconColor { get; }

    /// <summary>
    /// Gets the badge icon size.
    /// </summary>
    UIIconSize? BadgeIconSize { get; }

    /// <summary>
    /// Gets the badge text.
    /// </summary>
    string? BadgeText { get; }

    /// <summary>
    /// Gets the badge text type.
    /// </summary>
    UITextAppearance? BadgeTextType { get; }

    /// <summary>
    /// Gets the tooltip for the badge content.
    /// </summary>
    string? BadgeTooltip { get; }
}
