using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for temporal input components with step and first-day-of-week metadata, and the period mode every one
/// of them can take: <see cref="IsRange"/> puts a second field beside the first and <see cref="EndValue"/> behind it.
/// </summary>
public abstract partial class TemporalInputComponentBase<TComponent, TValue>(string? id = null) : MinMaxInputComponentBase<TComponent, TValue>(id)
    where TComponent : TemporalInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the step increment used when adjusting the value.
    /// </summary>
    /// <remarks>Unbindable: the picker builds its time columns from this once.</remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateBinder = false, GenerateSetter = false)]
    public UITemporalStep? Step { get; set; }

    /// <summary>
    /// Gets or sets the first day of the week used when rendering a calendar/picker.
    /// </summary>
    /// <remarks>Unbindable: the weekday header is ordered once at render.</remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateBinder = false)]
    public UIDayOfWeek? FirstDayOfWeek { get; set; }

    /// <summary>
    /// Gets or sets whether the control edits a period: <c>Value</c> is its start, <see cref="EndValue"/> its end, in two
    /// fields under one caption, chosen on one calendar.
    /// </summary>
    /// <remarks>Unbindable: how many fields the row holds is how the control is built.</remarks>
    [UIComponentProperty(DefaultValue = false, IsBindable = false, GenerateBinder = false)]
    public bool? IsRange { get; set; }

    /// <summary>
    /// Gets or sets the end of the period; read only in range mode, two-way like <c>Value</c>.
    /// </summary>
    [UIComponentProperty(BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultValue = null, GenerateSetter = false)]
    public TValue? EndValue { get; set; }

    /// <summary>
    /// Makes the control edit a period.
    /// </summary>
    public TComponent SetIsRange()
        => SetIsRange(true);

    /// <summary>
    /// Sets the end of the period, which may not fall before <c>Value</c> or outside <c>Min</c>/<c>Max</c>.
    /// </summary>
    public TComponent SetEndValue(TValue? endValue)
    {
        ValidateRange(Min, Max, endValue);
        ValidatePeriod(Value, endValue);

        EndValue = endValue;
        return Self;
    }

    /// <summary>
    /// Validates that a period's end does not fall before its start.
    /// </summary>
    protected abstract void ValidatePeriod(TValue? start, TValue? end);

    /// <summary>
    /// The period check every ordered value shares, differing only in the noun its message carries.
    /// </summary>
    protected static void ValidateOrderedPeriod<T>(T? start, T? end, string noun)
        where T : struct, IComparable<T>
    {
        if (start.HasValue && end.HasValue && end.Value.CompareTo(start.Value) < 0)
            throw new ArgumentOutOfRangeException(nameof(end), end, $"The end {noun} cannot be earlier than the start {noun}.");
    }

    /// <summary>
    /// Sets the step increment to a whole number of days.
    /// </summary>
    public TComponent SetStepDays(int value)
        => SetStep(UITemporalStep.Days(value));

    /// <summary>
    /// Sets the step increment to a whole number of hours.
    /// </summary>
    public TComponent SetStepHours(int value)
        => SetStep(UITemporalStep.Hours(value));

    /// <summary>
    /// Sets the step increment to a whole number of minutes.
    /// </summary>
    public TComponent SetStepMinutes(int value)
        => SetStep(UITemporalStep.Minutes(value));

    /// <summary>
    /// Sets the step increment to a whole number of seconds.
    /// </summary>
    public TComponent SetStepSeconds(int value)
        => SetStep(UITemporalStep.Seconds(value));

    /// <summary>
    /// Sets the step increment used when adjusting the value.
    /// </summary>
    public TComponent SetStep(UITemporalStep step)
    {
        step.Validate();

        Step = step;
        return Self;
    }
}
