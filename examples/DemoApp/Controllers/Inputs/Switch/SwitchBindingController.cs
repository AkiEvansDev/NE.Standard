using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.Checkbox;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.Switch;

/// <summary>
/// Drives the same group contexts as <see cref="CheckboxBindingController"/> — see
/// <see cref="CheckableValueGroupContext"/> for why they are shared. Only the commands are restated,
/// since a controller's command surface is its own.
/// </summary>
internal sealed partial class SwitchBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial CheckableValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputContentGroupContext ContentGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial InputBorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void ToggleValue()
        => ValueGroup.ToggleValue();

    [UICommand]
    public void ToggleIsReadOnly()
        => ValueGroup.ToggleIsReadOnly();

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
