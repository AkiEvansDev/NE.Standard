using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
public abstract partial class TextAreaComponent<T> : FieldInputComponentBase<T, string?>, IPlaceholderInputComponent, IDebounceInputComponent, ITextLengthComponent
    where T : TextAreaComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the area stretched, unlike the one-line fields it shares a base with: a box for longer text takes the height its
    /// track gives it.
    /// </summary>
    protected TextAreaComponent(string? id = null) : base(id)
    {
        VerticalAlignment = UIAlignment.Stretch;
    }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the number of visible text rows.
    /// </summary>
    [UIComponentProperty(DefaultValue = 3, GenerateSetter = false)]
    public int? Rows { get; set; }

    /// <summary>
    /// Gets or sets how the text area can be resized by the user.
    /// </summary>
    [UIComponentProperty(DefaultValue = UITextAreaResizeMode.Vertical)]
    public UITextAreaResizeMode? Resize { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of characters allowed.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxLength { get; set; }

    /// <summary>
    /// Gets or sets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? TrimInput { get; set; }

    /// <summary>
    /// Gets or sets how long after the viewer stops typing the value is committed, in milliseconds; unset, it
    /// commits on blur.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? DebounceMilliseconds { get; set; }

    /// <summary>
    /// Sets the number of visible text rows.
    /// </summary>
    public T SetRows(int rows)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(rows);

        Rows = rows;
        return Self;
    }

    /// <summary>
    /// Enables trimming leading and trailing whitespace from the input.
    /// </summary>
    public T SetTrimInput()
        => SetTrimInput(true);
}

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
public sealed class TextAreaComponent(string? id = null) : TextAreaComponent<TextAreaComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.text-area";
}
