using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A date input that lets the user pick a calendar date.
/// </summary>
[UIComponentPropertyBlock(typeof(IMarkedDaysComponent))]
public abstract partial class DateInputComponent<T>(string? id = null) : TemporalInputComponentBase<T, DateOnly?>(id), IMarkedDaysInputComponent
    where T : DateInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Validates that one end of the value or the period sits between the minimum and the maximum, and on a marked day where only
    /// those are on offer.
    /// </summary>
    protected override void ValidateEnd(DateOnly? min, DateOnly? max, DateOnly? value)
    {
        OrderedRange.Validate(min, max, value, "date");
        MarkedDaysComponentExtensions.ValidateMarkedDay(MarkedDays, MarkedDaysOnly, value);
    }

    /// <inheritdoc/>
    protected override void ValidatePeriod(DateOnly? start, DateOnly? end)
        => OrderedRange.ValidatePeriod(start, end, "date");
}

/// <summary>
/// A date input that lets the user pick a calendar date.
/// </summary>
public sealed class DateInputComponent(string? id = null) : DateInputComponent<DateInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.date";
}
