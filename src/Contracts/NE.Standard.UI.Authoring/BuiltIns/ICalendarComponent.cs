using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// An input that draws a month's calendar — in place or in its popup — with its weeks' first day and its marked days.
/// </summary>
public interface ICalendarComponent : IMarkedDaysComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="FirstDayOfWeek"/>.
    /// </summary>
    static UIProperty FirstDayOfWeekProperty { get; } = new(nameof(FirstDayOfWeek));

    /// <summary>
    /// Gets the first day of the week the calendar's rows start on; unset, Monday.
    /// </summary>
    /// <remarks>Render-time only: the weekday header is ordered once at render.</remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false)]
    UIDayOfWeek? FirstDayOfWeek { get; }
}
