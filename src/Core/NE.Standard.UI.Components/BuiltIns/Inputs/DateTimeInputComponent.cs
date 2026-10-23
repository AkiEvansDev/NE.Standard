using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A date-time input that lets the user pick a calendar date combined with a time of day.
/// </summary>
/// <remarks>
/// Its marked days are days, as a date input's: a moment is marked by the day its own clock reads. Its clear (<c>ShowClearButton</c>)
/// stands in a single moment's row; a period draws none.
/// </remarks>
[UIComponentPropertyBlock(typeof(ICalendarComponent))]
[UIComponentPropertyBlock(typeof(IClearableInputComponent))]
public abstract partial class DateTimeInputComponent<T>(string? id = null) : TemporalInputComponentBase<T, DateTimeOffset?>(id), IMarkedDaysInputComponent, ICalendarComponent, IClearableInputComponent
    where T : DateTimeInputComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    DateOnly? IMarkedDaysInputComponent.Value => DayOf(Value);

    /// <inheritdoc/>
    DateOnly? IMarkedDaysInputComponent.EndValue => DayOf(EndValue);

    // The day the moment's own clock reads, as the page draws and compares it: the wire carries the clock without converting it.
    private static DateOnly? DayOf(DateTimeOffset? moment)
        => moment is DateTimeOffset value ? DateOnly.FromDateTime(value.DateTime) : null;

    /// <summary>
    /// Validates that one end of the value or the period sits between the minimum and the maximum, and on a marked day where only
    /// those are on offer.
    /// </summary>
    protected override void ValidateEnd(DateTimeOffset? min, DateTimeOffset? max, DateTimeOffset? value)
    {
        OrderedRange.Validate(min, max, value, "date-time");
        MarkedDaysComponentExtensions.ValidateMarkedDay(MarkedDays, MarkedDaysOnly, DayOf(value));
    }

    /// <inheritdoc/>
    protected override void ValidatePeriod(DateTimeOffset? start, DateTimeOffset? end)
        => OrderedRange.ValidatePeriod(start, end, "date-time");
}

/// <summary>
/// A date-time input that lets the user pick a calendar date combined with a time of day.
/// </summary>
public sealed class DateTimeInputComponent(string? id = null) : DateTimeInputComponent<DateTimeInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.date-time";
}
