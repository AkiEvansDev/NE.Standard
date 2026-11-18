using System;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
[UIComponentPropertyBlock(typeof(IAffixedInputComponent))]
[UIComponentPropertyBlock(typeof(IAffixTextInputComponent))]
[UIComponentPropertyBlock(typeof(IClearableInputComponent))]
public abstract partial class TextInputComponent<T>(string? id = null) : TextEntryInputComponentBase<T>(id), IAffixedInputComponent, IAffixTextInputComponent, IClearableInputComponent
    where T : TextInputComponent<T>, IUIComponentDefinition
{
    // UIStrings.SearchField: the Shell's key, written out, as the components reference no Shell.
    private const string SearchKey = "ui.search.field";

    /// <summary>
    /// Gets the first control at the end of the row — a copy, a generate, a look-up, or a split button with a menu of them.
    /// </summary>
    public IButtonComponent? TrailingAction => Actions.Trailing.Count > 0 ? Actions.Trailing[0] : null;

    /// <summary>
    /// Puts a button at the end of the row, in place of any there before; the field lays it in and dresses it as an adornment.
    /// </summary>
    public T SetTrailingAction(IButtonComponent action)
    {
        Actions.SetTrailing(action);
        return Self;
    }

    /// <summary>
    /// Puts a flyout at the end of the row, in place of any action there before.
    /// </summary>
    public T SetTrailingAction(FlyoutComponent flyout)
    {
        Actions.SetTrailing(flyout);
        return Self;
    }

    /// <summary>
    /// Puts a button-variant multi-select at the end of the row, in place of any action there before.
    /// </summary>
    public T SetTrailingAction(IMultiSelectComponent select)
    {
        Actions.SetTrailing(select);
        return Self;
    }

    /// <summary>
    /// Gets or sets the semantic input type (e.g. text, password, email).
    /// </summary>
    [UIComponentProperty(DefaultValue = UITextInputType.Text)]
    public UITextInputType? Type { get; set; }

    /// <summary>
    /// Gets or sets what the browser may fill the field with, in its own vocabulary (<see cref="UIAutocomplete"/>).
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Autocomplete { get; set; }

    /// <summary>
    /// Gets or sets which on-screen keyboard the field asks a phone for, whatever its <see cref="Type"/>.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIInputMode? InputMode { get; set; }

    /// <summary>
    /// Makes the field a search box: the search type, the search glyph before the text, a clear button, and
    /// <paramref name="placeholder"/> or the framework's word "Search".
    /// </summary>
    public T SetSearch(UIPhrase? placeholder = null)
    {
        // Null is the framework's word; a blank one given would leave the box saying nothing.
        if (placeholder is not null && !UIPhrase.HasWords(placeholder))
            throw new ArgumentException("A placeholder given needs words; leave it out for the framework's.", nameof(placeholder));

        return SetType(UITextInputType.Search)
            .SetPrefixIcon(UIGlyphs.Search)
            .SetShowClearButton()
            .SetPlaceholder(placeholder ?? SearchKey);
    }
}

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
public sealed class TextInputComponent(string? id = null) : TextInputComponent<TextInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.text";
}
