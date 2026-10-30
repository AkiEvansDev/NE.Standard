using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;
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
    /// The role of the badge's title when unset.
    /// </summary>
    static UITextAppearance DefaultBadgeTitleType { get; } = UITextAppearance.Overline;

    /// <summary>
    /// Gets the badge visual variant.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIBadgeVariant.Info)]
    UIBadgeVariant? BadgeVariant { get; }

    /// <summary>
    /// Gets the badge's own colour, overriding <see cref="BadgeVariant"/> when set — a tag or a category swatch,
    /// which the closed variant enum cannot name.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIThemeColor? BadgeColor { get; }

    /// <summary>
    /// Gets how the badge spends its colour; unset, a variant fills and a <see cref="BadgeColor"/> tints. A plain badge ignores it.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIBadgeFill? BadgeFill { get; }

    /// <summary>
    /// Gets the icon shown beside the badge's title, by name from the registered icon font/set.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    string? BadgeIcon { get; }

    /// <summary>
    /// Gets the badge icon's colour, defaulting to <see cref="DefaultBadgeIconColor"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeIconColor))]
    UIThemeColor? BadgeIconColor { get; }

    /// <summary>
    /// Gets the badge icon size. Left unset the glyph is as tall as the badge's title.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UISize? BadgeIconSize { get; }

    /// <summary>
    /// Gets the short text drawn inside the badge, beside its icon.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIPhrase? BadgeTitle { get; }

    /// <summary>
    /// Gets the role of the badge's title, defaulting to <see cref="DefaultBadgeTitleType"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultBadgeTitleType))]
    UITextAppearance? BadgeTitleType { get; }

    /// <summary>
    /// Gets the tooltip for the badge content.
    /// </summary>
    [Translatable]
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = null)]
    UIPhrase? BadgeTooltip { get; }

    /// <summary>
    /// Gets the side the badge's own tooltip prefers, placed against the badge rather than against the row.
    /// </summary>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UIPopupPlacement.Top)]
    UIPopupPlacement? BadgeTooltipPlacement { get; }
}
