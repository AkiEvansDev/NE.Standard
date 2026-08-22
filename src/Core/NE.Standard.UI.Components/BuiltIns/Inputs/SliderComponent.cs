using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A slider input that lets the user pick a numeric value by dragging a handle along a track.
/// </summary>
public abstract partial class SliderComponent<T>(string? id = null) : InputComponentBase<T, decimal?>(id)
    where T : SliderComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the minimum selectable value.
    /// </summary>
    [UIComponentProperty(DefaultValue = 0d, GenerateSetter = false)]
    public decimal? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum selectable value.
    /// </summary>
    [UIComponentProperty(DefaultValue = 100d, GenerateSetter = false)]
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
    /// Sets the minimum selectable value.
    /// </summary>
    public T SetMin(decimal min)
    {
        ValidateConfiguration(min, Max, Step, Value);
        Min = min;
        return Self;
    }

    /// <summary>
    /// Sets the maximum selectable value.
    /// </summary>
    public T SetMax(decimal max)
    {
        ValidateConfiguration(Min, max, Step, Value);
        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the minimum and maximum selectable values.
    /// </summary>
    public T SetRange(decimal min, decimal max)
    {
        ValidateConfiguration(min, max, Step, Value);
        Min = min;
        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the increment between selectable values.
    /// </summary>
    public T SetStep(decimal step)
    {
        ValidateConfiguration(Min, Max, step, Value);
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

    private static void ValidateConfiguration(decimal? min, decimal? max, decimal? step, decimal? value)
    {
        if (min.HasValue && max.HasValue && min > max)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum value cannot be greater than the maximum value.");

        if (step.HasValue && step.Value <= 0)
            throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be greater than zero.");

        if (min.HasValue && max.HasValue && value.HasValue && (value.Value < min || value.Value > max))
            throw new ArgumentOutOfRangeException(nameof(value), value, "Value must be within the defined range.");
    }
}

/// <summary>
/// A slider input that lets the user pick a numeric value by dragging a handle along a track.
/// </summary>
public sealed class SliderComponent(string? id = null) : SliderComponent<SliderComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.slider";
}
