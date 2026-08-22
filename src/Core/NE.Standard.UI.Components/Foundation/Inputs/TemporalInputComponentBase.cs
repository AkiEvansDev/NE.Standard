using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for temporal input components with step and first-day-of-week metadata.
/// </summary>
public abstract partial class TemporalInputComponentBase<TComponent, TValue>(string? id = null) : MinMaxInputComponentBase<TComponent, TValue>(id)
    where TComponent : TemporalInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the step increment used when adjusting the value.
    /// </summary>
    /// <remarks>
    /// Unbindable: the picker builds its time columns from this once, and it is an author-time granularity
    /// decision rather than something a running app flips. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateBinder = false, GenerateSetter = false)]
    public UITemporalStep? Step { get; set; }

    /// <summary>
    /// Gets or sets the first day of the week used when rendering a calendar/picker.
    /// </summary>
    /// <remarks>
    /// Unbindable, for the same reason as <see cref="Step"/>: the weekday header is ordered once at render.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateBinder = false)]
    public UIDayOfWeek? FirstDayOfWeek { get; set; }

    /// <summary>
    /// Sets the step increment to a whole number of days.
    /// </summary>
    public TComponent SetStepDays(int value)
        => SetStep(UITemporalStep.Days(value));

    /// <summary>
    /// Sets the step increment to a whole number of hours.
    /// </summary>
    public TComponent SetStepHours(int value)
        => SetStep(UITemporalStep.Hours(value));

    /// <summary>
    /// Sets the step increment to a whole number of minutes.
    /// </summary>
    public TComponent SetStepMinutes(int value)
        => SetStep(UITemporalStep.Minutes(value));

    /// <summary>
    /// Sets the step increment to a whole number of seconds.
    /// </summary>
    public TComponent SetStepSeconds(int value)
        => SetStep(UITemporalStep.Seconds(value));

    /// <summary>
    /// Sets the step increment used when adjusting the value.
    /// </summary>
    public TComponent SetStep(UITemporalStep step)
    {
        step.Validate();

        Step = step;
        return Self;
    }
}
