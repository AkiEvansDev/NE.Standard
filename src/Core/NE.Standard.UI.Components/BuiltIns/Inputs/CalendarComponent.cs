using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A month's calendar drawn in place — the grid a date input opens in its popup — whose press on a day chooses it; with
/// <see cref="IsRange"/>, two presses choose a period.
/// </summary>
/// <remarks>A press on a day raises the input's change event, so <c>OnChange</c> can be what the day does. Never wider than the
/// popup's grid, whatever room or width it is given; <c>HorizontalAlignment</c> places it in the rest.</remarks>
public abstract partial class CalendarComponent<T>(string? id = null) : InputComponentBase<T, DateOnly?>(id), IMarkedDaysInputComponent, IPeriodInputComponent
    where T : CalendarComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the first day that can be chosen.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = null, GenerateSetter = false)]
    public DateOnly? Min { get; set; }

    /// <summary>
    /// Gets or sets the last day that can be chosen.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = null, GenerateSetter = false)]
    public DateOnly? Max { get; set; }

    /// <summary>
    /// Gets or sets the first day of the week the grid's rows start on; unset, Monday.
    /// </summary>
    /// <remarks>Render-time only: the weekday header is ordered once at render.</remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false)]
    public UIDayOfWeek? FirstDayOfWeek { get; set; }

    /// <summary>
    /// Gets or sets whether the calendar chooses a period, with <c>Value</c> as the start and <see cref="EndValue"/> as the end.
    /// </summary>
    /// <remarks>Render-time only, as a date input's is.</remarks>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), DefaultValue = false, IsBindable = false)]
    public bool? IsRange { get; set; }

    /// <summary>
    /// Gets or sets the end of the period; read only in range mode, two-way like <c>Value</c>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultValue = null, GenerateSetter = false)]
    public DateOnly? EndValue { get; set; }

    /// <inheritdoc/>
    /// <remarks>A bound set is sent whole each time the controller assigns a new one.</remarks>
    [UIComponentProperty(Contract = typeof(IMarkedDaysComponent), DefaultValue = null, GenerateSetter = false)]
    public IReadOnlyCollection<DateOnly>? MarkedDays { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IMarkedDaysComponent), DefaultValue = false, GenerateSetter = false)]
    public bool? MarkedDaysOnly { get; set; }

    /// <summary>
    /// Makes the calendar choose a period.
    /// </summary>
    public T SetIsRange()
        => SetIsRange(true);

    /// <summary>
    /// Sets the value, the start of a period, which may not fall after <see cref="EndValue"/>, outside <see cref="Min"/>/<see cref="Max"/>
    /// or, where only marked days are on offer, on an unmarked day.
    /// </summary>
    public new T SetValue(DateOnly? value)
    {
        ValidateDay(Min, Max, value);
        OrderedRange.ValidatePeriod(value, EndValue, "date");

        Value = value;
        return Self;
    }

    /// <summary>One day against the bounds and, where only marked days are on offer, the marked days.</summary>
    private void ValidateDay(DateOnly? min, DateOnly? max, DateOnly? day)
    {
        OrderedRange.Validate(min, max, day, "date");
        MarkedDaysComponentExtensions.ValidateMarkedDay(MarkedDays, MarkedDaysOnly, day);
    }

    /// <summary>
    /// Sets the end of the period, held as <see cref="SetValue"/> holds the start.
    /// </summary>
    public T SetEndValue(DateOnly? endValue)
    {
        ValidateDay(Min, Max, endValue);
        OrderedRange.ValidatePeriod(Value, endValue, "date");

        EndValue = endValue;
        return Self;
    }

    /// <summary>
    /// Sets the first day that can be chosen.
    /// </summary>
    public T SetMin(DateOnly min)
    {
        ValidateBounds(min, Max);
        Min = min;
        return Self;
    }

    /// <summary>Both ends of the period against new bounds, so a bound moved after a day was set still holds it.</summary>
    private void ValidateBounds(DateOnly? min, DateOnly? max)
    {
        ValidateDay(min, max, Value);
        ValidateDay(min, max, EndValue);
    }

    /// <summary>
    /// Sets the last day that can be chosen.
    /// </summary>
    public T SetMax(DateOnly max)
    {
        ValidateBounds(Min, max);
        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the first and the last day that can be chosen.
    /// </summary>
    public T SetRange(DateOnly min, DateOnly max)
    {
        ValidateBounds(min, max);
        Min = min;
        Max = max;
        return Self;
    }
}

/// <summary>
/// A month's calendar drawn in place, whose press on a day chooses it.
/// </summary>
public sealed class CalendarComponent(string? id = null) : CalendarComponent<CalendarComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.calendar";
}
