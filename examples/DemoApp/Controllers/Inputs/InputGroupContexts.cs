using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Inputs;

/// <summary>
/// Binding-page group contexts shared across the input pages. The three below the first one model the
/// <c>TextInputComponentBase</c> surface — label, badge, border — which Checkbox, Switch, TextInput and
/// TextArea all inherit unchanged, so one set of cycle steps serves every one of their binding pages
/// instead of four identical copies. The views still spell their bindings out separately, since those are
/// typed against different components.
/// </summary>
/// <remarks>
/// Value stays per-page: it is the one property whose type differs (<see langword="bool"/> for the
/// checkable pair, <see langword="string"/> for the text pair).
/// </remarks>
internal sealed partial class CheckableValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial bool Value { get; set; }

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void ToggleValue()
        => SetLastChange(nameof(Value), Value = !Value);

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

/// <summary>
/// The text pair's counterpart to <see cref="CheckableValueGroupContext"/>, carrying the two properties
/// that only make sense once the value is text: <see cref="MaxLength"/> and <see cref="TrimInput"/>.
/// </summary>
internal sealed partial class TextValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "nova-api";

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    [RecursiveMember]
    public partial int? MaxLength { get; set; }

    [RecursiveMember]
    public partial bool TrimInput { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, "nova-api", "nova-web", ""));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);

    // Down to 8 first, so the effect is immediate on the value already in the field rather than only on
    // the next thing typed.
    public void CycleMaxLength()
        => SetLastChange(nameof(MaxLength), MaxLength = CycleValue(MaxLength, 8, 24, null));

    public void ToggleTrimInput()
        => SetLastChange(nameof(TrimInput), TrimInput = !TrimInput);
}

/// <summary>
/// The value half of any option-picking input — Select, Search and RadioGroup all bind exactly this.
/// </summary>
internal sealed partial class OptionsValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, "first", "second", "third", null));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

internal sealed partial class InputContentGroupContext : DemoGroupContext
{
    private const string SampleTooltip = "Shown by the browser on hover.";

    [RecursiveMember]
    public partial string? Icon { get; set; } = LucideIcons.BadgeCheck;

    [RecursiveMember]
    public partial UIThemeColor IconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Primary);

    [RecursiveMember]
    public partial UIIconSize IconSize { get; set; } = UIIconSize.Medium;

    [RecursiveMember]
    public partial string? Title { get; set; } = "Require review before deploy";

    [RecursiveMember]
    public partial UITextAppearance TitleType { get; set; } = UITextAppearance.Caption;

    [RecursiveMember]
    public partial UIThemeColor TitleColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    [RecursiveMember]
    public partial string? Tooltip { get; set; }

    public void ToggleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleValue(Icon, null, LucideIcons.BadgeCheck));

    // Icon color/size only have a visible effect when an icon is actually rendered — force one on before
    // cycling either, so neither control is an invisible no-op (same reasoning as the Text page).
    public void CycleIconColor()
    {
        CheckIcon();
        SetLastChange(nameof(IconColor), IconColor = CycleValue(IconColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Accent), UIThemeColor.FromStyle(UIColorStyle.Success), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Default)));
    }

    public void CycleIconSize()
    {
        CheckIcon();
        SetLastChange(nameof(IconSize), IconSize = CycleEnum(IconSize));
    }

    private void CheckIcon()
    {
        if (string.IsNullOrEmpty(Icon))
            Icon = LucideIcons.BadgeCheck;
    }

    public void ToggleTitle()
        => SetLastChange(nameof(Title), Title = CycleValue(Title, null, "Require review before deploy"));

    public void CycleTitleType()
    {
        CheckTitle();
        SetLastChange(nameof(TitleType), TitleType = CycleValue(TitleType,
            UITextAppearance.Caption, UITextAppearance.Body, UITextAppearance.Subtitle, UITextAppearance.Overline));
    }

    public void CycleTitleColor()
    {
        CheckTitle();
        SetLastChange(nameof(TitleColor), TitleColor = CycleValue(TitleColor, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.Muted, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger)));
    }

    private void CheckTitle()
    {
        if (string.IsNullOrEmpty(Title))
            Title = "Require review before deploy";
    }

    public void ToggleTooltip()
        => SetLastChange(nameof(Tooltip), Tooltip = CycleValue(Tooltip, null, SampleTooltip));
}

internal sealed partial class InputBadgeGroupContext : DemoGroupContext
{
    private const string SampleBadgeText = "30 days";

    [RecursiveMember]
    public partial UITextBadgePlacement BadgePlacement { get; set; } = UITextBadgePlacement.Trailing;

    [RecursiveMember]
    public partial UIBadgeType BadgeStyle { get; set; } = UIBadgeType.Info;

    [RecursiveMember]
    public partial string? BadgeIcon { get; set; }

    [RecursiveMember]
    public partial UIThemeColor BadgeIconColor { get; set; } = UIThemeColor.FromStyle(UIColorStyle.Default);

    [RecursiveMember]
    public partial UIIconSize BadgeIconSize { get; set; } = UIIconSize.Small;

    [RecursiveMember]
    public partial string? BadgeText { get; set; } = SampleBadgeText;

    [RecursiveMember]
    public partial UITextAppearance BadgeTextType { get; set; } = UITextAppearance.Caption;

    [RecursiveMember]
    public partial string? BadgeTooltip { get; set; }

    public void CycleBadgePlacement()
        => SetLastChange(nameof(BadgePlacement), BadgePlacement = CycleEnum(BadgePlacement));

    public void CycleBadgeStyle()
        => SetLastChange(nameof(BadgeStyle), BadgeStyle = CycleValue(BadgeStyle, UIBadgeType.Info, UIBadgeType.Warning, UIBadgeType.Success, UIBadgeType.Danger, UIBadgeType.Primary, UIBadgeType.Accent, UIBadgeType.Surface));

    public void ToggleBadgeIcon()
        => SetLastChange(nameof(BadgeIcon), BadgeIcon = CycleValue(BadgeIcon, null, LucideIcons.History));

    // The badge icon's own color/size, like the label icon's, need the icon itself to be on first.
    public void CycleBadgeIconColor()
    {
        CheckBadgeIcon();
        SetLastChange(nameof(BadgeIconColor), BadgeIconColor = CycleValue(BadgeIconColor, UIThemeColor.FromStyle(UIColorStyle.Default), UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger)));
    }

    public void CycleBadgeIconSize()
    {
        CheckBadgeIcon();
        SetLastChange(nameof(BadgeIconSize), BadgeIconSize = CycleEnum(BadgeIconSize));
    }

    private void CheckBadgeIcon()
    {
        if (string.IsNullOrEmpty(BadgeIcon))
            BadgeIcon = LucideIcons.History;
    }

    public void ToggleBadgeText()
        => SetLastChange(nameof(BadgeText), BadgeText = CycleValue(BadgeText, null, SampleBadgeText));

    public void CycleBadgeTextType()
    {
        CheckBadgeText();
        SetLastChange(nameof(BadgeTextType), BadgeTextType = CycleValue(BadgeTextType,
            UITextAppearance.Caption, UITextAppearance.Overline, UITextAppearance.Body));
    }

    private void CheckBadgeText()
    {
        if (string.IsNullOrEmpty(BadgeText))
            BadgeText = SampleBadgeText;
    }

    public void ToggleBadgeTooltip()
        => SetLastChange(nameof(BadgeTooltip), BadgeTooltip = CycleValue(BadgeTooltip, null, "Artifacts are kept for 30 days."));
}

internal sealed partial class InputBorderGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIThemeColor? BorderColor { get; set; }

    [RecursiveMember]
    public partial UIThickness? BorderThickness { get; set; }

    [RecursiveMember]
    public partial UICornerRadius? BorderRadius { get; set; }

    // Border color alone draws nothing until there is a thickness to draw it with, so the first step
    // brings both on together rather than looking like a dead control.
    public void CycleBorderColor()
    {
        CheckBorderThickness();
        SetLastChange(nameof(BorderColor), BorderColor = CycleValue(BorderColor, UIThemeColor.FromStyle(UIColorStyle.Primary), UIThemeColor.FromStyle(UIColorStyle.Danger), UIThemeColor.FromStyle(UIColorStyle.Success)));
    }

    public void CycleBorderThickness()
        => SetLastChange(nameof(BorderThickness), BorderThickness = CycleValue(BorderThickness, UIThickness.Uniform(1), UIThickness.Uniform(2), UIThickness.Uniform(4), null));

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

/// <summary>
/// A bound option collection plus the value selected out of it — shared by the Select, Search and
/// RadioGroup binding pages, which all need exactly this to exercise client-rendered options.
/// </summary>
internal sealed partial class OptionsCollectionGroupContext : DemoGroupContext
{
    private int _added;

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<OptionItem> Options { get; } =
    [
        new OptionItem { Id = "api", Title = "nova-api", Description = "Public REST surface", Icon = LucideIcons.Send },
        new OptionItem { Id = "web", Title = "nova-web", Description = "Dashboard front end", Icon = LucideIcons.ExternalLink },
    ];

    public void AddOption()
    {
        var id = string.Create(CultureInfo.InvariantCulture, $"svc-{++_added}");

        Options.Add(new OptionItem
        {
            Id = id,
            Title = string.Create(CultureInfo.InvariantCulture, $"nova-svc-{_added}"),
            Description = "Added after attach",
            Icon = LucideIcons.Wrench
        });

        SetLastChange(nameof(Options), id);
    }

    public void RemoveOption()
    {
        if (Options.Count == 0)
        {
            SetLastChange(nameof(Options), "empty");
            return;
        }

        OptionItem removed = Options[^1];
        _ = Options.Remove(removed);

        SetLastChange(nameof(Options), string.Create(CultureInfo.InvariantCulture, $"removed {removed.Id}"));
    }

    /// <summary>
    /// Renames the option that is currently selected, when there is one — the trigger holds a *clone* of
    /// it, so this is what proves the clone is kept fresh rather than captured once.
    /// </summary>
    public void RenameSelected()
    {
        OptionItem? selected = null;

        foreach (OptionItem option in Options)
        {
            if (string.Equals(option.Id, Value, System.StringComparison.Ordinal))
                selected = option;
        }

        if (selected is null)
        {
            SetLastChange(nameof(Options), "nothing selected");
            return;
        }

        selected.Title = selected.Title?.EndsWith('*') == true
            ? selected.Title.TrimEnd('*')
            : $"{selected.Title}*";

        SetLastChange(nameof(Options), selected.Title ?? "");
    }

    public void SelectFirst()
    {
        if (Options.Count == 0)
        {
            SetLastChange(nameof(Value), "no options");
            return;
        }

        SetLastChange(nameof(Value), Value = Options[0].Id);
    }
}
