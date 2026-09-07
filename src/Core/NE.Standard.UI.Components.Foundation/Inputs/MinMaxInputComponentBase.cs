using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for text input components with minimum, maximum, and formatting metadata.
/// </summary>
public abstract partial class MinMaxInputComponentBase<TComponent, TValue>(string? id = null) : AffixedInputComponentBase<TComponent, TValue>(id), IFormattedInputComponent
    where TComponent : MinMaxInputComponentBase<TComponent, TValue>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the minimum allowed value.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public TValue? Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum allowed value.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public TValue? Max { get; set; }

    /// <summary>
    /// Gets or sets the format string used to parse/format the value.
    /// </summary>
    /// <remarks>Unbindable: the runtime reads it once off the compiled state while normalizing what the user typed.</remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? Format { get; set; }

    /// <summary>
    /// Gets or sets the format string used to display the value.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), DefaultValue = null)]
    public string? DisplayFormat { get; set; }

    /// <summary>
    /// Gets or sets the culture used to parse/format the value.
    /// </summary>
    /// <remarks>Unbindable: it resolves a culture pack server-side that no client-side converter could reproduce.</remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? Culture { get; set; }

    /// <summary>
    /// Gets or sets the message shown when what the user typed does not match <see cref="Format"/>.
    /// </summary>
    /// <remarks>Not translatable and unbindable: the runtime reads it once off the compiled state while rejecting a value.</remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? FormatMessage { get; set; }

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
    /// The range check every ordered value shares, differing only in the noun its message carries.
    /// </summary>
    protected static void ValidateOrderedRange<T>(T? min, T? max, T? value, string noun)
        where T : struct, IComparable<T>
        => OrderedRange.Validate(min, max, value, noun);
}
