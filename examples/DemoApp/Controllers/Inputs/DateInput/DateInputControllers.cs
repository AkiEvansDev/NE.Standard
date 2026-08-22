using System;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.DateInput;

internal sealed partial class DateValueGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? Value { get; set; } = new DateOnly(2026, 4, 24);

    [RecursiveMember]
    public partial bool IsReadOnly { get; set; }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, new DateOnly(2026, 4, 24), new DateOnly(2026, 5, 1), new DateOnly(2026, 12, 31), null));

    public void ToggleIsReadOnly()
        => SetLastChange(nameof(IsReadOnly), IsReadOnly = !IsReadOnly);
}

/// <summary>
/// The three picker properties that <em>are</em> live-patched. <c>Step</c>, <c>FirstDayOfWeek</c> and
/// <c>Culture</c> are deliberately absent: the renderer resolves them once, statically (see
/// <c>TemporalInputRendererBase</c>), so binding them would produce controls that do nothing — the same
/// judgment the NumberInput page makes about its own Min/Max/Step.
/// </summary>
internal sealed partial class DatePickerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? Min { get; set; }

    [RecursiveMember]
    public partial DateOnly? Max { get; set; }

    [RecursiveMember]
    public partial string? DisplayFormat { get; set; }

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, new DateOnly(2026, 4, 20), new DateOnly(2026, 4, 1), null));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, new DateOnly(2026, 4, 30), new DateOnly(2026, 6, 30), null));

    public void CycleDisplayFormat()
        => SetLastChange(nameof(DisplayFormat), DisplayFormat = CycleValue(DisplayFormat, null, "dd.MM.yyyy", "dddd, d MMMM yyyy", "MMM d, yyyy"));
}

internal sealed partial class DateInputBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial DateValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial DatePickerGroupContext PickerGroup { get; set; } = new();

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

/// <summary>
/// The test page's log. Reports the raw controller value: the field shows localized <c>DisplayFormat</c>
/// text and the user may have typed it under a different <c>Format</c> again — what matters is that a
/// <see cref="DateOnly"/> lands here, and which day it is.
/// </summary>
internal sealed partial class DateCommitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? Value { get; set; }

    public void RecordChange()
        => LogEvent($"change -> {Value?.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture) ?? "null"}");
}

internal sealed partial class DateInputTestController() : DemoController
{
    [RecursiveMember]
    public partial DateCommitGroupContext CommitGroup { get; set; } = new();

    [RecursiveMember]
    public partial DateCommitGroupContext RangeGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => CommitGroup.RecordChange();

    [UICommand]
    public void RecordRangeChange()
        => RangeGroup.RecordChange();
}
