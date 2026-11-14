using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Calendar;

/// <summary>
/// The chosen day, a period's end, the days the calendar marks, and whether the grid is read-only.
/// </summary>
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
    public partial IReadOnlyCollection<DateOnly>? MarkedDays { get; set; }

    public CalendarDaysGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(EndValue), CycleEndValue, () => EndValue);
        AddOption(nameof(MarkedDays), CycleMarkedDays, () => MarkedDays is null ? null : string.Join(", ", MarkedDays.Select(static day => day.Day)));
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, Sample, new DateOnly(2026, 7, 21), null));

    // Read only by the period pane; the single pane carries the binding and ignores it.
    public void CycleEndValue()
        => SetLastChange(nameof(EndValue), EndValue = CycleValue(EndValue, Sample.AddDays(4), Sample.AddDays(14), null));

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
    }

    /// <summary>
    /// Holds the day and the period's end to what <paramref name="bounds"/> allow: inside the bounds, on marked days where only those are
    /// on offer, and the least distance apart — as the calendar itself would refuse anything else.
    /// </summary>
    public void Fit(CalendarBoundsGroupContext bounds)
    {
        bounds.NormalizeOrder();

        if (bounds.MarkedDaysOnly && MarkedDays is null)
            MarkedDays = ReleaseDays;

        Value = FitDay(Value, bounds);
        EndValue = FitDay(EndValue, bounds);

        if (Value is DateOnly start && EndValue is DateOnly end && end.DayNumber - start.DayNumber < (bounds.MinDistance?.Days ?? 0))
            EndValue = null;
    }

    private DateOnly? FitDay(DateOnly? day, CalendarBoundsGroupContext bounds)
    {
        if (day is not DateOnly value)
            return null;

        if (bounds.Min is DateOnly lower && value < lower)
            value = lower;
        else if (bounds.Max is DateOnly upper && value > upper)
            value = upper;

        if (!bounds.MarkedDaysOnly || MarkedDays is null || MarkedDays.Contains(value))
            return value;

        // The nearest marked day inside the bounds, or none when the bounds leave no marked day.
        return MarkedDays
            .Where(marked => (bounds.Min is not DateOnly lo || marked >= lo) && (bounds.Max is not DateOnly hi || marked <= hi))
            .OrderBy(marked => Math.Abs(marked.DayNumber - value.DayNumber))
            .Cast<DateOnly?>()
            .FirstOrDefault();
    }
}

/// <summary>
/// The window a calendar offers: earliest and latest dates, minimum period span, and whether only marked days may be picked.
/// </summary>
internal sealed partial class CalendarBoundsGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? Min { get; set; }

    [RecursiveMember]
    public partial DateOnly? Max { get; set; }

    [RecursiveMember]
    public partial TimeSpan? MinDistance { get; set; }

    [RecursiveMember]
    public partial bool MarkedDaysOnly { get; set; }

    public CalendarBoundsGroupContext()
    {
        AddOption(nameof(Min), CycleMin, () => Min);
        AddOption(nameof(Max), CycleMax, () => Max);
        AddOption(nameof(MinDistance), CycleMinDistance, () => MinDistance);
        AddOption(nameof(MarkedDaysOnly), ToggleMarkedDaysOnly, () => MarkedDaysOnly);
    }

    public void CycleMin()
        => SetLastChange(nameof(Min), Min = CycleValue(Min, null, new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 10)));

    public void CycleMax()
        => SetLastChange(nameof(Max), Max = CycleValue(Max, null, new DateOnly(2026, 7, 31), new DateOnly(2026, 7, 20)));

    // Whole days: a calendar refuses a part of one.
    public void CycleMinDistance()
        => SetLastChange(nameof(MinDistance), MinDistance = CycleValue(MinDistance, null, TimeSpan.FromDays(2), TimeSpan.FromDays(6)));

    public void ToggleMarkedDaysOnly()
        => SetLastChange(nameof(MarkedDaysOnly), MarkedDaysOnly = !MarkedDaysOnly);

    public void NormalizeOrder()
    {
        if (Min is DateOnly min && Max is DateOnly max && min > max)
            (Min, Max) = (max, min);
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
    public partial CalendarBoundsGroupContext BoundsGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Release day");

    [RecursiveMember]
    public partial CalendarPickGroupContext PickGroup { get; set; } = new();

    protected override Task OnOptionCycledAsync(string group, string id, CancellationToken cancellationToken)
    {
        if (group is nameof(DaysGroup) or nameof(BoundsGroup))
            DaysGroup.Fit(BoundsGroup);

        return Task.CompletedTask;
    }

    [UICommand]
    public void Picked()
        => PickGroup.Picked();
}
