using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.DateInput;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.TimeInput;

internal sealed partial class TimeValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial TimeOnly? Value { get; set; } = new TimeOnly(22, 0);

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, new TimeOnly(22, 0), new TimeOnly(9, 30), new TimeOnly(23, 45), null));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

/// <summary>See <see cref="DatePickerGroupContext"/> for why Step and Culture are not cycled here.</summary>
internal sealed partial class TimePickerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial TimeOnly? Min { get; set; }

    [RecursiveMember]
    public partial TimeOnly? Max { get; set; }

    [RecursiveMember]
    public partial string? DisplayFormat { get; set; }

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, new TimeOnly(9, 0), new TimeOnly(18, 0), null));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, new TimeOnly(18, 0), new TimeOnly(23, 59), null));

    public void CycleDisplayFormat()
        => SetLastChange(nameof(DisplayFormat), DisplayFormat = CycleValue(DisplayFormat, null, "HH:mm:ss", "h:mm tt", "H'h' mm"));
}

internal sealed partial class TimeInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial TimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial TimePickerGroupContext PickerGroup { get; set; } = new();

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
    public void CycleMin()
        => PickerGroup.CycleMin();

    [UICommand]
    public void CycleMax()
        => PickerGroup.CycleMax();

    [UICommand]
    public void CycleDisplayFormat()
        => PickerGroup.CycleDisplayFormat();

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
    public void CycleBadgeStyle()
        => BadgeGroup.CycleBadgeStyle();

    [UICommand]
    public void ToggleBadgeText()
        => BadgeGroup.ToggleBadgeText();

    [UICommand]
    public void ToggleBadgeIcon()
        => BadgeGroup.ToggleBadgeIcon();

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
