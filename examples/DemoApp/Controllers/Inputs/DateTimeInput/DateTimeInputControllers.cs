using System;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.DateInput;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.DateTimeInput;

internal sealed partial class DateTimeValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateTimeOffset? Value { get; set; } = Moment(2026, 4, 24, 22, 30);

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, Moment(2026, 4, 24, 22, 30), Moment(2026, 5, 1, 9, 0), Moment(2026, 5, 1, 23, 45), null));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);

    /// <summary>See <c>DateTimeInputExampleView.Moment</c> — only the wall-clock reading survives the round trip.</summary>
    internal static DateTimeOffset Moment(int year, int month, int day, int hour, int minute)
        => new(year, month, day, hour, minute, 0, TimeSpan.Zero);
}

/// <summary>See <see cref="DatePickerGroupContext"/> for why Step and Culture are not cycled here.</summary>
internal sealed partial class DateTimePickerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateTimeOffset? Min { get; set; }

    [RecursiveMember]
    public partial DateTimeOffset? Max { get; set; }

    [RecursiveMember]
    public partial string? DisplayFormat { get; set; }

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, DateTimeValueGroupContext.Moment(2026, 4, 24, 20, 0), DateTimeValueGroupContext.Moment(2026, 4, 1, 0, 0), null));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, DateTimeValueGroupContext.Moment(2026, 4, 25, 6, 0), DateTimeValueGroupContext.Moment(2026, 6, 30, 23, 59), null));

    public void CycleDisplayFormat()
        => SetLastChange(nameof(DisplayFormat), DisplayFormat = CycleValue(DisplayFormat, null, "dd.MM.yyyy HH:mm", "ddd d MMM yyyy, h:mm tt", "yyyy-MM-ddTHH:mm"));
}

internal sealed partial class DateTimeInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial DateTimeValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial DateTimePickerGroupContext PickerGroup { get; set; } = new();

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
