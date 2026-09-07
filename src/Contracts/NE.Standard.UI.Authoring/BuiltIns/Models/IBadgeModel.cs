using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents the shared data contract for badge-based UI models.
/// </summary>
public interface IBadgeModel : IBindableItem
{
    /// <summary>
    /// The badge icon's colour when unset: <c>Default</c> resolves to <c>color: inherit</c>, so the glyph
    /// follows whatever the badge is painted in.
    /// </summary>
    static UIThemeColor DefaultBadgeIconColor { get; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// The badge text's role when unset.
    /// </summary>
    static UITextAppearance DefaultBadgeTextType { get; } = UITextAppearance.Overline;

    /// <summary>
    /// Gets the badge visual variant.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIBadgeType.Info)]
    UIBadgeType? BadgeStyle { get; }

    /// <summary>
    /// Gets the badge's own colour, overriding <see cref="BadgeStyle"/> when set — a tag or a category swatch,
    /// which the closed style enum cannot name.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIThemeColor? BadgeColor { get; }

    /// <summary>
    /// Gets the icon shown beside the badge text, by name from the registered icon font/set.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? BadgeIcon { get; }

    /// <summary>
    /// Gets the badge icon's colour, defaulting to <see cref="DefaultBadgeIconColor"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeIconColor))]
    UIThemeColor? BadgeIconColor { get; }

    /// <summary>
    /// Gets the badge icon size. Left unset the glyph is as tall as the badge's own text.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIIconSize? BadgeIconSize { get; }

    /// <summary>
    /// Gets the short text drawn inside the badge, beside its icon.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? BadgeText { get; }

    /// <summary>
    /// Gets the badge text's role, defaulting to <see cref="DefaultBadgeTextType"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeTextType))]
    UITextAppearance? BadgeTextType { get; }

    /// <summary>
    /// Gets the tooltip for the badge content.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? BadgeTooltip { get; }

    /// <summary>
    /// Gets the side the badge's own tooltip prefers, placed against the badge rather than against the row.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIPopupPlacement.Top)]
    UIPopupPlacement? BadgeTooltipPlacement { get; }
}
