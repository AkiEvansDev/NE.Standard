using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A date-time input that lets the user pick a calendar date combined with a time of day.
/// </summary>
public abstract class DateTimeInputComponent<T>(string? id = null) : TemporalInputComponentBase<T, DateTimeOffset?>(id)
    where T : DateTimeInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Validates that the minimum, maximum, and current date-time values are consistent with each other.
    /// </summary>
    protected override void ValidateRange(DateTimeOffset? min, DateTimeOffset? max, DateTimeOffset? value)
    {
        if (min.HasValue && max.HasValue && min.Value > max.Value)
            throw new ArgumentOutOfRangeException(nameof(min), min, "Minimum date-time cannot be greater than the maximum date-time.");

        if (value.HasValue)
        {
            if (min.HasValue && value.Value < min.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Date-time value cannot be less than the minimum date-time.");

            if (max.HasValue && value.Value > max.Value)
                throw new ArgumentOutOfRangeException(nameof(value), value, "Date-time value cannot be greater than the maximum date-time.");
        }
    }
}

/// <summary>
/// A date-time input that lets the user pick a calendar date combined with a time of day.
/// </summary>
public sealed class DateTimeInputComponent(string? id = null) : DateTimeInputComponent<DateTimeInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.date-time";
}
