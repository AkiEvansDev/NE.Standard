using System;
using System.Globalization;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A slider input that lets the user pick a numeric value by dragging a handle along a track; with <see cref="IsRange"/>, two handles
/// on one track pick a band, <c>Value</c> its start and <see cref="EndValue"/> its end.
/// </summary>
[UIComponentPropertyBlock(typeof(ISizedInputComponent))]
public abstract partial class SliderComponent<T>(string? id = null) : InputComponentBase<T, decimal?>(id), IOrderedRangeComponent, ISizedInputComponent, IPeriodInputComponent
    where T : SliderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the minimum selectable value.
    /// </summary>
    /// <remarks>Unset, it is <see cref="IOrderedRangeComponent.DefaultMin"/>, which the value is checked against.</remarks>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = (double)IOrderedRangeComponent.DefaultMin, GenerateSetter = false)]
    public decimal? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum selectable value.
    /// </summary>
    /// <remarks>Unset, it is <see cref="IOrderedRangeComponent.DefaultMax"/>, which the value is checked against.</remarks>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = (double)IOrderedRangeComponent.DefaultMax, GenerateSetter = false)]
    public decimal? Max { get; set; }

    /// <summary>
    /// Gets or sets the increment between selectable values.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public decimal? Step { get; set; }

    /// <summary>
    /// Gets or sets the layout orientation of the slider track.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIOrientation.Horizontal)]
    public UIOrientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets whether the current value is displayed alongside the slider.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowValue { get; set; }

    /// <summary>
    /// Gets or sets whether the minimum and maximum bounds are displayed alongside the slider.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowRange { get; set; }

    /// <summary>
    /// Gets or sets whether the slider picks a band with two handles, <c>Value</c> its start and <see cref="EndValue"/> its end.
    /// </summary>
    /// <remarks>Render-time only, as a period input's is: how many handles the track holds is how the control is built.</remarks>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), DefaultValue = false, IsBindable = false)]
    public bool? IsRange { get; set; }

    /// <summary>
    /// Gets or sets the end of the band; read only in range mode, two-way like <c>Value</c>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, DefaultValue = null, GenerateSetter = false)]
    public decimal? EndValue { get; set; }

    /// <summary>
    /// Gets or sets the least distance between the band's two ends; unset, they may meet.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IPeriodInputComponent), DefaultValue = null, GenerateSetter = false)]
    public decimal? MinDistance { get; set; }

    /// <summary>
    /// Makes the slider pick a band with two handles.
    /// </summary>
    public T SetIsRange()
        => SetIsRange(true);

    /// <summary>
    /// Sets the value — a band's start — which may not fall outside <see cref="Min"/>/<see cref="Max"/> or past <see cref="EndValue"/>;
    /// whichever is set last is checked against the others.
    /// </summary>
    public new T SetValue(decimal? value)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(Min, Max, value, "value");
        ValidateEnds(value, EndValue, MinDistance);

        Value = value;
        return Self;
    }

    /// <summary>
    /// Sets the end of the band, held as <see cref="SetValue"/> holds the start: inside the bounds, and not below the start.
    /// </summary>
    public T SetEndValue(decimal? endValue)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(Min, Max, endValue, "value");
        ValidateEnds(Value, endValue, MinDistance);

        EndValue = endValue;
        return Self;
    }

    /// <summary>The band's two ends in order and at least the least distance apart; an unset end checks nothing.</summary>
    private static void ValidateEnds(decimal? start, decimal? end, decimal? minDistance)
    {
        if (start is not decimal from || end is not decimal to || to - from >= (minDistance ?? 0))
            return;

        throw new ArgumentOutOfRangeException(nameof(end), end, minDistance > 0
            ? string.Create(CultureInfo.InvariantCulture, $"The end value must lie at least {minDistance} above the start value.")
            : "The end value cannot be less than the start value.");
    }

    /// <summary>
    /// Sets the least distance between the band's two ends, checked against the ends already set.
    /// </summary>
    public T SetMinDistance(decimal minDistance)
    {
        if (minDistance < 0)
            throw new ArgumentOutOfRangeException(nameof(minDistance), minDistance, "The least distance cannot be negative.");

        ValidateEnds(Value, EndValue, minDistance);

        MinDistance = minDistance;
        return Self;
    }

    /// <summary>
    /// Sets the minimum selectable value.
    /// </summary>
    public T SetMin(decimal min)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(min, Max, EndValue, "value");

        return Self.SetOrderedMin(min, "value");
    }

    /// <summary>
    /// Sets the maximum selectable value.
    /// </summary>
    public T SetMax(decimal max)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(Min, max, EndValue, "value");

        return Self.SetOrderedMax(max, "value");
    }

    /// <summary>
    /// Sets the minimum and maximum selectable values.
    /// </summary>
    public T SetRange(decimal min, decimal max)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(min, max, EndValue, "value");

        return Self.SetOrderedRange(min, max, "value");
    }

    /// <summary>
    /// Sets the increment between selectable values.
    /// </summary>
    public T SetStep(decimal step)
    {
        if (step <= 0)
            throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be greater than zero.");

        Step = step;
        return Self;
    }

    /// <summary>
    /// Enables displaying the current value alongside the slider.
    /// </summary>
    public T SetShowValue()
        => SetShowValue(true);

    /// <summary>
    /// Enables displaying the minimum and maximum bounds alongside the slider.
    /// </summary>
    public T SetShowRange()
        => SetShowRange(true);
}

/// <summary>
/// A slider input that lets the user pick a numeric value, or a band of two, by dragging handles along a track.
/// </summary>
public sealed class SliderComponent(string? id = null) : SliderComponent<SliderComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.slider";
}
