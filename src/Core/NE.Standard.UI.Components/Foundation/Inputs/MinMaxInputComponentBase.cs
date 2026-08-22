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
    /// <remarks>
    /// Unbindable: the runtime reads it once off the compiled state while normalizing what the user typed, so
    /// a bound one would compile and silently do nothing. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
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
    /// <remarks>
    /// Unbindable: it resolves a culture <em>pack</em> server-side (month and day names, AM/PM designators)
    /// that no client-side converter could reproduce from a patched value. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, GenerateBinder = false, DefaultValue = null)]
    public string? Culture { get; set; }

    /// <summary>
    /// Gets or sets the message shown when what the user typed does not match <see cref="Format"/>.
    /// </summary>
    /// <remarks>
    /// Not <c>[Translatable]</c>, matching every other validation message in the library
    /// (<c>Required</c>/<c>Regex</c>/<c>Validate</c> all take a plain literal) — and the runtime reads this
    /// off the compiled state, where a translatable value is still the untranslated key.
    /// <para>
    /// Unbindable on purpose, rather than bindable-but-inert like <see cref="Culture"/>: the runtime reads
    /// it once while rejecting a value, so a bound one could only ever compile and silently do nothing.
    /// Declaring it that way turns the mistake into a compile error instead of another entry in
    /// <c>docs/PROJECT.md</c> §7's authoring gotchas.
    /// </para>
    /// </remarks>
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
}
