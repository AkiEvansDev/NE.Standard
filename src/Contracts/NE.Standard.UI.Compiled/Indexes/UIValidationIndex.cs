using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled validation rules by target property.
/// </summary>
public sealed class UIValidationIndex
{
    private static readonly CompiledUIValidationRule[] Empty = [];

    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIValidationRule[]> _byTarget;
    private readonly FrozenDictionary<UIComponentId, CompiledUIValidationRule[]> _byComponent;
    private readonly CompiledUIValidationRule[] _all;

    /// <summary>
    /// Initializes the validation index and validates validation rules.
    /// </summary>
    public UIValidationIndex(CompiledUIValidationRule[] rules)
    {
        ArgumentNullException.ThrowIfNull(rules);

        _all = [.. rules];

        Dictionary<UIPropertyAddress, List<CompiledUIValidationRule>> builder = [];
        Dictionary<UIComponentId, List<CompiledUIValidationRule>> byComponent = [];

        for (var i = 0; i < rules.Length; i++)
        {
            CompiledUIValidationRule rule = rules[i];

            ValidateRule(rule);

            GroupingIndex.Add(builder, rule.Target, rule);
            GroupingIndex.Add(byComponent, rule.Target.Component.Id, rule);
        }

        _byTarget = GroupingIndex.Freeze(builder);
        _byComponent = GroupingIndex.Freeze(byComponent);
    }

    /// <summary>
    /// Gets all registered validation rules.
    /// </summary>
    public IReadOnlyList<CompiledUIValidationRule> All => _all;

    /// <summary>
    /// Gets validation rules for the specified target property.
    /// </summary>
    public IReadOnlyList<CompiledUIValidationRule> Get(UIPropertyAddress target)
        => _byTarget.TryGetValue(target, out CompiledUIValidationRule[]? rules) ? rules : Empty;

    /// <summary>
    /// Gets validation rules related to the specified component.
    /// </summary>
    public IReadOnlyList<CompiledUIValidationRule> GetByComponent(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return _byComponent.TryGetValue(componentId, out CompiledUIValidationRule[]? rules) ? rules : Empty;
    }

    private static void ValidateRule(CompiledUIValidationRule rule)
    {
        ArgumentNullException.ThrowIfNull(rule);

        if (rule.Target.Component.Id.IsEmpty)
            throw new InvalidOperationException("Validation target component id is invalid.");

        ArgumentException.ThrowIfNullOrWhiteSpace(rule.Message);
    }
}
