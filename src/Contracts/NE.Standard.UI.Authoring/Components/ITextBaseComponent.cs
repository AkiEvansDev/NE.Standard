using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component carrying a name: a leading mark, one line of text, and a badge qualifying it.
/// </summary>
public interface ITextBaseComponent : ITextBaseModel, ITooltipComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.Icon"/>.
    /// </summary>
    static UIProperty IconProperty { get; } = new(nameof(Icon));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.IconColor"/>.
    /// </summary>
    static UIProperty IconColorProperty { get; } = new(nameof(IconColor));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.IconSize"/>.
    /// </summary>
    static UIProperty IconSizeProperty { get; } = new(nameof(IconSize));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.IconShape"/>.
    /// </summary>
    static UIProperty IconShapeProperty { get; } = new(nameof(IconShape));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.IconFallback"/>.
    /// </summary>
    static UIProperty IconFallbackProperty { get; } = new(nameof(IconFallback));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.Title"/>.
    /// </summary>
    static UIProperty TitleProperty { get; } = new(nameof(Title));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.TitleType"/>.
    /// </summary>
    static UIProperty TitleTypeProperty { get; } = new(nameof(TitleType));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.TitleColor"/>.
    /// </summary>
    static UIProperty TitleColorProperty { get; } = new(nameof(TitleColor));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeVariant"/>.
    /// </summary>
    static UIProperty BadgeVariantProperty { get; } = new(nameof(BadgeVariant));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeColor"/>.
    /// </summary>
    static UIProperty BadgeColorProperty { get; } = new(nameof(BadgeColor));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeFill"/>.
    /// </summary>
    static UIProperty BadgeFillProperty { get; } = new(nameof(BadgeFill));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeIcon"/>.
    /// </summary>
    static UIProperty BadgeIconProperty { get; } = new(nameof(BadgeIcon));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeIconColor"/>.
    /// </summary>
    static UIProperty BadgeIconColorProperty { get; } = new(nameof(BadgeIconColor));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeIconSize"/>.
    /// </summary>
    static UIProperty BadgeIconSizeProperty { get; } = new(nameof(BadgeIconSize));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTitle"/>.
    /// </summary>
    static UIProperty BadgeTitleProperty { get; } = new(nameof(BadgeTitle));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTitleType"/>.
    /// </summary>
    static UIProperty BadgeTitleTypeProperty { get; } = new(nameof(BadgeTitleType));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.BadgePlacement"/>.
    /// </summary>
    static UIProperty BadgePlacementProperty { get; } = new(nameof(BadgePlacement));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTooltip"/>.
    /// </summary>
    static UIProperty BadgeTooltipProperty { get; } = new(nameof(BadgeTooltip));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTooltipPlacement"/>.
    /// </summary>
    static UIProperty BadgeTooltipPlacementProperty { get; } = new(nameof(BadgeTooltipPlacement));
}
