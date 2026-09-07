using DemoApp.Controllers.Base;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;

namespace DemoApp.Views.Base;

/// <summary>
/// Every property a button can be bound on, shared with the action, which adds only the trailing pair.
/// </summary>
internal static class DemoButtonBindings
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);

    public static T Bind<T>(T button, string buttonGroup, string contentGroup, string layoutGroup, string badgeGroup, string borderGroup)
        where T : ButtonComponent<T>, IUIComponentDefinition
        => button
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindType($"{buttonGroup}.{nameof(ButtonGroupContext.Type)}")
            .BindSize($"{buttonGroup}.{nameof(ButtonGroupContext.Size)}")
            .BindPadding($"{buttonGroup}.{nameof(ButtonGroupContext.Padding)}")
            .BindBackground($"{buttonGroup}.{nameof(ButtonGroupContext.Background)}")
            .BindOverflow($"{buttonGroup}.{nameof(ButtonGroupContext.Overflow)}")
            .BindIcon($"{contentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{contentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{contentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{contentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{contentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{contentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindDescription($"{contentGroup}.{nameof(TextContentGroupContext.Description)}")
            .BindDescriptionType($"{contentGroup}.{nameof(TextContentGroupContext.DescriptionType)}")
            .BindDescriptionColor($"{contentGroup}.{nameof(TextContentGroupContext.DescriptionColor)}")
            .BindTooltip($"{contentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{contentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindTextAlignment($"{layoutGroup}.{nameof(TextLayoutGroupContext.TextAlignment)}")
            .BindSelectable($"{layoutGroup}.{nameof(TextLayoutGroupContext.Selectable)}")
            .BindBadgePlacement($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{badgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{borderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{borderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{borderGroup}.{nameof(BorderGroupContext.BorderRadius)}");
}
