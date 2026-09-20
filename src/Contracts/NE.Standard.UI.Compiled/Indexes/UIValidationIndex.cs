using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Linq;
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
    private readonly FrozenDictionary<UIComponentId, UIPropertyAddress> _messageTargets;
    private readonly FrozenSet<UIPropertyAddress> _messageTargetAddresses;
    private readonly CompiledUIValidationRule[] _all;

    /// <summary>
    /// Initializes the validation index and validates validation rules.
    /// </summary>
    public UIValidationIndex(CompiledUIValidationRule[] rules)
        : this(rules, [])
    { }

    /// <summary>
    /// Initializes the index with the fields that send their message somewhere other than their own edge.
    /// </summary>
    public UIValidationIndex(CompiledUIValidationRule[] rules, KeyValuePair<UIComponentId, UIPropertyAddress>[] messageTargets)
    {
        ArgumentNullException.ThrowIfNull(rules);
        ArgumentNullException.ThrowIfNull(messageTargets);

        _messageTargets = messageTargets.ToFrozenDictionary();
        _messageTargetAddresses = messageTargets.Select(static pair => pair.Value).ToFrozenSet();
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
    /// Gets every field that sends its validation message to another component's property.
    /// </summary>
    public IReadOnlyDictionary<UIComponentId, UIPropertyAddress> MessageTargets => _messageTargets;

    /// <summary>
    /// The property a field's validation message is written to, when it does not stay on the field.
    /// </summary>
    public bool TryGetMessageTarget(UIComponentId componentId, out UIPropertyAddress target)
        => _messageTargets.TryGetValue(componentId, out target);

    /// <summary>
    /// Whether some field sends its validation message to this property.
    /// </summary>
    public bool IsMessageTarget(UIPropertyAddress property)
        => _messageTargetAddresses.Contains(property);

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
