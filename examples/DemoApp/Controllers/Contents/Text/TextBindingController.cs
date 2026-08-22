using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Text;

internal sealed partial class TextTypographyGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextAppearance TitleType { get; set; } = UITextAppearance.Title;

    [RecursiveMember]
    public partial UITextAlignment TextAlignment { get; set; } = UITextAlignment.Start;

    [RecursiveMember]
    public partial UITextWrapMode WrapMode { get; set; } = UITextWrapMode.Wrap;

    [RecursiveMember]
    public partial bool Selectable { get; set; }

    public void CycleTitleType()
        => SetLastChange(nameof(TitleType), TitleType = CycleValue(TitleType,
            UITextAppearance.Display, UITextAppearance.Title, UITextAppearance.Subtitle,
            UITextAppearance.Body, UITextAppearance.Caption, UITextAppearance.Overline,
            UITextAppearance.Custom(28, weight: 700)));

    public void CycleTextAlignment()
        => SetLastChange(nameof(TextAlignment), TextAlignment = CycleEnum(TextAlignment));

    public void CycleWrapMode()
        => SetLastChange(nameof(WrapMode), WrapMode = CycleEnum(WrapMode));

    public void ToggleSelectable()
        => SetLastChange(nameof(Selectable), Selectable = !Selectable);
}

internal sealed partial class TextIconGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.Star;

    [RecursiveMember]
    public partial UIThemeColor IconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial UIIconSize IconSize { get; set; } = UIIconSize.Medium;

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.Star));

    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Default)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = LucideIcons.Star;
    }
}

internal sealed partial class TextBadgeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextBadgePlacement BadgePlacement { get; set; } = UITextBadgePlacement.Inline;

    [RecursiveMember]
    public partial UIBadgeType BadgeStyle { get; set; } = UIBadgeType.Info;

    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    [RecursiveMember]
    public partial UITextAppearance BadgeTextType { get; set; } = UITextAppearance.Caption;

    public void CycleBadgePlacement()
        => SetLastChange(nameof(BadgePlacement), BadgePlacement = CycleEnum(BadgePlacement));

    public void CycleBadgeStyle()
        => SetLastChange(nameof(BadgeStyle), BadgeStyle = CycleValue(BadgeStyle, UIBadgeType.Info, UIBadgeType.Warning, UIBadgeType.Success, UIBadgeType.Danger, UIBadgeType.Primary, UIBadgeType.Accent, UIBadgeType.Surface));

    public void ToggleBadgeIcon()
        => SetLastChange(nameof(BadgeIcon), BadgeIcon = CycleValue(BadgeIcon, null, LucideIcons.Star));

    public void CycleBadgeTextType()
        => SetLastChange(nameof(BadgeTextType), BadgeTextType = CycleValue(BadgeTextType,
            UITextAppearance.Caption, UITextAppearance.Overline, UITextAppearance.Body));
}

internal sealed partial class TextDescriptionGroupContext : DemoGroupContext
{
    private const string SampleDescription = "A longer supporting description that demonstrates the default muted, smaller styling.";

    [RecursiveMember]
    public partial string? Description { get; set; } = SampleDescription;

    [RecursiveMember]
    public partial UITextAppearance DescriptionType { get; set; } = UITextAppearance.Body;

    [RecursiveMember]
    public partial UIThemeColor DescriptionColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Muted);

    public void ToggleDescription()
        => SetLastChange(nameof(Description), Description = CycleValue(Description, null, SampleDescription));

    public void CycleDescriptionType()
    {
        CheckDescription();
        SetLastChange(nameof(DescriptionType), DescriptionType = CycleValue(DescriptionType,
            UITextAppearance.Body, UITextAppearance.Caption, UITextAppearance.Subtitle));
    }

    public void CycleDescriptionColor()
    {
        CheckDescription();
        SetLastChange(nameof(DescriptionColor), DescriptionColor = CycleValue(DescriptionColor, UIThemeColor.FromStyle(UIColorStyle.Muted), UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.OnSurface), UIThemeColor.FromStyle(UIColorStyle.Primary)));
    }

    private void CheckDescription()
    {
        if (string.IsNullOrEmpty(Description))
            Description = SampleDescription;
    }
}

internal sealed partial class TextBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TextTypographyGroupContext TypographyGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextIconGroupContext IconGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextDescriptionGroupContext DescriptionGroup { get; set; } = new();

    [UICommand]
    public void CycleTitleType()
        => TypographyGroup.CycleTitleType();

    [UICommand]
    public void CycleTextAlignment()
        => TypographyGroup.CycleTextAlignment();

    [UICommand]
    public void CycleWrapMode()
        => TypographyGroup.CycleWrapMode();

    [UICommand]
    public void ToggleSelectable()
        => TypographyGroup.ToggleSelectable();

    [UICommand]
    public void ToggleIcon()
        => IconGroup.ToggleIcon();

    [UICommand]
    public void CycleIconColor()
        => IconGroup.CycleIconColor();

    [UICommand]
    public void CycleIconSize()
        => IconGroup.CycleIconSize();

    [UICommand]
    public void CycleBadgePlacement()
        => BadgeGroup.CycleBadgePlacement();

    [UICommand]
    public void CycleBadgeStyle()
        => BadgeGroup.CycleBadgeStyle();

    [UICommand]
    public void ToggleBadgeIcon()
        => BadgeGroup.ToggleBadgeIcon();

    [UICommand]
    public void CycleBadgeTextType()
        => BadgeGroup.CycleBadgeTextType();

    [UICommand]
    public void ToggleDescription()
        => DescriptionGroup.ToggleDescription();

    [UICommand]
    public void CycleDescriptionType()
        => DescriptionGroup.CycleDescriptionType();

    [UICommand]
    public void CycleDescriptionColor()
        => DescriptionGroup.CycleDescriptionColor();
}
