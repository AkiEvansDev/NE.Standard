using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// Represents the shared visual contract for text-based components.
/// </summary>
public interface ITextBaseComponent : ITextBaseModel, IVisualComponent
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
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeStyle"/>.
    /// </summary>
    static UIProperty BadgeStyleProperty { get; } = new(nameof(BadgeStyle));

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
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeText"/>.
    /// </summary>
    static UIProperty BadgeTextProperty { get; } = new(nameof(BadgeText));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTextType"/>.
    /// </summary>
    static UIProperty BadgeTextTypeProperty { get; } = new(nameof(BadgeTextType));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.BadgePlacement"/>.
    /// </summary>
    static UIProperty BadgePlacementProperty { get; } = new(nameof(BadgePlacement));

    /// <summary>
    /// Gets the registered property key for <see cref="ITextBaseModel.Tooltip"/>.
    /// </summary>
    static UIProperty TooltipProperty { get; } = new(nameof(Tooltip));

    /// <summary>
    /// Gets the registered property key for <see cref="IBadgeModel.BadgeTooltip"/>.
    /// </summary>
    static UIProperty BadgeTooltipProperty { get; } = new(nameof(BadgeTooltip));
}
