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
    /// Validates that one end of the value or the period sits between the minimum and the maximum.
    /// </summary>
    protected override void ValidateEnd(DateOnly? min, DateOnly? max, DateOnly? value)
        => ValidateOrderedRange(min, max, value, "date");

    /// <inheritdoc/>
    protected override void ValidatePeriod(DateOnly? start, DateOnly? end)
        => ValidateOrderedPeriod(start, end, "date");
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
