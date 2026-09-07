using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// What a button is, as opposed to what it says: its type, its size, and the box it draws around its label.
/// </summary>
/// <remarks>Shared by Button and Action, which adds only the trailing pair below.</remarks>
internal sealed partial class ButtonGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIButtonType? Type { get; set; }

    [RecursiveMember]
    public partial UIButtonSize? Size { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; }

    public ButtonGroupContext()
    {
        AddOption(nameof(Type), CycleType, () => Type);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
    }

    public void CycleType()
        => SetLastChange(nameof(Type), Type = CycleEnum(Type));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(20), null));

    // Background says which colour, Type says what is done with it.
    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background,
            UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

/// <summary>
/// The whole of what an action adds to a button: something at the far end of the row.
/// </summary>
internal sealed partial class ActionGroupContext : DemoGroupContext
{
    private const string SampleTrailingText = "3 pending";

    [RecursiveMember]
    public partial string? TrailingText { get; set; } = SampleTrailingText;

    [RecursiveMember]
    public partial string? TrailingIcon { get; set; }

    [RecursiveMember]
    public partial bool ShowChevron { get; set; } = true;

    public ActionGroupContext()
    {
        AddOption(nameof(TrailingText), ToggleTrailingText, () => TrailingText);
        AddOption(nameof(TrailingIcon), CycleTrailingIcon, () => TrailingIcon);
        AddOption(nameof(ShowChevron), ToggleShowChevron, () => ShowChevron);
    }

    public void ToggleTrailingText()
        => SetLastChange(nameof(TrailingText), TrailingText = CycleValue(TrailingText, null, SampleTrailingText));

    // The (none) step is not "no icon": an action draws its border-built chevron then.
    public void CycleTrailingIcon()
        => SetLastChange(nameof(TrailingIcon), TrailingIcon = CycleIconValue(TrailingIcon, DemoIcons.ExternalLink));

    // Off, and with no trailing icon, the far end is genuinely empty.
    public void ToggleShowChevron()
        => SetLastChange(nameof(ShowChevron), ShowChevron = !ShowChevron);
}

/// <summary>
/// A standalone badge, naming its parts without the <c>Badge</c> prefix a text component's own badge carries.
/// </summary>
internal sealed partial class BadgeGroupContext : TooltipGroupContext
{
    private const string SampleText = "In review";
    private const string SampleCount = "12";
    private const string SampleTooltip = "Waiting on two approvals";

    [RecursiveMember]
    public partial UIBadgeType? Style { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    [RecursiveMember]
    public partial string? Icon { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; }

    [RecursiveMember]
    public partial UIIconSize? IconSize { get; set; }

    [RecursiveMember]
    public partial string? Text { get; set; } = SampleText;

    [RecursiveMember]
    public partial UITextAppearance? TextType { get; set; }

    public BadgeGroupContext()
    {
        AddOption(nameof(Style), CycleStyle, () => Style);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(IconColor), CycleIconColor, () => IconColor);
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddOption(nameof(Text), CycleText, () => Text);
        AddOption(nameof(TextType), CycleTextType, () => TextType);
        AddTooltipOptions(SampleTooltip);
    }

    public void CycleStyle()
        => SetLastChange(nameof(Style), Style = CycleEnum(Style));

    // Color overrides Style: set, the pill carries that colour tinted rather than the style's own paint.
    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color,
            UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Warning), null));

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.Clock));

    // Both rows turn an icon on first, or they would be silent no-ops on a badge that has none.
    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor,
            null, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Danger)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = DemoIcons.Clock;
    }

    // The third step is a different pill: a count is drawn as a circle, a word is not.
    public void CycleText()
        => SetLastChange(nameof(Text), Text = CycleValue(Text, null, SampleText, SampleCount));

    public void CycleTextType()
    {
        CheckText();
        SetLastChange(nameof(TextType), TextType = CycleAppearance(TextType));
    }

    private void CheckText()
    {
        if (string.IsNullOrEmpty(Text))
            Text = SampleText;
    }
}
