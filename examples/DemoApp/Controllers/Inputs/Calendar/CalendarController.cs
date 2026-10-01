using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Calendar;

/// <summary>
/// The day, a period's end, the window both fall in, and the days the calendar marks — with only those on offer or not.
/// </summary>
/// <remarks>
/// One section rather than a value and a marked-days one: turning "only marked days" on moves the day and the period's end onto
/// marked days, which needs both in the same place.
/// </remarks>
internal sealed partial class CalendarDaysGroupContext : InputValueGroupContext
{
    private static readonly DateOnly Sample = new(2026, 7, 14);

    private static readonly DateOnly[] ReleaseDays = [new(2026, 7, 3), new(2026, 7, 7), new(2026, 7, 10), new(2026, 7, 14), new(2026, 7, 18), new(2026, 7, 21), new(2026, 7, 24), new(2026, 7, 28)];

    private static readonly DateOnly[] Mondays = [new(2026, 7, 6), new(2026, 7, 13), new(2026, 7, 20), new(2026, 7, 27)];

    private int _markedStep;

    [RecursiveMember]
    public partial DateOnly? Value { get; set; } = Sample;

    [RecursiveMember]
    public partial DateOnly? EndValue { get; set; } = Sample.AddDays(4);

    [RecursiveMember]
    public partial DateOnly? Min { get; set; }

    [RecursiveMember]
    public partial DateOnly? Max { get; set; }

    [RecursiveMember]
    public partial IReadOnlyCollection<DateOnly>? MarkedDays { get; set; }

    [RecursiveMember]
    public partial bool MarkedDaysOnly { get; set; }

    public CalendarDaysGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(MarkedDays), CycleMarkedDays, () => MarkedDays is null ? null : string.Join(", ", MarkedDays.Select(static day => day.Day)));
        AddOption(nameof(MarkedDaysOnly), ToggleMarkedDaysOnly, () => MarkedDaysOnly);
        AddReadOnlyOption();
    }

    public void CycleValue()
    {
        SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateOnly(2026, 7, 21), null));
        Fit();
    }

    // Read only by the period pane; the single pane carries the binding and ignores it.
    public void CycleEndValue()
    {
        SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddDays(4), Sample.AddDays(14), null));
        Fit();
    }

    public void CycleMin()
    {
        SetLastChange(nameof(Min), Min = CycleValue(Min, null, new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 10)));
        Fit();
    }

    public void CycleMax()
    {
        SetLastChange(nameof(Max), Max = CycleValue(Max, null, new DateOnly(2026, 7, 31), new DateOnly(2026, 7, 20)));
        Fit();
    }

    // A new set each step: a bound set travels whole whenever the controller assigns one.
    public void CycleMarkedDays()
    {
        _markedStep = (_markedStep + 1) % 3;
        MarkedDays = _markedStep switch
        {
            1 => ReleaseDays,
            2 => Mondays,
            _ => null
        };
        SetLastChange(nameof(MarkedDays), MarkedDays is null ? "(none)" : $"{MarkedDays.Count} days");
        Fit();
    }

    public void ToggleMarkedDaysOnly()
    {
        SetLastChange(nameof(MarkedDaysOnly), MarkedDaysOnly = !MarkedDaysOnly);
        Fit();
    }

    /// <summary>
    /// Holds the day and the period's end to what the rows allow: inside the bounds and, with only marked days on offer, on marked
    /// days — as the calendar itself would refuse anything else.
    /// </summary>
    private void Fit()
    {
        if (Min is DateOnly min && Max is DateOnly max && min > max)
            (Min, Max) = (max, min);

        Value = FitDay(Value);
        EndValue = FitDay(EndValue);

        if (Value is DateOnly start && EndValue is DateOnly end && end < start)
            EndValue = null;
    }

    private DateOnly? FitDay(DateOnly? day)
    {
        if (day is not DateOnly value)
            return null;

        if (Min is DateOnly lower && value < lower)
            value = lower;
        else if (Max is DateOnly upper && value > upper)
            value = upper;

        if (!MarkedDaysOnly || MarkedDays is null || MarkedDays.Contains(value))
            return value;

        // The nearest marked day inside the bounds, or none when the bounds leave no marked day.
        return MarkedDays
            .Where(marked => (Min is not DateOnly lo || marked >= lo) && (Max is not DateOnly hi || marked <= hi))
            .OrderBy(marked => Math.Abs(marked.DayNumber - value.DayNumber))
            .Cast<DateOnly?>()
            .FirstOrDefault();
    }
}

/// <summary>
/// A calendar whose press on a day is the command: the day lands on <see cref="Day"/>, and the change event runs.
/// </summary>
internal sealed partial class CalendarPickGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? Day { get; set; }

    public void Picked()
        => LogEvent(Day is DateOnly day ? $"the change ran for {day.ToString("dddd, d MMMM", CultureInfo.InvariantCulture)}" : "the change ran with no day");
}

/// <summary>
/// One command per options section, each dispatching to the row its key names, and the example whose press on a day is the command.
/// </summary>
internal sealed partial class CalendarController() : DemoStandardController
{
    [RecursiveMember]
    public partial CalendarDaysGroupContext DaysGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Release day");

    [RecursiveMember]
    public partial CalendarPickGroupContext PickGroup { get; set; } = new();

    [UICommand]
    public void CycleDaysOption(string id)
        => DaysGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void Picked()
        => PickGroup.Picked();
}
