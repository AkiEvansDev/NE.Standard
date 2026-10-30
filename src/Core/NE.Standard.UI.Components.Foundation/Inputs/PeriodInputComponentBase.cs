using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for bounded inputs that can choose a period of time via <see cref="IsRange"/> and <see cref="EndValue"/>: a temporal
/// input, a calendar; both ends held to the bounds, in order and <see cref="MinDistance"/> apart.
/// </summary>
/// <remarks>A slider's period is a number's, its distance a number too: it keeps its own, over <c>IPeriodInputComponent</c>'s keys.</remarks>
public abstract partial class PeriodInputComponentBase<TComponent, TValue>(string? id = null) : BoundedInputComponentBase<TComponent, TValue>(id), IPeriodInputComponent
    where TComponent : PeriodInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether the control edits a period, with <c>Value</c> as the start and <see cref="EndValue"/> as the end.
    /// </summary>
    /// <remarks>Render-time only: how many fields the row holds is how the control is built.</remarks>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), DefaultValue = false, IsBindable = false)]
    public bool? IsRange { get; set; }

    /// <summary>
    /// Gets or sets the end of the period; read only in range mode, two-way like <c>Value</c>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultValue = null, GenerateSetter = false)]
    public TValue? EndValue { get; set; }

    /// <summary>
    /// Gets or sets the least distance between the period's two ends; unset, they may meet.
    /// </summary>
    /// <remarks>A date's ends lie whole days apart, so its distance is a whole number of days.</remarks>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), DefaultValue = null, GenerateSetter = false)]
    public TimeSpan? MinDistance { get; set; }

    /// <summary>
    /// Makes the control edit a period.
    /// </summary>
    public TComponent SetIsRange()
        => SetIsRange(true);

    /// <summary>
    /// Sets the value, the start of a period, which may not fall after <see cref="EndValue"/>, nearer it than <see cref="MinDistance"/>
    /// or outside <c>Min</c>/<c>Max</c>; whichever is set last is checked against the others.
    /// </summary>
    public new TComponent SetValue(TValue? value)
    {
        ValidatePeriod(value, EndValue, MinDistance);

        return base.SetValue(value);
    }

    /// <summary>
    /// Sets the end of the period, which may not fall before <c>Value</c>, nearer it than <see cref="MinDistance"/> or outside
    /// <c>Min</c>/<c>Max</c>.
    /// </summary>
    public TComponent SetEndValue(TValue? endValue)
    {
        ValidateRange(Min, Max, endValue);
        ValidatePeriod(Value, endValue, MinDistance);

        EndValue = endValue;
        return Self;
    }

    /// <summary>
    /// Sets the least distance between the period's two ends, checked against the ends already set.
    /// </summary>
    public TComponent SetMinDistance(TimeSpan minDistance)
    {
        ValidatePeriod(Value, EndValue, minDistance);

        MinDistance = minDistance;
        return Self;
    }

    /// <summary>The range check over both ends of the period, so a bound moved after the end was set still holds it.</summary>
    protected override void ValidateRange(TValue? min, TValue? max, TValue? value)
    {
        ValidateEnd(min, max, value);

        if (EndValue is not null && !EqualityComparer<TValue?>.Default.Equals(value, EndValue))
            ValidateEnd(min, max, EndValue);
    }

    /// <summary>
    /// Validates one end of the period against the range.
    /// </summary>
    protected abstract void ValidateEnd(TValue? min, TValue? max, TValue? value);

    /// <summary>
    /// Validates that a period's end does not fall before its start or nearer it than the least distance, and that the distance is one
    /// the control can keep.
    /// </summary>
    protected abstract void ValidatePeriod(TValue? start, TValue? end, TimeSpan? minDistance);

    /// <summary>
    /// Checks both ends against the bounds and each other, and the least distance, as they stand, by the setters' own rules.
    /// </summary>
    public override void ValidateConfiguration()
    {
        base.ValidateConfiguration();
        ValidatePeriod(Value, EndValue, MinDistance);
    }
}
