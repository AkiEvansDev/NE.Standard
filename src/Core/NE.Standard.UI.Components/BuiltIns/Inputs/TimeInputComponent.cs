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
    /// Validates that one end of the value or the period sits between the minimum and the maximum.
    /// </summary>
    protected override void ValidateEnd(TimeOnly? min, TimeOnly? max, TimeOnly? value)
        => OrderedRange.Validate(min, max, value, "time");

    /// <inheritdoc/>
    protected override void ValidatePeriod(TimeOnly? start, TimeOnly? end)
        => OrderedRange.ValidatePeriod(start, end, "time");
}

/// <summary>
/// A time input that lets the user pick a time of day.
/// </summary>
public sealed class TimeInputComponent(string? id = null) : TimeInputComponent<TimeInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.time";
}
