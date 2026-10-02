using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for text input components with minimum, maximum, and formatting metadata.
/// </summary>
public abstract partial class MinMaxInputComponentBase<TComponent, TValue>(string? id = null) : AffixedInputComponentBase<TComponent, TValue>(id), IFormattedInputComponent, IBoundedInputComponent
    where TComponent : MinMaxInputComponentBase<TComponent, TValue>, IUIComponentDefinition
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
    /// Gets or sets the format string the server parses typed text against.
    /// </summary>
    /// <remarks>
    /// Render-time only: the runtime reads it once off the compiled state while normalizing what the user typed. A temporal field reads
    /// text in the format it shows on the page and sends the value; this is a further shape it accepts, read on the server.
    /// </remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, DefaultValue = null)]
    public string? Format { get; set; }

    /// <summary>
    /// Gets or sets the format string used to display the value; a temporal field reads what is typed in it by this format too, and
    /// without one shows the application's (<c>yyyy-MM-dd</c> and <c>HH:mm</c> unless it follows the culture), or its own
    /// <see cref="Culture"/>'s where it names one.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), DefaultValue = null)]
    public string? DisplayFormat { get; set; }

    /// <summary>
    /// Gets or sets the culture used to parse/format the value; a temporal field that names one shows its date and time patterns.
    /// </summary>
    /// <remarks>Render-time only: it resolves a culture pack server-side that no client-side converter could reproduce.</remarks>
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, DefaultValue = null)]
    public string? Culture { get; set; }

    /// <summary>Gets or sets the message shown when what the user typed does not match <see cref="Format"/>.</summary>
    /// <remarks>
    /// Unbindable: the runtime reads it once off the compiled state while rejecting a value. The page translates it as it does a
    /// label; <c>AsContent</c> keeps it as written.
    /// </remarks>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IFormattedInputComponent), IsBindable = false, DefaultValue = null)]
    public UIPhrase? FormatMessage { get; set; }

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
}
