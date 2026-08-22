using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.FileInput;

/// <summary>
/// FileInput's own picker properties, plus the value the field displays.
/// </summary>
/// <remarks>
/// <c>MaxFileSize</c> is deliberately not driven here: it is declared but never rendered, because the limit
/// that actually holds is <c>UIFileOptions.MaxFileSize</c> at the endpoint — a client can simply not honour
/// the component's. A control that cycles a value nothing reacts to is exactly what these pages exist to avoid.
/// <para>
/// <c>Value</c> is the field's display text and is pushed by the server; what the picker writes back is
/// <c>SelectionId</c>, on its own binding. See the upload group below and <c>docs/FILES.md</c>.
/// </para>
/// </remarks>
internal sealed partial class FileInputValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "release-notes.md";

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    [RecursiveMember]
    public partial string? Accept { get; set; }

    [RecursiveMember]
    public partial bool Multiple { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, "release-notes.md", "deploy-log.txt", ""));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);

    public void CycleAccept()
        => SetLastChange(nameof(Accept), Accept = CycleValue(Accept, ".md,.txt", "image/*", null));

    public void ToggleMultiple()
        => SetLastChange(nameof(Multiple), Multiple = !Multiple);
}

internal sealed partial class FileInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial FileInputValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputContentGroupContext ContentGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValue()
        => ValueGroup.CycleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

    [UICommand]
    public void CycleAccept()
        => ValueGroup.CycleAccept();

    [UICommand]
    public void ToggleMultiple()
        => ValueGroup.ToggleMultiple();

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
    public void ToggleTitle()
        => ContentGroup.ToggleTitle();

    [UICommand]
    public void CycleTitleType()
        => ContentGroup.CycleTitleType();

    [UICommand]
    public void CycleTitleColor()
        => ContentGroup.CycleTitleColor();

    [UICommand]
    public void ToggleTooltip()
        => ContentGroup.ToggleTooltip();

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
    public void CycleBadgeIconColor()
        => BadgeGroup.CycleBadgeIconColor();

    [UICommand]
    public void CycleBadgeIconSize()
        => BadgeGroup.CycleBadgeIconSize();

    [UICommand]
    public void ToggleBadgeText()
        => BadgeGroup.ToggleBadgeText();

    [UICommand]
    public void CycleBadgeTextType()
        => BadgeGroup.CycleBadgeTextType();

    [UICommand]
    public void ToggleBadgeTooltip()
        => BadgeGroup.ToggleBadgeTooltip();

    [UICommand]
    public void CycleBorderColor()
        => BorderGroup.CycleBorderColor();

    [UICommand]
    public void CycleBorderThickness()
        => BorderGroup.CycleBorderThickness();

    [UICommand]
    public void CycleBorderRadius()
        => BorderGroup.CycleBorderRadius();
}
