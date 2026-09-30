using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Temporal;

/// <summary>
/// The release trains of a month, marked on the calendar: a switch turns them into the only days on offer, a button moves them on to
/// the next month.
/// </summary>
internal sealed partial class DateMarkedGroupContext : DemoGroupContext
{
    private static readonly DateOnly FirstMonth = new(2026, 8, 1);

    private int _month;

    [RecursiveMember]
    public partial DateOnly? Value { get; set; } = TrainsOf(FirstMonth)[1];

    [RecursiveMember]
    public partial IReadOnlyCollection<DateOnly>? MarkedDays { get; set; } = TrainsOf(FirstMonth);

    [RecursiveMember]
    public partial bool MarkedDaysOnly { get; set; } = true;

    /// <summary>Tuesdays and Thursdays: the days a release train leaves.</summary>
    private static DateOnly[] TrainsOf(DateOnly month)
    {
        List<DateOnly> days = [];

        for (DateOnly day = month; day.Month == month.Month; day = day.AddDays(1))
        {
            if (day.DayOfWeek is DayOfWeek.Tuesday or DayOfWeek.Thursday)
                days.Add(day);
        }

        return [.. days];
    }

    /// <summary>A new set, assigned whole: the calendar redraws its marks, and the day moves onto the new month's first train.</summary>
    public void NextMonth()
    {
        _month = (_month + 1) % 3;

        DateOnly month = FirstMonth.AddMonths(_month);

        MarkedDays = TrainsOf(month);
        Value = MarkedDays.First();
        LogEvent($"the trains of {month.ToString("MMMM", CultureInfo.InvariantCulture)} are marked");
    }

    /// <summary>Turned on, only a train may be chosen, so a day between trains moves onto the next one.</summary>
    public void MarkedDaysOnlyChanged()
    {
        if (MarkedDaysOnly && Value is DateOnly day && MarkedDays is { } marked && !marked.Contains(day))
            Value = marked.Where(train => train >= day).DefaultIfEmpty(marked.Last()).First();

        LogEvent(MarkedDaysOnly ? "only the trains are on offer" : "every day is on offer, the trains marked");
    }
}

/// <summary>
/// A day with an upper bound, the controller's copy written under the group: whatever is typed, it never holds one past the bound.
/// </summary>
internal sealed partial class DateBoundsGroupContext : DemoGroupContext
{
    /// <summary>The last day a snapshot may be kept until.</summary>
    public static readonly DateOnly Latest = new(2026, 9, 30);

    [RecursiveMember]
    public partial DateOnly? KeepUntil { get; set; } = new(2026, 9, 15);

    public void Changed()
        => LogEvent($"the controller holds {KeepUntil?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? "no day"}");
}

/// <summary>
/// The date input examples that report: marked days the controller moves, and a bound the server holds.
/// </summary>
internal sealed partial class DateInputExamplesController() : DemoController
{
    [RecursiveMember]
    public partial DateMarkedGroupContext MarkedGroup { get; set; } = new();

    [RecursiveMember]
    public partial DateBoundsGroupContext BoundsGroup { get; set; } = new();

    [UICommand]
    public void NextMonth()
        => MarkedGroup.NextMonth();

    [UICommand]
    public void MarkedDaysOnlyChanged()
        => MarkedGroup.MarkedDaysOnlyChanged();

    [UICommand]
    public void KeepUntilChanged()
        => BoundsGroup.Changed();
}
