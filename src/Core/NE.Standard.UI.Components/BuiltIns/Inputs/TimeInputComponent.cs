using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A time input that lets the user pick a time of day.
/// </summary>
public abstract class TimeInputComponent<T>(string? id = null) : TemporalInputComponentBase<T, TimeOnly?>(id)
    where T : TimeInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Validates that the minimum, maximum, and current time values are consistent with each other.
    /// </summary>
    protected override void ValidateRange(TimeOnly? min, TimeOnly? max, TimeOnly? value)
    {
        if (min.HasValue && max.HasValue && min.Value > max.Value)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum time cannot be greater than the maximum time.");

        if (value.HasValue)
        {
            if (min.HasValue && value.Value < min.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Time value cannot be less than the minimum time.");

            if (max.HasValue && value.Value > max.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Time value cannot be greater than the maximum time.");
        }
    }
}

/// <summary>
/// A time input that lets the user pick a time of day.
/// </summary>
public sealed class TimeInputComponent(string? id = null) : TimeInputComponent<TimeInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.time";
}
