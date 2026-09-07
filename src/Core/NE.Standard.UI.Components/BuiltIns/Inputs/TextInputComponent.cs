using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
[UIComponentPropertyBlock(typeof(IAffixTextInputComponent))]
public abstract partial class TextInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id), IPlaceholderInputComponent, IAffixTextInputComponent, IRegionContainerComponent
    where T : TextInputComponent<T>, IUIComponentDefinition
{
    private readonly Dictionary<string, IVisualComponent> _regions = new(StringComparer.Ordinal);

    /// <summary>
    /// Gets the control at the end of the row — a copy, a generate, a look-up, or a split button with a menu of them.
    /// </summary>
    public IButtonComponent? TrailingAction => _regions.GetValueOrDefault(RegionNames.TrailingAction) as IButtonComponent;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _regions;

    /// <inheritdoc/>
    public bool HasRegions => _regions.Count > 0;

    /// <summary>
    /// Puts a button at the end of the row; the field lays it in and dresses it as an adornment.
    /// </summary>
    public T SetTrailingAction(IButtonComponent action)
    {
        ArgumentNullException.ThrowIfNull(action);

        _regions[RegionNames.TrailingAction] = action;
        return Self;
    }

    /// <inheritdoc/>
    [Translatable]
    [UIComponentProperty(Contract = typeof(IPlaceholderInputComponent), DefaultValue = null)]
    public string? Placeholder { get; set; }

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
    /// Gets or sets whether leading and trailing whitespace is trimmed from the input.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? TrimInput { get; set; }

    /// <summary>
    /// Gets or sets how long after the viewer stops typing the value is committed, in milliseconds; unset, it
    /// commits on blur or Enter.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    public int? DebounceMilliseconds { get; set; }

    /// <summary>
    /// Gets or sets whether a button to clear the current value is shown.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? ShowClearButton { get; set; }

    /// <summary>
    /// Commits the value as the viewer types, this long after they pause.
    /// </summary>
    public T SetDebounceMilliseconds(int debounceMilliseconds)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(debounceMilliseconds);

        DebounceMilliseconds = debounceMilliseconds;
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
