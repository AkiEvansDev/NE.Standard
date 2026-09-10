using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Base class for templated input components with value binding, item templates, events, and validation rules.
/// </summary>
/// <remarks><see cref="InputComponentBase{TComponent, TValue}"/> is the same thing over a plain visual component.</remarks>
[UIComponentPropertyBlock(typeof(IInputComponent))]
[UIComponentPropertyBlock(typeof(ITextBaseComponent))]
public abstract partial class InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>(string? id = null) : GroupedItemsComponentBase<TComponent, TItem, TTemplate>(id), IInputComponent, ITextBaseComponent
    where TComponent : InputTemplatedComponentBase<TComponent, TItem, TValue, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private readonly List<UIValidationRule> _validations = [];

    private static readonly UIThemeColor DefaultIconColor = UIThemeColor.FromStyle(UIColorStyle.Primary);
    private static readonly UITextAppearance DefaultTitleType = UITextAppearance.Caption;

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IInputComponent), BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource | UIBindingCapabilities.SubmitBufferedTargetToSource, DefaultBindingMode = UIBindingMode.TwoWay)]
    public TValue? Value { get; set; }

    /// <inheritdoc/>
    object? IInputComponent.Value => Value;

    // The three label properties a field's caption differs on; the rest come from the ITextBaseComponent block.

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultIconColor))]
    public UIThemeColor? IconColor { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValueMember = nameof(DefaultTitleType))]
    public UITextAppearance? TitleType { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(ITextBaseComponent), DefaultValue = UITextBadgePlacement.Trailing)]
    public UITextBadgePlacement? BadgePlacement { get; set; }

    /// <inheritdoc/>
    public IReadOnlyList<UIValidationRule> Validations => _validations;

    /// <summary>
    /// Registers a change event command.
    /// </summary>
    public TComponent OnChange(string command)
        => On(EventNames.Change, command);

    /// <summary>
    /// Registers a change event command with action arguments.
    /// </summary>
    public TComponent OnChange(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Change, command, arguments);

    /// <summary>
    /// Registers a blur event command.
    /// </summary>
    public TComponent OnBlur(string command)
        => On(EventNames.Blur, command);

    /// <summary>
    /// Registers a blur event command with action arguments.
    /// </summary>
    public TComponent OnBlur(string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        => On(EventNames.Blur, command, arguments);

    /// <summary>
    /// Adds a required-value validation rule.
    /// </summary>
    public TComponent Required(string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
        => Validate(trigger, UIComparisonOperator.Required, null, message, severity);

    /// <summary>
    /// Adds a regular-expression validation rule.
    /// </summary>
    public TComponent Regex(string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIValidationSeverity severity = UIValidationSeverity.Error)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return Validate(trigger, UIComparisonOperator.Regex, pattern, message, severity);
    }

    /// <summary>
    /// Adds a validation rule.
    /// </summary>
    public TComponent Validate(UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, string message, UIValidationSeverity severity = UIValidationSeverity.Error)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        _validations.Add(new UIValidationRule(trigger, @operator, value, severity, message));
        return (TComponent)this;
    }
}
