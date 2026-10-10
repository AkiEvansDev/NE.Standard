using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Inputs;

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
[UIComponentPropertyBlock(typeof(IAffixTextInputComponent))]
[UIComponentPropertyBlock(typeof(IPlaceholderInputComponent))]
[UIComponentPropertyBlock(typeof(ITextEntryInputComponent))]
public abstract partial class TextInputComponent<T>(string? id = null) : AffixedInputComponentBase<T, string?>(id), IPlaceholderInputComponent, ITextEntryInputComponent, IAffixTextInputComponent, IRegionContainerComponent, IDebounceInputComponent, ITextLengthComponent
    where T : TextInputComponent<T>, IUIComponentDefinition
{
    private readonly FieldActions _actions = new();

    /// <summary>
    /// Gets the first control at the end of the row — a copy, a generate, a look-up, or a split button with a menu of them.
    /// </summary>
    public IButtonComponent? TrailingAction => _actions.Trailing.Count > 0 ? _actions.Trailing[0] : null;

    /// <summary>
    /// Gets the controls at the start of the row, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> LeadingActions => _actions.Leading;

    /// <summary>
    /// Gets the controls at the end of the row, in the order they stand; a flyout among them by the button it opens from.
    /// </summary>
    public IReadOnlyList<IButtonComponent> TrailingActions => _actions.Trailing;

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IVisualComponent> Regions => _actions.Regions;

    /// <inheritdoc/>
    public bool HasRegions => _actions.Regions.Count > 0;

    /// <summary>
    /// Puts a button at the end of the row, in place of any there before; the field lays it in and dresses it as an adornment.
    /// </summary>
    public T SetTrailingAction(IButtonComponent action)
    {
        _actions.SetTrailing(action);
        return Self;
    }

    /// <summary>
    /// Puts a flyout at the end of the row, in place of any action there before: its anchor, a button, dressed as an adornment, and
    /// its content opening from it.
    /// </summary>
    public T SetTrailingAction(FlyoutComponent flyout)
    {
        _actions.SetTrailing(flyout);
        return Self;
    }

    /// <summary>
    /// Adds a button at the start of the row, after those added before; the field dresses it as an adornment.
    /// </summary>
    public T AddLeadingAction(IButtonComponent action)
    {
        _actions.AddLeading(action);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the start of the row, after the actions added before: its anchor, a button, dressed as an adornment, and its
    /// content opening from it — an emoji panel, a list of snippets.
    /// </summary>
    public T AddLeadingAction(FlyoutComponent flyout)
    {
        _actions.AddLeading(flyout);
        return Self;
    }

    /// <summary>
    /// Adds a button at the end of the row, after those added before; the field dresses it as an adornment.
    /// </summary>
    public T AddTrailingAction(IButtonComponent action)
    {
        _actions.AddTrailing(action);
        return Self;
    }

    /// <summary>
    /// Adds a flyout at the end of the row, after the actions added before: its anchor, a button, dressed as an adornment, and its
    /// content opening from it.
    /// </summary>
    public T AddTrailingAction(FlyoutComponent flyout)
    {
        _actions.AddTrailing(flyout);
        return Self;
    }

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
    /// Gets or sets what the browser may fill the field with, in its own vocabulary (<see cref="UIAutocomplete"/>) — e.g. naming
    /// the sign-in pair for a password manager, or an address form's parts.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? Autocomplete { get; set; }

    /// <summary>
    /// Gets or sets which on-screen keyboard the field asks a phone for, whatever its <see cref="Type"/>: digits for a one-time code
    /// beside <see cref="UIAutocomplete.OneTimeCode"/>; unset, the browser's choice for the type.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public UIInputMode? InputMode { get; set; }

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

    /// <summary>
    /// Runs <paramref name="command"/> on Enter, after the value has reached the server; the field keeps the focus for the next entry.
    /// </summary>
    public T OnEnter(string command)
        => On(EventNames.Enter, command);
    /// <summary>
    /// Runs <paramref name="command"/> on Enter with UI action arguments — in a row's template, the row's key among them.
    /// </summary>
    public T OnEnter(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Enter, command, arguments);
    /// <summary>
    /// Runs <paramref name="command"/> on Enter with literal argument values.
    /// </summary>
    public T OnEnterLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Enter, command, arguments);

    /// <summary>
    /// Runs <paramref name="command"/> on Escape as a cancel: the field goes back to its last committed value, sending nothing typed
    /// since, and leaves the focus as Escape does; without it, or with <see cref="CancelOnEscape"/> off, Escape commits and leaves.
    /// </summary>
    public T OnEscape(string command)
        => On(EventNames.Escape, command);
    /// <summary>
    /// Runs <paramref name="command"/> on Escape with UI action arguments — in a row's template, the row's key among them.
    /// </summary>
    public T OnEscape(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Escape, command, arguments);
    /// <summary>
    /// Runs <paramref name="command"/> on Escape with literal argument values.
    /// </summary>
    public T OnEscapeLiteral(string command, params KeyValuePair<string, object?>[] arguments)
        => OnLiteral(EventNames.Escape, command, arguments);
}

/// <summary>
/// A single-line text input for entering free-form text.
/// </summary>
public sealed class TextInputComponent(string? id = null) : TextInputComponent<TextInputComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.input.text";
}
