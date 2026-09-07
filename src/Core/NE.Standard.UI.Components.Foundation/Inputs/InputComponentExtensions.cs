using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// What every input offers beyond its properties: the change and blur events, and the validation rules.
/// </summary>
/// <remarks>Extension methods, because the two input bases share no base of their own to hold them.</remarks>
public static class InputComponentExtensions
{
    /// <summary>
    /// Registers a change event command.
    /// </summary>
    public static TComponent OnChange<TComponent>(this TComponent input, string command)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        return input.On(EventNames.Change, command);
    }

    /// <summary>
    /// Registers a change event command with action arguments.
    /// </summary>
    public static TComponent OnChange<TComponent>(this TComponent input, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        return input.On(EventNames.Change, command, arguments);
    }

    /// <summary>
    /// Registers a blur event command.
    /// </summary>
    public static TComponent OnBlur<TComponent>(this TComponent input, string command)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        return input.On(EventNames.Blur, command);
    }

    /// <summary>
    /// Registers a blur event command with action arguments.
    /// </summary>
    public static TComponent OnBlur<TComponent>(this TComponent input, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        return input.On(EventNames.Blur, command, arguments);
    }

    /// <summary>
    /// Adds a required-value validation rule.
    /// </summary>
    public static TComponent Required<TComponent>(this TComponent input, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
        => input.Validate(trigger, UIComparisonOperator.Required, null, message, severity);

    /// <summary>
    /// Adds a regular-expression validation rule.
    /// </summary>
    public static TComponent Regex<TComponent>(this TComponent input, string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return input.Validate(trigger, UIComparisonOperator.Regex, pattern, message, severity);
    }

    /// <summary>
    /// Adds a validation rule.
    /// </summary>
    public static TComponent Validate<TComponent>(this TComponent input, UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, string message, UIValidationSeverity severity = UIValidationSeverity.Error)
        where TComponent : VisualComponentBase<TComponent>, IInputComponent, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(input);
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        if (input is not IInputValidationSink sink)
            throw new InvalidOperationException($"'{input.TypeKey}' keeps no validation rules.");

        sink.AddValidation(new UIValidationRule(trigger, @operator, value, severity, message));
        return input;
    }
}
