using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A slider input that lets the user pick a numeric value by dragging a handle along a track.
/// </summary>
public abstract partial class SliderComponent<T>(string? id = null) : InputComponentBase<T, decimal?>(id), IOrderedRangeComponent, ISizedInputComponent
    where T : SliderComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ISizedInputComponent), DefaultValue = UIInputSize.Medium)]
    public UIInputSize? Size { get; set; }

    /// <summary>
    /// Gets or sets the minimum selectable value.
    /// </summary>
    /// <remarks>Unset, it is <see cref="IOrderedRangeComponent.DefaultMin"/>, which the value is checked against.</remarks>
    [UIComponentProperty(DefaultValue = (double)IOrderedRangeComponent.DefaultMin, GenerateSetter = false)]
    public decimal? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum selectable value.
    /// </summary>
    /// <remarks>Unset, it is <see cref="IOrderedRangeComponent.DefaultMax"/>, which the value is checked against.</remarks>
    [UIComponentProperty(DefaultValue = (double)IOrderedRangeComponent.DefaultMax, GenerateSetter = false)]
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
    /// Sets the value, which may not fall outside <see cref="Min"/>/<see cref="Max"/>; whichever of the three is set last is checked
    /// against the others.
    /// </summary>
    public new T SetValue(decimal? value)
    {
        OrderedRangeComponentExtensions.ValidateOrderedRange(Min, Max, value, "value");
        Value = value;
        return Self;
    }

    /// <summary>
    /// Sets the minimum selectable value.
    /// </summary>
    public T SetMin(decimal min)
        => Self.SetOrderedMin(min, "value");

    /// <summary>
    /// Sets the maximum selectable value.
    /// </summary>
    public T SetMax(decimal max)
        => Self.SetOrderedMax(max, "value");

    /// <summary>
    /// Sets the minimum and maximum selectable values.
    /// </summary>
    public T SetRange(decimal min, decimal max)
        => Self.SetOrderedRange(min, max, "value");

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
/// A slider input that lets the user pick a numeric value by dragging a handle along a track.
/// </summary>
public sealed class SliderComponent(string? id = null) : SliderComponent<SliderComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.slider";
}
