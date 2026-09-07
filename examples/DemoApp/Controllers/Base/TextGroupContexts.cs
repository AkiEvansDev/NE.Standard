using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Base;

/// <summary>
/// The text itself: the icon, the title, and — where the host has one — the description under it.
/// </summary>
/// <remarks>A page whose host draws no description passes none, and the three description rows are not added.</remarks>
internal sealed partial class TextContentGroupContext : TooltipGroupContext
{
    private const string SampleTooltip = "Shown on hover **and** on focus — see [the docs](https://example.com/docs).";

    // Carries prose that looks like markup and is not, plus a mark, so the row exercises the icon patch path.
    private const string MarkupDescription = "![" + DemoIcons.Alert + "] **Blocks** the pipeline — *3 * 4* retries against `retryCount`, see ~~deploy_log~~ [the run](https://example.com/runs/482).";

    private readonly string _sampleTitle;
    private readonly string? _sampleDescription;

    [RecursiveMember]
    public partial string? Icon { get; set; } = DemoIcons.BadgeCheck;

    [RecursiveMember]
    public partial UIThemeColor? IconColor { get; set; }

    [RecursiveMember]
    public partial UIIconSize? IconSize { get; set; }

    [RecursiveMember]
    public partial string? Title { get; set; }

    [RecursiveMember]
    public partial UITextAppearance? TitleType { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? TitleColor { get; set; }

    [RecursiveMember]
    public partial string? Description { get; set; }

    [RecursiveMember]
    public partial UITextAppearance? DescriptionType { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? DescriptionColor { get; set; }

    public TextContentGroupContext(string sampleTitle = "Require review before deploy", string? sampleDescription = null)
    {
        _sampleTitle = sampleTitle;
        _sampleDescription = sampleDescription;
        Title = sampleTitle;
        Description = sampleDescription;

        // Registered after the values above: a row prints what the option reads at the moment it is added.
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(IconColor), CycleIconColor, () => IconColor);
        AddOption(nameof(IconSize), CycleIconSize, () => IconSize);
        AddOption(nameof(Title), ToggleTitle, () => Title);
        AddOption(nameof(TitleType), CycleTitleType, () => TitleType);
        AddOption(nameof(TitleColor), CycleTitleColor, () => TitleColor);

        if (_sampleDescription is not null)
        {
            AddOption(nameof(Description), ToggleDescription, () => Description);
            AddOption(nameof(DescriptionType), CycleDescriptionType, () => DescriptionType);
            AddOption(nameof(DescriptionColor), CycleDescriptionColor, () => DescriptionColor);
        }

        AddTooltipOptions(SampleTooltip);
    }

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.BadgeCheck));

    // Both rows turn an icon on first, or they would be invisible no-ops.
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

    public void ToggleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, _sampleTitle));

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
            Title = _sampleTitle;
    }

    public void ToggleDescription()
        => SetLastChange(nameof(Description), Description = CycleValue(Description, null, _sampleDescription, MarkupDescription));

    // The two below show against text that is there, so each puts it back first.
    public void CycleDescriptionType()
    {
        CheckDescription();
        SetLastChange(nameof(DescriptionType), DescriptionType = CycleAppearance(DescriptionType));
    }

    public void CycleDescriptionColor()
    {
        CheckDescription();
        SetLastChange(nameof(DescriptionColor), DescriptionColor = CycleValue(DescriptionColor,
            null, UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Primary)));
    }

    private void CheckDescription()
    {
        if (string.IsNullOrEmpty(Description))
            Description = _sampleDescription;
    }
}

/// <summary>
/// How a text block lays itself out: where the lines sit, and whether they can be selected.
/// </summary>
internal partial class TextLayoutGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UITextAlignment? TextAlignment { get; set; }

    [RecursiveMember]
    public partial bool? Selectable { get; set; }

    public TextLayoutGroupContext()
    {
        AddOption(nameof(TextAlignment), CycleTextAlignment, () => TextAlignment);
        AddOption(nameof(Selectable), ToggleSelectable, () => Selectable);
    }

    public void CycleTextAlignment()
        => SetLastChange(nameof(TextAlignment), TextAlignment = CycleEnum(TextAlignment));

    public void ToggleSelectable()
        => SetLastChange(nameof(Selectable), Selectable = CycleValue(Selectable, null, true, false));
}

/// <summary>
/// A paragraph's layout: everything a text block has, plus how far it is allowed to run.
/// </summary>
internal sealed partial class ParagraphLayoutGroupContext : TextLayoutGroupContext
{
    [RecursiveMember]
    public partial UITextWrapMode? WrapMode { get; set; }

    [RecursiveMember]
    public partial int? MaxLines { get; set; }

    [RecursiveMember]
    public partial bool? ShowQuoteLine { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? QuoteLineColor { get; set; }

    public ParagraphLayoutGroupContext()
    {
        AddOption(nameof(WrapMode), CycleWrapMode, () => WrapMode);
        AddOption(nameof(MaxLines), CycleMaxLines, () => MaxLines);
        AddOption(nameof(ShowQuoteLine), ToggleShowQuoteLine, () => ShowQuoteLine);
        AddOption(nameof(QuoteLineColor), CycleQuoteLineColor, () => QuoteLineColor);
    }

    public void ToggleShowQuoteLine()
        => SetLastChange(nameof(ShowQuoteLine), ShowQuoteLine = ShowQuoteLine != true);

    // The line first, so the colour has something to show on.
    public void CycleQuoteLineColor()
    {
        ShowQuoteLine = true;
        SetLastChange(nameof(QuoteLineColor), QuoteLineColor = CycleValue(QuoteLineColor,
            null, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Warning)));
    }

    public void CycleWrapMode()
        => SetLastChange(nameof(WrapMode), WrapMode = CycleEnum(WrapMode));

    // Wrapping first, because a line limit against NoWrap is a limit of one either way.
    public void CycleMaxLines()
    {
        WrapMode = UITextWrapMode.Wrap;
        SetLastChange(nameof(MaxLines), MaxLines = CycleValue(MaxLines, 1, 2, null));
    }
}

/// <summary>
/// The badge a text component can carry beside its title — the same eight properties wherever text appears.
/// </summary>
internal sealed partial class TextBadgeGroupContext : DemoGroupContext
{
    private const string SampleBadgeText = "30 days";

    // Trailing rather than null: an inline badge has no far edge, so the BadgeAlignment rows would move nothing.
    [RecursiveMember]
    public partial UITextBadgePlacement? BadgePlacement { get; set; } = UITextBadgePlacement.Trailing;

    [RecursiveMember]
    public partial UIBadgeType? BadgeStyle { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? BadgeColor { get; set; }

    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    [RecursiveMember]
    public partial UIThemeColor? BadgeIconColor { get; set; }

    [RecursiveMember]
    public partial UIIconSize? BadgeIconSize { get; set; }

    [RecursiveMember]
    public partial string? BadgeText { get; set; } = SampleBadgeText;

    [RecursiveMember]
    public partial UITextAppearance? BadgeTextType { get; set; }

    [RecursiveMember]
    public partial string? BadgeTooltip { get; set; }

    [RecursiveMember]
    public partial UIPopupPlacement? BadgeTooltipPlacement { get; set; }

    public TextBadgeGroupContext()
    {
        AddOption(nameof(BadgePlacement), CycleBadgePlacement, () => BadgePlacement);
        AddOption(nameof(BadgeStyle), CycleBadgeStyle, () => BadgeStyle);
        AddOption(nameof(BadgeColor), CycleBadgeColor, () => BadgeColor);
        AddOption(nameof(BadgeIcon), CycleBadgeIcon, () => BadgeIcon);
        AddOption(nameof(BadgeIconColor), CycleBadgeIconColor, () => BadgeIconColor);
        AddOption(nameof(BadgeIconSize), CycleBadgeIconSize, () => BadgeIconSize);
        AddOption(nameof(BadgeText), ToggleBadgeText, () => BadgeText);
        AddOption(nameof(BadgeTextType), CycleBadgeTextType, () => BadgeTextType);
        AddOption(nameof(BadgeTooltip), ToggleBadgeTooltip, () => BadgeTooltip);
        AddOption(nameof(BadgeTooltipPlacement), CycleBadgeTooltipPlacement, () => BadgeTooltipPlacement);
    }

    public void CycleBadgePlacement()
        => SetLastChange(nameof(BadgePlacement), BadgePlacement = CycleEnum(BadgePlacement));

    public void CycleBadgeStyle()
        => SetLastChange(nameof(BadgeStyle), BadgeStyle = CycleEnum(BadgeStyle));

    // Set, it wins over BadgeStyle above.
    public void CycleBadgeColor()
        => SetLastChange(nameof(BadgeColor), BadgeColor = CycleValue(BadgeColor,
            null, UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromColorVariant(ColorName.NebulaRose)));

    public void CycleBadgeIcon()
        => SetLastChange(nameof(BadgeIcon), BadgeIcon = CycleIconValue(BadgeIcon, DemoIcons.Clock));

    // Both rows turn the badge icon on first, or they would be invisible no-ops.
    public void CycleBadgeIconColor()
    {
        CheckBadgeIcon();
        SetLastChange(nameof(BadgeIconColor), BadgeIconColor = CycleValue(BadgeIconColor, null, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger)));
    }

    public void CycleBadgeIconSize()
    {
        CheckBadgeIcon();
        SetLastChange(nameof(BadgeIconSize), BadgeIconSize = CycleEnum(BadgeIconSize));
    }

    private void CheckBadgeIcon()
    {
        if (string.IsNullOrEmpty(BadgeIcon))
            BadgeIcon = DemoIcons.Clock;
    }

    public void ToggleBadgeText()
        => SetLastChange(nameof(BadgeText), BadgeText = CycleValue(BadgeText, null, SampleBadgeText));

    public void CycleBadgeTextType()
    {
        CheckBadgeText();
        SetLastChange(nameof(BadgeTextType), BadgeTextType = CycleAppearance(BadgeTextType));
    }

    private void CheckBadgeText()
    {
        if (string.IsNullOrEmpty(BadgeText))
            BadgeText = SampleBadgeText;
    }

    public void ToggleBadgeTooltip()
        => SetLastChange(nameof(BadgeTooltip), BadgeTooltip = CycleValue(BadgeTooltip, null, "Artifacts are kept for 30 days."));

    public void CycleBadgeTooltipPlacement()
        => SetLastChange(nameof(BadgeTooltipPlacement), BadgeTooltipPlacement = CycleEnum(BadgeTooltipPlacement));
}

/// <summary>
/// The edge of anything that draws one; every cycle comes back to <see langword="null"/>, the component's own default.
/// </summary>
internal sealed partial class BorderGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? BorderColor { get; set; }

    [RecursiveMember]
    public partial UIThickness? BorderThickness { get; set; }

    [RecursiveMember]
    public partial UICornerRadius? BorderRadius { get; set; }

    public BorderGroupContext()
    {
        AddOption(nameof(BorderColor), CycleBorderColor, () => BorderColor);
        AddOption(nameof(BorderThickness), CycleBorderThickness, () => BorderThickness);
        AddOption(nameof(BorderRadius), CycleBorderRadius, () => BorderRadius);
    }

    // A colour draws nothing without a thickness, so a step that sets one brings the other on with it.
    public void CycleBorderColor()
    {
        SetLastChange(nameof(BorderColor), BorderColor = CycleValue(BorderColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Success), null));

        if (BorderColor is not null)
            BorderThickness ??= UIThickness.Uniform(2);
    }

    public void CycleBorderThickness()
        => SetLastChange(nameof(BorderThickness), BorderThickness = CycleValue(BorderThickness,
            UIThickness.Uniform(1), UIThickness.Uniform(2), UIThickness.Uniform(4), UIThickness.Uniform(0), null));

    public void CycleBorderRadius()
    {
        CheckBorderThickness();
        SetLastChange(nameof(BorderRadius), BorderRadius = CycleValue(BorderRadius, UICornerRadius.Uniform(2), UICornerRadius.Uniform(6), UICornerRadius.Uniform(12), null));
    }

    private void CheckBorderThickness()
    {
        BorderThickness ??= UIThickness.Uniform(2);
        BorderColor ??= UIThemeColor.FromStyle(UIColorStyle.Primary);
    }
}
