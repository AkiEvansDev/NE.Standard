using System;
using System.Collections.Generic;
using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.Calendar;

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
/// A conversation's days: from its first message to today, the days that have messages marked and the only ones on offer.
/// </summary>
/// <remarks>Counted from today, so the dialog always opens on a month that has messages in it.</remarks>
internal sealed partial class CalendarDayGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial DateOnly? JumpDay { get; set; }

    [RecursiveMember]
    public partial DateOnly? FirstDay { get; set; }

    [RecursiveMember]
    public partial DateOnly? LastDay { get; set; }

    [RecursiveMember]
    public partial IReadOnlyCollection<DateOnly>? MessageDays { get; set; }

    public CalendarDayGroupContext()
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.Today);

        FirstDay = today.AddDays(-45);
        LastDay = today;
        MessageDays = CreateMessageDays(today.AddDays(-45), today);
    }

    /// <summary>Most days, not all: a quiet day now and then, so a press on one is visibly not offered.</summary>
    private static DateOnly[] CreateMessageDays(DateOnly first, DateOnly last)
    {
        List<DateOnly> days = [];

        for (DateOnly day = first; day <= last; day = day.AddDays(1))
        {
            if (day.DayNumber % 3 != 1 || day == last)
                days.Add(day);
        }

        return [.. days];
    }

    public void Went()
        => LogEvent(JumpDay is DateOnly day ? $"the feed went to {day.ToString("dddd, d MMMM", CultureInfo.InvariantCulture)}" : "no day chosen");
}

/// <summary>
/// The calendar examples that report: a change that runs a command, and the dialog that is a calendar.
/// </summary>
internal sealed partial class CalendarExamplesController() : DemoController
{
    /// <summary>The "go to a day" dialog's key.</summary>
    public const string DayKey = "demo-calendar-day";

    [RecursiveMember]
    public partial CalendarPickGroupContext PickGroup { get; set; } = new();

    [RecursiveMember]
    public partial CalendarDayGroupContext DayGroup { get; set; } = new();

    [UICommand]
    public void Picked()
        => PickGroup.Picked();

    [UICommand]
    public static UICommandResult OpenDayPicker()
        => UICommandResult.Ok([new OpenDialogEffect(DayKey)]);

    /// <summary>A press on a day is the whole of it: the feed goes there, and the dialog closes.</summary>
    [UICommand]
    public UICommandResult GoToDay()
    {
        DayGroup.Went();

        return UICommandResult.Ok([new CloseDialogEffect(DayKey)]);
    }
}
