using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A multi-line text input for entering longer free-form text.
/// </summary>
/// <remarks>
/// Derives from <see cref="TextInputComponentBase{TComponent, TValue}"/> rather than from
/// <c>TextInputComponent</c>: the single-line control's own surface — <c>Type</c>, <c>PrefixText</c>,
/// <c>SuffixText</c>, <c>ShowClearButton</c> — has no meaning for a multi-line field, and inheriting it
/// only advertised properties that rendered as nothing. <see cref="MaxLength"/> and <see cref="TrimInput"/>
/// are the two that do apply to both, and are therefore restated here rather than shared through a base:
/// putting them one level up would hand them to <c>CheckboxComponent</c> as well, which is
/// <see cref="TextInputComponentBase{TComponent, TValue}"/>'s other descendant.
/// </remarks>
public abstract partial class TextAreaComponent<T>(string? id = null) : FieldInputComponentBase<T, string?>(id)
    where T : TextAreaComponent<T>, IUIComponentDefinition
{
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
    /// Sets the number of visible text rows.
    /// </summary>
    public T SetRows(int rows)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(rows);

        Rows = rows;
        return Self;
    }

    /// <summary>
    /// Sets the maximum number of characters allowed.
    /// </summary>
    public T SetMaxLength(int maxLength)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxLength);

        MaxLength = maxLength;
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
