using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Fluent shorthands over <see cref="IInputComponent"/>, shared by <see cref="InputComponentBase{TComponent, TValue}"/> and
/// <see cref="InputTemplatedComponentBase{TComponent, TItem, TValue, TTemplate}"/> despite their different base hierarchies.
/// </summary>
public static class InputComponentExtensions
{
    /// <summary>
    /// Sends this field's validation message to another component's property, leaving the field its edge colour alone.
    /// </summary>
    public static T ValidationInto<T>(this T component, string componentId, UIProperty property) where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        component.ValidationTarget = new UIPropertyReference(componentId, property);
        return component;
    }

    /// <summary>
    /// Fills the caption's badge with a help badge: the help glyph alone, a Plain badge, <paramref name="help"/> — the words, a key or
    /// a phrase, translated as a badge's tooltip is — as its tooltip. The badge is no tab stop: its words describe the field's control instead,
    /// and show under the pointer and, in a caption outside the field, on a press or a touch.
    /// </summary>
    public static TComponent SetHelp<TComponent, TValue>(this InputComponentBase<TComponent, TValue> component, UIPhrase help)
        where TComponent : InputComponentBase<TComponent, TValue>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(component);
        ThrowIfNoWords(help);

        return component.SetBadgeIcon(UIGlyphs.Help).SetBadgeStyle(UIBadgeType.Plain).SetBadgeTooltip(help);
    }

    /// <summary>A help with nothing to say is refused: a blank text would draw a badge naming nothing.</summary>
    private static void ThrowIfNoWords(UIPhrase help)
    {
        ArgumentNullException.ThrowIfNull(help);

        if (help.IsText && string.IsNullOrWhiteSpace(help.Key))
            throw new ArgumentException("A help needs words.", nameof(help));
    }

    /// <inheritdoc cref="SetHelp{TComponent, TValue}(InputComponentBase{TComponent, TValue}, UIPhrase)"/>
    public static TComponent SetHelp<TComponent, TItem, TValue, TTemplate>(this InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate> component, UIPhrase help)
        where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
        where TItem : class
        where TTemplate : class, IVisualComponent
    {
        ArgumentNullException.ThrowIfNull(component);
        ThrowIfNoWords(help);

        return component.SetBadgeIcon(UIGlyphs.Help).SetBadgeStyle(UIBadgeType.Plain).SetBadgeTooltip(help);
    }

    /// <summary>
    /// Registers a change event command.
    /// </summary>
    public static T OnChange<T>(this T component, string command) where T : VisualComponentBase<T>, IInputComponent, IUIComponentDefinition
        => component.On(EventNames.Change, command);

    /// <summary>
    /// Registers a change event command with action arguments.
    /// </summary>
    public static T OnChange<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : VisualComponentBase<T>, IInputComponent, IUIComponentDefinition
        => component.On(EventNames.Change, command, arguments);

    /// <summary>
    /// Registers a blur event command.
    /// </summary>
    public static T OnBlur<T>(this T component, string command) where T : VisualComponentBase<T>, IInputComponent, IUIComponentDefinition
        => component.On(EventNames.Blur, command);

    /// <summary>
    /// Registers a blur event command with action arguments.
    /// </summary>
    public static T OnBlur<T>(this T component, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : VisualComponentBase<T>, IInputComponent, IUIComponentDefinition
        => component.On(EventNames.Blur, command, arguments);

    /// <summary>
    /// Adds a required-value validation rule; its message is the author's text or a key.
    /// </summary>
    public static T Required<T>(this T component, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
        => component.Validate(trigger, UIComparisonOperator.Required, null, message, severity);

    /// <summary>
    /// Adds a required-value validation rule whose message is a phrase, such as a key with its arguments.
    /// </summary>
    public static T Required<T>(this T component, UIPhrase message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
        => component.Validate(trigger, UIComparisonOperator.Required, null, message, severity);

    /// <summary>
    /// Adds a regular-expression validation rule; its message is the author's text or a key.
    /// </summary>
    public static T Regex<T>(this T component, string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return component.Validate(trigger, UIComparisonOperator.Regex, pattern, message, severity);
    }

    /// <summary>
    /// Adds a regular-expression validation rule whose message is a phrase, such as a key with its arguments.
    /// </summary>
    public static T Regex<T>(this T component, string pattern, UIPhrase message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return component.Validate(trigger, UIComparisonOperator.Regex, pattern, message, severity);
    }

    /// <summary>
    /// Adds a rule every item of a list value must match — a multi-select's each key, and a tag typed into one with free text is
    /// refused before it becomes a chip; its message is the author's text or a key.
    /// </summary>
    public static T RegexEach<T>(this T component, string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return component.Validate(trigger, UIComparisonOperator.RegexEach, pattern, message, severity);
    }

    /// <summary>
    /// Adds a rule every item of a list value must match, whose message is a phrase, such as a key with its arguments.
    /// </summary>
    public static T RegexEach<T>(this T component, string pattern, UIPhrase message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return component.Validate(trigger, UIComparisonOperator.RegexEach, pattern, message, severity);
    }

    /// <summary>
    /// Adds a validation rule; its message is the author's text or a key, looked up as a plain value on a translatable property is.
    /// </summary>
    public static T Validate<T>(this T component, UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, string message, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        component.AddValidation(new UIValidationRule(trigger, @operator, value, severity, message));
        return component;
    }

    /// <summary>
    /// Adds a validation rule whose message is a phrase: a key with its arguments — a limit's <c>{max}</c> — or <see cref="UIPhrase.Text"/>.
    /// </summary>
    public static T Validate<T>(this T component, UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIPhrase message, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentNullException.ThrowIfNull(message);
        component.AddValidation(new UIValidationRule(trigger, @operator, value, severity, message));
        return component;
    }
}
