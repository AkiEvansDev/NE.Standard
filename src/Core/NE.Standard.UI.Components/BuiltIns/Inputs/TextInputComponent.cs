using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
public abstract partial class TextInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id)
    where T : TextInputComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the semantic input type (e.g. text, password, email).
    /// </summary>
    [UIComponentProperty(DefaultValue = UITextInputType.Text)]
    public UITextInputType? Type { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of characters allowed.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? MaxLength { get; set; }

    /// <summary>
    /// Gets or sets the text displayed before the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? PrefixText { get; set; }

    /// <summary>
    /// Gets or sets the text displayed after the value.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? SuffixText { get; set; }

    /// <summary>
    /// Gets or sets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? TrimInput { get; set; }

    /// <summary>
    /// Gets or sets whether a button to clear the current value is shown.
    /// </summary>
    /// <remarks>
    /// Unbindable: it decides whether the clear element is emitted at all, and no DOM operation adds or
    /// removes whole elements. See <c>docs/PROJECT.md</c> §7.
    /// </remarks>
    [UIComponentProperty(DefaultValue = false, IsBindable = false, GenerateBinder = false)]
    public bool? ShowClearButton { get; set; }

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

    /// <summary>
    /// Enables the button that clears the current value.
    /// </summary>
    public T SetShowClearButton()
        => SetShowClearButton(true);
}

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
public sealed class TextInputComponent(string? id = null) : TextInputComponent<TextInputComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.input.text";
}
