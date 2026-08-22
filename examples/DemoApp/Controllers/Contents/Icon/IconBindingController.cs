using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Contents.Icon;

internal sealed partial class IconStyleGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor Color { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial UIIconSize Size { get; set; } = UIIconSize.Large;

    public void CycleStyle()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Info), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger)));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));
}

internal sealed partial class IconContentGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.Star;

    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, LucideIcons.Star, LucideIcons.Heart, LucideIcons.Bell));

    public void ToggleTooltip()
        => SetLastChange(nameof(Tooltip), Tooltip = CycleValue(Tooltip, null, "A helpful hint"));
}

internal sealed partial class IconBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial IconStyleGroupContext StyleGroup { get; set; } = new();

    [RecursiveMember]
    public partial IconContentGroupContext ContentGroup { get; set; } = new();

    [UICommand]
    public void CycleStyle()
        => StyleGroup.CycleStyle();

    [UICommand]
    public void CycleSize()
        => StyleGroup.CycleSize();

    [UICommand]
    public void CycleIcon()
        => ContentGroup.CycleIcon();

    [UICommand]
    public void ToggleTooltip()
        => ContentGroup.ToggleTooltip();
}
