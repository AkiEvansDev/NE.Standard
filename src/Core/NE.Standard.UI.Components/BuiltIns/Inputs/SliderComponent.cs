using System;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
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
[UIComponentPropertyBlock(typeof(IOrientationComponent))]
[UIComponentPropertyDefault(nameof(IOrientationComponent.Orientation), nameof(DefaultOrientation))]
public abstract partial class SliderComponent<T>(string? id = null) : InputComponentBase<T, decimal?>(id), IOrderedRangeComponent, ISizedInputComponent, IPeriodInputComponent, IOrientationComponent, IConfigurationValidatedComponent
    where T : SliderComponent<T>, IUIComponentDefinition
{
    private static readonly UIResponsive<UIOrientation> DefaultOrientation = UIOrientation.Horizontal;

    // An unset step is the browser's 1 for a range input, which the page steps by and the gate holds.
    private const decimal DefaultStep = 1m;

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
    /// Gets or sets the increment between selectable values, counted from <see cref="Min"/>.
    /// </summary>
    /// <remarks>Unset, it is 1, as the browser draws a range input with no step and the value is checked against; a fractional slider sets its own.</remarks>
    [UIComponentProperty(DefaultValue = 1d, GenerateSetter = false)]
    public decimal? Step { get; set; }

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
    /// Sets the value — a band's start — which may not fall outside <see cref="Min"/>/<see cref="Max"/>, off a <see cref="Step"/> set or
    /// past <see cref="EndValue"/>; whichever is set last is checked against the others.
    /// </summary>
    public new T SetValue(decimal? value)
    {
        ValidateConfiguration(Min, Max, Step, value, EndValue, MinDistance);

        Value = value;
        return Self;
    }

    /// <summary>
    /// Checks the bounds, the step, the band's ends and their least distance as they stand, by the setters' own rule; an unset step is
    /// the page's 1 here, where every setter has run.
    /// </summary>
    public void ValidateConfiguration()
        => ValidateConfiguration(Min, Max, Binds(StepProperty) ? null : Step ?? DefaultStep, Value, EndValue, MinDistance);

    /// <summary>Whether a binding sets the property, its value unknown until the source delivers it.</summary>
    private bool Binds(UIProperty property)
    {
        foreach (UIBinding binding in Bindings)
        {
            if (binding.Target.Equals(property))
                return true;
        }

        return false;
    }

    /// <summary>
    /// The one rule every setter keeps: each end between the bounds (an unset one the bound the page draws) and on a step above zero
    /// counted from the minimum, the ends in order and the least distance apart, a distance the track is long enough for. A bound
    /// bound holds nothing, its value the source's; a null <paramref name="step"/> holds no end to a step.
    /// </summary>
    private void ValidateConfiguration(decimal? min, decimal? max, decimal? step, decimal? value, decimal? endValue, decimal? minDistance)
    {
        // The setters pass the step as it stands: one held to the default 1 before SetStep would refuse SetValue(0.5).SetStep(0.5).
        var minBound = Binds(MinProperty);
        var maxBound = Binds(MaxProperty);
        decimal? lower = minBound ? null : min ?? IOrderedRangeComponent.DefaultMin;
        decimal? upper = maxBound ? null : max ?? IOrderedRangeComponent.DefaultMax;

        OrderedRange.Validate(minBound ? null : min, maxBound ? null : max, null, "value");
        ValidateInBounds(lower, upper, value);
        ValidateInBounds(lower, upper, endValue);

        if (step <= 0)
            throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be greater than zero.");

        if (lower is decimal origin && step is decimal increment)
        {
            ValidateOnStep(origin, increment, value);
            ValidateOnStep(origin, increment, endValue);
        }

        if (minDistance < 0)
            throw new ArgumentOutOfRangeException(nameof(minDistance), minDistance, "The least distance cannot be negative.");

        if (minDistance > upper - lower)
            throw new ArgumentOutOfRangeException(nameof(minDistance), minDistance, "The least distance cannot exceed the distance between the minimum and the maximum.");

        ValidateEnds(value, endValue, minDistance);
    }

    /// <summary>An end inside each bound the configuration knows; a bound bound is null and holds nothing.</summary>
    private static void ValidateInBounds(decimal? lower, decimal? upper, decimal? value)
    {
        OrderedRange.Validate(lower, null, value, "value");
        OrderedRange.Validate(null, upper, value, "value");
    }

    /// <summary>An end on a step counted from the minimum, as the page steps and the server's gate holds it; unset, it checks nothing.</summary>
    private static void ValidateOnStep(decimal min, decimal step, decimal? value)
    {
        if (value is decimal written && (written - min) % step != 0)
            throw new ArgumentOutOfRangeException(nameof(value), value, string.Create(CultureInfo.InvariantCulture, $"The value must lie on a step of {step} from the minimum."));
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
    /// Sets the end of the band, held as <see cref="SetValue"/> holds the start: inside the bounds, on a step, and not below the start.
    /// </summary>
    public T SetEndValue(decimal? endValue)
    {
        ValidateConfiguration(Min, Max, Step, Value, endValue, MinDistance);

        EndValue = endValue;
        return Self;
    }

    /// <summary>
    /// Sets the least distance between the band's two ends, checked against the ends already set and the bounds.
    /// </summary>
    public T SetMinDistance(decimal minDistance)
    {
        ValidateConfiguration(Min, Max, Step, Value, EndValue, minDistance);

        MinDistance = minDistance;
        return Self;
    }

    /// <summary>
    /// Sets the minimum selectable value.
    /// </summary>
    public T SetMin(decimal min)
    {
        ValidateConfiguration(min, Max, Step, Value, EndValue, MinDistance);

        Min = min;
        return Self;
    }

    /// <summary>
    /// Sets the maximum selectable value.
    /// </summary>
    public T SetMax(decimal max)
    {
        ValidateConfiguration(Min, max, Step, Value, EndValue, MinDistance);

        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the minimum and maximum selectable values.
    /// </summary>
    public T SetRange(decimal min, decimal max)
    {
        ValidateConfiguration(min, max, Step, Value, EndValue, MinDistance);

        Min = min;
        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the increment between selectable values, which the ends already set must lie on.
    /// </summary>
    public T SetStep(decimal step)
    {
        ValidateConfiguration(Min, Max, step, Value, EndValue, MinDistance);

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
