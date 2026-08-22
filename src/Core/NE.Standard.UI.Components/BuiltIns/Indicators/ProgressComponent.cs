using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Indicators;

/// <summary>
/// A linear or circular progress indicator showing a value within a min/max range.
/// </summary>
public abstract partial class ProgressComponent<T> : VisualComponentBase<T>
    where T : ProgressComponent<T>, IUIComponentDefinition
{
    private static readonly UIThemeColor DefaultColor = UIThemeColor.FromStyle(UIColorStyle.Default);

    /// <summary>
    /// Gets or sets the current progress value.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public decimal? Value { get; set; }

    /// <summary>
    /// Gets or sets the minimum value of the progress range.
    /// </summary>
    [UIComponentProperty(DefaultValue = 0d, GenerateSetter = false)]
    public decimal? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum value of the progress range.
    /// </summary>
    [UIComponentProperty(DefaultValue = 100d, GenerateSetter = false)]
    public decimal? Max { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the progress indicator.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIProgressVariant.Linear)]
    public UIProgressVariant? Variant { get; set; }

    /// <summary>
    /// Gets or sets the progress indicator's color.
    /// </summary>
    [UIComponentProperty(DefaultValueMember = nameof(DefaultColor))]
    public UIThemeColor? Color { get; set; }

    /// <summary>
    /// Gets or sets whether the numeric value is displayed alongside the indicator.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowValue { get; set; }

    /// <summary>
    /// Initializes the progress indicator with a centered vertical alignment.
    /// </summary>
    protected ProgressComponent(string? id = null) : base(id)
    {
        VerticalAlignment = UIAlignment.Center;
    }

    /// <summary>
    /// Sets the current progress value, validating it falls within the current range.
    /// </summary>
    public T SetValue(decimal value)
    {
        ValidateRange(Min, Max, value);

        Value = value;
        return Self;
    }

    /// <summary>
    /// Sets the minimum value of the progress range, validating it against the current value and maximum.
    /// </summary>
    public T SetMin(decimal min)
    {
        ValidateRange(min, Max, Value);

        Min = min;
        return Self;
    }

    /// <summary>
    /// Sets the maximum value of the progress range, validating it against the current value and minimum.
    /// </summary>
    public T SetMax(decimal max)
    {
        ValidateRange(Min, max, Value);

        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the minimum and maximum values of the progress range, validating them against the current value.
    /// </summary>
    public T SetRange(decimal min, decimal max)
    {
        ValidateRange(min, max, Value);

        Min = min;
        Max = max;
        return Self;
    }

    /// <summary>
    /// Validates that <paramref name="min"/> does not exceed <paramref name="max"/> and that <paramref name="value"/> falls within that range.
    /// </summary>
    private static void ValidateRange(decimal? min, decimal? max, decimal? value)
    {
        if (min.HasValue && max.HasValue && min > max)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum value cannot be greater than maximum value.");

        if (min.HasValue && max.HasValue && value.HasValue && (value.Value < min || value.Value > max))
            throw new ArgumentOutOfRangeException(nameof(value), value, "Progress value must be within the defined range.");
    }
}

/// <summary>
/// A linear or circular progress indicator showing a value within a min/max range.
/// </summary>
public sealed class ProgressComponent(string? id = null) : ProgressComponent<ProgressComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.progress";
}
