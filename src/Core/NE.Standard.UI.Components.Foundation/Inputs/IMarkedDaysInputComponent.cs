using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// A day input with marked days as its shared setters reach it: the days and the mode they set, and the day and a period's end those
/// must hold.
/// </summary>
public interface IMarkedDaysInputComponent : IMarkedDaysComponent
{
    /// <summary>
    /// Gets or sets the days the calendar draws marked.
    /// </summary>
    new IReadOnlyCollection<DateOnly>? MarkedDays { get; set; }

    /// <summary>
    /// Gets or sets whether only a marked day can be chosen.
    /// </summary>
    new bool? MarkedDaysOnly { get; set; }

    /// <summary>
    /// Gets the day chosen, a period's start.
    /// </summary>
    new DateOnly? Value { get; }

    /// <summary>
    /// Gets a period's end.
    /// </summary>
    DateOnly? EndValue { get; }
}
