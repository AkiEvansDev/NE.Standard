using DemoApp.Controllers.Base;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Badge;

internal sealed partial class BadgeStyleGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIBadgeType? Style { get; set; } = UIBadgeType.Primary;

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    public void CycleStyle()
    {
        Color = null;
        SetLastChange(nameof(Style), Style = CycleValue(Style, UIBadgeType.Primary, UIBadgeType.Accent, UIBadgeType.Info, UIBadgeType.Warning, UIBadgeType.Success, UIBadgeType.Danger, UIBadgeType.Surface));
    }

    public void CycleColor()
    {
        Style = null;
        SetLastChange(nameof(Color), Color = CycleValue(Color, null, UIThemeColor.FromColorVariant(ColorName.StellarRed), UIThemeColor.FromColorVariant(ColorName.AuroraGreen)));
    }
}

internal sealed partial class BadgeContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.Star;

    [RecursiveMember]
    public partial UIThemeColor IconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    [RecursiveMember]
    public partial UIIconSize IconSize { get; set; } = UIIconSize.Small;

    [RecursiveMember]
    public partial UITextAppearance TextType { get; set; } = UITextAppearance.Caption;

    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.Star));

    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.OnPrimary), UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    public void CycleTextType()
        => SetLastChange(nameof(TextType), TextType = CycleValue(TextType,
            UITextAppearance.Caption, UITextAppearance.Overline, UITextAppearance.Body));

    public void ToggleTooltip()
        => SetLastChange(nameof(Tooltip), Tooltip = CycleValue(Tooltip, null, "A helpful hint"));

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = LucideIcons.Star;
    }
}

internal sealed partial class BadgeBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial BadgeStyleGroupContext StyleGroup { get; set; } = new();

    [RecursiveMember]
    public partial BadgeContentGroupContext ContentGroup { get; set; } = new();

    [UICommand]
    public void CycleStyle()
        => StyleGroup.CycleStyle();

    [UICommand]
    public void CycleColor()
        => StyleGroup.CycleColor();

    [UICommand]
    public void ToggleIcon()
        => ContentGroup.ToggleIcon();

    [UICommand]
    public void CycleIconColor()
        => ContentGroup.CycleIconColor();

    [UICommand]
    public void CycleIconSize()
        => ContentGroup.CycleIconSize();

    [UICommand]
    public void CycleTextType()
        => ContentGroup.CycleTextType();

    [UICommand]
    public void ToggleTooltip()
        => ContentGroup.ToggleTooltip();
}
