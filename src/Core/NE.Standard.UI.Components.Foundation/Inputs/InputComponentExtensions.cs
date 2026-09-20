using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

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
    /// Adds a required-value validation rule.
    /// </summary>
    public static T Required<T>(this T component, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
        => component.Validate(trigger, UIComparisonOperator.Required, null, message, severity);

    /// <summary>
    /// Adds a regular-expression validation rule.
    /// </summary>
    public static T Regex<T>(this T component, string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return component.Validate(trigger, UIComparisonOperator.Regex, pattern, message, severity);
    }

    /// <summary>
    /// Adds a validation rule.
    /// </summary>
    public static T Validate<T>(this T component, UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, string message, UIValidationSeverity severity = UIValidationSeverity.Error)
        where T : IInputComponent
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        component.AddValidation(new UIValidationRule(trigger, @operator, value, severity, message));
        return component;
    }
}
