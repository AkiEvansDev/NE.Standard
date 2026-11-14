namespace DemoApp.Controllers.Base;

/// <summary>
/// What makes a word a link: where it points, and the title it shows there.
/// </summary>
internal sealed partial class LinkGroupContext : DemoGroupContext
{
    private const string SampleUrl = "https://docs.orvane.example/rollout";
    private const string SampleTitle = "The rollout plan";

    [RecursiveMember]
    public partial string? Url { get; set; } = SampleUrl;

    [RecursiveMember]
    public partial string? Title { get; set; } = SampleTitle;

    [RecursiveMember]
    public partial UITextAppearance? TitleType { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? TitleColor { get; set; }

    public LinkGroupContext()
    {
        AddOption(nameof(Url), ToggleUrl, () => Url);
        AddOption(nameof(Title), ToggleTitle, () => Title);
        AddOption(nameof(TitleType), CycleTitleType, () => TitleType);
        AddOption(nameof(TitleColor), CycleTitleColor, () => TitleColor);
    }

    // With no address the word is still drawn, but goes nowhere.
    public void ToggleUrl()
        => SetLastChange(nameof(Url), Url = CycleValue(Url, null, SampleUrl));

    public void ToggleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, SampleTitle));

    public void CycleTitleType()
    {
        CheckTitle();
        SetLastChange(nameof(TitleType), TitleType = CycleAppearance(TitleType));
    }

    public void CycleTitleColor()
    {
        CheckTitle();
        SetLastChange(nameof(TitleColor), TitleColor = CycleValue(TitleColor, null, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger)));
    }

    private void CheckTitle()
    {
        if (string.IsNullOrEmpty(Title))
            Title = SampleTitle;
    }
}

/// <summary>
/// A link's leading glyph and hover tooltip.
/// </summary>
internal sealed partial class LinkIconGroupContext : TooltipGroupContext
{
    private const string SampleTooltip = "Shown on hover **and** on focus — see [the docs](https://docs.orvane.example).";

    [RecursiveMember]
    public partial string? Icon { get; set; } = DemoIcons.BadgeCheck;

    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; }

    [RecursiveMember]
    public partial UISize? IconSize { get; set; }

    public LinkIconGroupContext()
    {
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(IconColor), CycleIconColor, () => IconColor);
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddTooltipOptions(SampleTooltip);
    }

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.BadgeCheck));

    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, null, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Default)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = DemoIcons.BadgeCheck;
    }
}

/// <summary>
/// A rule between things, and the one thing that turns it into a heading: a word in the middle of it.
/// </summary>
internal sealed partial class SeparatorGroupContext : DemoGroupContext
{
    private const string SampleTitle = "Danger zone";

    [RecursiveMember]
    public partial UIOrientation? Orientation { get; set; }

    [RecursiveMember]
    public partial string? Title { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? Color { get; set; }

    /// <summary>
    /// Which way the preview stacks what the rule stands between — the opposite of the rule's own orientation.
    /// </summary>
    [RecursiveMember]
    public partial UIOrientation PreviewOrientation { get; set; } = UIOrientation.Vertical;

    public SeparatorGroupContext()
    {
        AddOption(nameof(Orientation), CycleOrientation, () => Orientation);
        AddOption(nameof(Title), ToggleTitle, () => Title);
        AddOption(nameof(Color), CycleColor, () => Color);
    }

    public void CycleOrientation()
    {
        SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

        PreviewOrientation = Orientation == UIOrientation.Vertical ? UIOrientation.Horizontal : UIOrientation.Vertical;
    }

    public void ToggleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, SampleTitle));

    public void CycleColor()
        => SetLastChange(nameof(Color), Color = CycleValue(Color, UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Danger), null));
}
