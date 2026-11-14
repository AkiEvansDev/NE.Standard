namespace DemoApp.Controllers.Base;

/// <summary>
/// What a button is, as opposed to what it says: its variant, its size, and the box it draws around its label.
/// </summary>
/// <remarks>Shared by Button and Action, which adds only the trailing pair below.</remarks>
internal sealed partial class ButtonGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIButtonVariant? Variant { get; set; }

    [RecursiveMember]
    public partial UISize? Size { get; set; }

    [RecursiveMember]
    public partial UITextAlignment? TextAlignment { get; set; }

    [RecursiveMember]
    public partial UIResponsive<UIThickness>? Padding { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Background { get; set; }

    [RecursiveMember]
    public partial UIOverflow? Overflow { get; set; } = UIOverflow.Hidden;

    [RecursiveMember]
    public partial string? Shortcut { get; set; }

    public ButtonGroupContext()
    {
        AddOption(nameof(Variant), CycleVariant, () => Variant);
        AddOption(nameof(Size), CycleSize, () => Size);
        AddOption(nameof(TextAlignment), CycleTextAlignment, () => TextAlignment);
        AddOption(nameof(Padding), CyclePadding, () => Padding);
        AddOption(nameof(Background), CycleBackground, () => Background);
        AddOption(nameof(Overflow), CycleOverflow, () => Overflow);
        AddOption(nameof(Shortcut), ToggleShortcut, () => Shortcut);
    }

    public void CycleVariant()
        => SetLastChange(nameof(Variant), Variant = CycleEnum(Variant));

    public void CycleSize()
        => SetLastChange(nameof(Size), Size = CycleEnum(Size));

    public void CycleTextAlignment()
        => SetLastChange(nameof(TextAlignment), TextAlignment = CycleEnum(TextAlignment));

    public void CyclePadding()
        => SetLastChange(nameof(Padding), Padding = CycleValue(Padding, UIThickness.Uniform(4), UIThickness.Uniform(20), null));

    // Background says which colour, Variant says what is done with it.
    public void CycleBackground()
        => SetLastChange(nameof(Background), Background = CycleValue(Background, UIThemeColor.FromStyle(UIColorStyle.Surface), UIThemeColor.FromStyle(UIColorStyle.Info), null));

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));

    // A chord the page may take: the browser hands Ctrl+K over, where it keeps Ctrl+T and Ctrl+W.
    public void ToggleShortcut()
        => SetLastChange(nameof(Shortcut), Shortcut = CycleValue(Shortcut, "Ctrl+K", null));
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
    private const string SampleTitle = "In review";
    private const string SampleCount = "12";
    private const string SampleTooltip = "Waiting on two approvals";

    [RecursiveMember]
    public partial UIBadgeVariant? Variant { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    [RecursiveMember]
    public partial UIBadgeFill? Fill { get; set; }

    [RecursiveMember]
    public partial string? Icon { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; }

    [RecursiveMember]
    public partial UISize? IconSize { get; set; }

    [RecursiveMember]
    public partial string? Title { get; set; } = SampleTitle;

    [RecursiveMember]
    public partial UITextAppearance? TitleType { get; set; }

    public BadgeGroupContext()
    {
        AddOption(nameof(Variant), CycleVariant, () => Variant);
        AddOption(nameof(Color), CycleColor, () => Color);
        AddOption(nameof(Fill), CycleFill, () => Fill);
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(IconColor), CycleIconColor, () => IconColor);
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddOption(nameof(Title), CycleTitle, () => Title);
        AddOption(nameof(TitleType), CycleTitleType, () => TitleType);
        AddTooltipOptions(SampleTooltip);
    }

    public void CycleVariant()
        => SetLastChange(nameof(Variant), Variant = CycleEnum(Variant));

    // Color overrides Variant: set, the pill carries that colour tinted rather than the variant's own paint.
    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Warning), null));

    // Unset, a Variant fills and a Color tints; set, either one wears the fill named.
    public void CycleFill()
        => SetLastChange(nameof(Fill), Fill = CycleEnum(Fill));

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.Clock));

    // Both rows turn an icon on first, or they would be silent no-ops on a badge that has none.
    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, null, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Warning), UIThemeColor.FromStyle(UIColorStyle.Danger)));
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
    public void CycleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, SampleTitle, SampleCount));

    public void CycleTitleType()
    {
        CheckTitle();
        SetLastChange(nameof(TitleType), TitleType = CycleAppearance(TitleType));
    }

    private void CheckTitle()
    {
        if (string.IsNullOrEmpty(Title))
            Title = SampleTitle;
    }
}
