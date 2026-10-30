using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A month's calendar drawn in place — the grid a date input opens in its popup — whose press on a day chooses it; with
/// <c>IsRange</c>, two presses choose a period.
/// </summary>
/// <remarks>A press on a day raises the input's change event, so <c>OnChange</c> can be what the day does. Never wider than the
/// popup's grid, whatever room or width it is given; <c>HorizontalAlignment</c> places it in the rest. Its bounds and ends are held
/// as a date input's are, where only marked days are on offer to a marked day.</remarks>
[UIComponentPropertyBlock(typeof(ICalendarComponent))]
public abstract partial class CalendarComponent<T>(string? id = null) : PeriodInputComponentBase<T, DateOnly?>(id), IMarkedDaysInputComponent, ICalendarComponent
    where T : CalendarComponent<T>, IUIComponentDefinition
{
    /// <summary>One day against the bounds and, where only marked days are on offer, the marked days.</summary>
    protected override void ValidateEnd(DateOnly? min, DateOnly? max, DateOnly? value)
    {
        OrderedRange.Validate(min, max, value, "date");
        MarkedDaysComponentExtensions.ValidateMarkedDay(MarkedDays, MarkedDaysOnly, value);
    }

    /// <inheritdoc/>
    protected override void ValidatePeriod(DateOnly? start, DateOnly? end, TimeSpan? minDistance)
        => OrderedRange.ValidateDayPeriod(start, end, minDistance);
}

/// <summary>
/// A month's calendar drawn in place, whose press on a day chooses it.
/// </summary>
public sealed class CalendarComponent(string? id = null) : CalendarComponent<CalendarComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.calendar";
}
