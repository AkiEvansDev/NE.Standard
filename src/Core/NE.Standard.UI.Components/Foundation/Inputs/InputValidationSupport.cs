using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.Foundation.Inputs;

/// <summary>
/// Shared validation-rule support composed by input component base classes.
/// </summary>
internal sealed class InputValidationSupport<TComponent>
    where TComponent : VisualComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly List<UIValidationRule> _validations = [];

    public IReadOnlyList<UIValidationRule> Validations => _validations;

    public TComponent Required(TComponent owner, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIColorStyle severity = UIColorStyle.Danger)
        => Validate(owner, trigger, UIComparisonOperator.Required, null, severity, message);

    public TComponent Regex(TComponent owner, string pattern, string message, UIValidationTrigger trigger = UIValidationTrigger.Change, UIColorStyle severity = UIColorStyle.Danger)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern);
        return Validate(owner, trigger, UIComparisonOperator.Regex, pattern, severity, message);
    }

    public TComponent Validate(TComponent owner, UIValidationTrigger trigger, UIComparisonOperator @operator, object? value, UIColorStyle severity, string message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        _validations.Add(new UIValidationRule(trigger, @operator, value, severity, message));
        return owner;
    }
}
