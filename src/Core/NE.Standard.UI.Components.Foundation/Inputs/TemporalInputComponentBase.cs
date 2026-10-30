using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for temporal fields: a period input's bounds and ends, a field's blocks, the formats it shows and reads, and the step
/// its picker moves by.
/// </summary>
/// <remarks>A calendar's own properties — the week's first day, marked days — are <c>ICalendarComponent</c>'s, on the inputs that draw one.</remarks>
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(IFieldInputComponent))]
[UIComponentPropertyBlock(typeof(IAffixedInputComponent))]
[UIComponentPropertyBlock(typeof(IFormattedInputComponent))]
public abstract partial class TemporalInputComponentBase<TComponent, TValue>(string? id = null) : PeriodInputComponentBase<TComponent, TValue>(id), IBorderedComponent, IFieldInputComponent, IAffixedInputComponent, IFormattedInputComponent
    where TComponent : TemporalInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the step increment used when adjusting the value.
    /// </summary>
    /// <remarks>Render-time only: the picker builds its time columns from this once.</remarks>
    [UIComponentProperty(DefaultValue = null, IsBindable = false, GenerateSetter = false)]
    public UITemporalStep? Step { get; set; }

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
