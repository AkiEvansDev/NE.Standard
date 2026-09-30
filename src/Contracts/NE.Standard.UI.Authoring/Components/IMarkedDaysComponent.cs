using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// An input whose value is a day, or a period of days, that marks some days on its calendar and can offer only those.
/// </summary>
public interface IMarkedDaysComponent : IInputComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="MarkedDays"/>.
    /// </summary>
    static UIProperty MarkedDaysProperty { get; } = new(nameof(MarkedDays));

    /// <summary>
    /// Gets the registered property key for <see cref="MarkedDaysOnly"/>.
    /// </summary>
    static UIProperty MarkedDaysOnlyProperty { get; } = new(nameof(MarkedDaysOnly));

    /// <summary>
    /// Gets the days the calendar draws marked; order and repeats do not matter.
    /// </summary>
    IReadOnlyCollection<DateOnly>? MarkedDays { get; }

    /// <summary>
    /// Gets whether only a marked day can be chosen: every other day is drawn disabled, as a day outside <c>Min</c>/<c>Max</c> is.
    /// </summary>
    /// <remarks>
    /// True by a static value or a controller binding, the server refuses a day the input sends that is not marked and answers it with
    /// the value it holds; a cleared value is no day and passes.
    /// </remarks>
    bool? MarkedDaysOnly { get; }
}
