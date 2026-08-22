using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A date input that lets the user pick a calendar date.
/// </summary>
public abstract class DateInputComponent<T>(string? id = null) : TemporalInputComponentBase<T, DateOnly?>(id)
    where T : DateInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Validates that the minimum, maximum, and current date values are consistent with each other.
    /// </summary>
    protected override void ValidateRange(DateOnly? min, DateOnly? max, DateOnly? value)
    {
        if (min.HasValue && max.HasValue && min.Value > max.Value)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum date cannot be greater than the maximum date.");

        if (value.HasValue)
        {
            if (min.HasValue && value.Value < min.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Date value cannot be less than the minimum date.");

            if (max.HasValue && value.Value > max.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Date value cannot be greater than the maximum date.");
        }
    }
}

/// <summary>
/// A date input that lets the user pick a calendar date.
/// </summary>
public sealed class DateInputComponent(string? id = null) : DateInputComponent<DateInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.date";
}
