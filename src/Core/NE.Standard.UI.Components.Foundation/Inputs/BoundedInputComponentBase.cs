using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for inputs whose value is held between a minimum and a maximum of its own type: a number's, a date's, a time's, a
/// calendar's.
/// </summary>
/// <remarks>
/// A field's look is its blocks (<c>IBorderedComponent</c>, <c>IFieldInputComponent</c>, <c>IAffixedInputComponent</c>), taken by
/// the inputs that draw one, so a calendar drawn in place holds its bounds as a field does. A slider's unset bounds are 0 and 100,
/// not none: it keeps its own, over <see cref="IOrderedRangeComponent"/>.
/// </remarks>
public abstract partial class BoundedInputComponentBase<TComponent, TValue>(string? id = null) : InputComponentBase<TComponent, TValue>(id), IBoundedInputComponent, IConfigurationValidatedComponent
    where TComponent : BoundedInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the minimum allowed value.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = null, GenerateSetter = false)]
    public TValue? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed value.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IBoundedInputComponent), DefaultValue = null, GenerateSetter = false)]
    public TValue? Max { get; set; }

    /// <summary>
    /// Sets the value, which may not fall outside <see cref="Min"/>/<see cref="Max"/>; whichever of the three is set last is checked
    /// against the others.
    /// </summary>
    public new TComponent SetValue(TValue? value)
    {
        ValidateRange(Min, Max, value);
        Value = value;
        return Self;
    }

    /// <summary>
    /// Sets the minimum allowed value.
    /// </summary>
    public TComponent SetMin(TValue min)
    {
        ValidateRange(min, Max, Value);
        Min = min;
        return Self;
    }

    /// <summary>
    /// Sets the maximum allowed value.
    /// </summary>
    public TComponent SetMax(TValue max)
    {
        ValidateRange(Min, max, Value);
        Max = max;
        return Self;
    }

    /// <summary>
    /// Sets the allowed value range.
    /// </summary>
    public TComponent SetRange(TValue min, TValue max)
    {
        ValidateRange(min, max, Value);
        Min = min;
        Max = max;
        return Self;
    }

    /// <summary>
    /// Validates the configured value range.
    /// </summary>
    protected abstract void ValidateRange(TValue? min, TValue? max, TValue? value);

    /// <summary>
    /// Checks the bounds and the value as they stand by the setters' own rule (<see cref="ValidateRange"/>).
    /// </summary>
    public virtual void ValidateConfiguration()
        => ValidateRange(Min, Max, Value);
}
