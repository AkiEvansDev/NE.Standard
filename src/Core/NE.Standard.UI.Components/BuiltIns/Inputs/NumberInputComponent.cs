using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A numeric input with configurable step, sign, and decimal/formatting constraints.
/// </summary>
public abstract partial class NumberInputComponent<T>(string? id = null) : MinMaxInputComponentBase<T, decimal?>(id)
    where T : NumberInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the increment between selectable values.
    /// </summary>
    /// <remarks>
    /// Unbindable: it only feeds the custom step buttons, resolved once at render. <see cref="SliderComponent"/>
    /// declares its own <c>Step</c> and that one <em>is</em> bindable. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateBinder = false, GenerateSetter = false)]
    public decimal? Step { get; set; }

    /// <summary>
    /// Gets or sets whether decimal (fractional) values are allowed.
    /// </summary>
    [UIComponentProperty(DefaultValue = true, GenerateSetter = false)]
    public bool? AllowDecimals { get; set; }

    /// <summary>
    /// Gets or sets whether negative values are allowed.
    /// </summary>
    [UIComponentProperty(DefaultValue = true, GenerateSetter = false)]
    public bool? AllowNegative { get; set; }

    /// <summary>
    /// Gets or sets whether a thousands separator is shown while formatting the value.
    /// </summary>
    [UIComponentProperty(DefaultValue = true)]
    public bool? AllowThousandsSeparator { get; set; }

    /// <summary>
    /// Gets or sets whether trailing zeros are trimmed from the formatted value.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? TrimTrailingZeros { get; set; }

    /// <summary>
    /// Gets or sets the text displayed before the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? PrefixText { get; set; }

    /// <summary>
    /// Gets or sets the text displayed after the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? SuffixText { get; set; }

    /// <summary>
    /// Gets or sets whether increment/decrement stepper buttons are shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowStepper { get; set; }

    /// <summary>
    /// Sets the increment between selectable values.
    /// </summary>
    public T SetStep(decimal step)
    {
        ValidateConfiguration(Min, Max, step, Value, AllowDecimals, AllowNegative);

        Step = step;
        return Self;
    }

    /// <summary>
    /// Sets whether decimal (fractional) values are allowed.
    /// </summary>
    public T SetAllowDecimals(bool allowDecimals = true)
    {
        ValidateConfiguration(Min, Max, Step, Value, allowDecimals, AllowNegative);

        AllowDecimals = allowDecimals;
        return Self;
    }

    /// <summary>
    /// Sets whether negative values are allowed.
    /// </summary>
    public T SetAllowNegative(bool allowNegative = true)
    {
        ValidateConfiguration(Min, Max, Step, Value, AllowDecimals, allowNegative);

        AllowNegative = allowNegative;
        return Self;
    }

    /// <summary>
    /// Enables the thousands separator while formatting the value.
    /// </summary>
    public T SetAllowThousandsSeparator()
        => SetAllowThousandsSeparator(true);

    /// <summary>
    /// Enables trimming of trailing zeros from the formatted value.
    /// </summary>
    public T SetTrimTrailingZeros()
        => SetTrimTrailingZeros(true);

    /// <summary>
    /// Enables the increment/decrement stepper buttons.
    /// </summary>
    public T SetShowStepper()
        => SetShowStepper(true);

    /// <summary>
    /// Validates that the minimum, maximum, step, and current value are consistent with the configured numeric constraints.
    /// </summary>
    protected override void ValidateRange(decimal? min, decimal? max, decimal? value)
        => ValidateConfiguration(min, max, Step, value, AllowDecimals, AllowNegative);

    private static void ValidateConfiguration(decimal? min, decimal? max, decimal? step, decimal? value, bool? allowDecimals, bool? allowNegative)
    {
        if (min.HasValue && max.HasValue && min.Value > max.Value)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum value cannot be greater than the maximum value.");

        if (step.HasValue)
        {
            if (step.Value <= 0)
                throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be greater than zero.");

            if (allowDecimals.HasValue && allowDecimals == false && decimal.Truncate(step.Value) != step.Value)
                throw new ArgumentOutOfRangeException(nameof(step), step, "Step must be a whole number when decimals are not allowed.");
        }

        if (allowNegative.HasValue && allowNegative == false)
        {
            if (min.HasValue && min.Value < 0)
                throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum value cannot be negative when negative values are not allowed.");

            if (max.HasValue && max.Value < 0)
                throw new ArgumentOutOfRangeException(nameof(max), max, "Maximum value cannot be negative when negative values are not allowed.");

            if (value.HasValue && value.Value < 0)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Value cannot be negative when negative values are not allowed.");
        }

        if (value.HasValue)
        {
            if (min.HasValue && value.Value < min.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Value cannot be less than the minimum value.");

            if (max.HasValue && value.Value > max.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Value cannot be greater than the maximum value.");

            if (allowDecimals.HasValue && allowDecimals == false && decimal.Truncate(value.Value) != value.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Value must be a whole number when decimals are not allowed.");
        }
    }
}

/// <summary>
/// A numeric input with configurable step, sign, and decimal/formatting constraints.
/// </summary>
public sealed class NumberInputComponent(string? id = null) : NumberInputComponent<NumberInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.number";
}
