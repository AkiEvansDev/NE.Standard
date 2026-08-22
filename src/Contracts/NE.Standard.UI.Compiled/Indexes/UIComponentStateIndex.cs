using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled component state.
/// </summary>
public sealed class UIComponentStateIndex
{
    private readonly FrozenDictionary<UIComponentId, UIComponentState> _states;
    private readonly UIComponentState[] _all;

    /// <summary>
    /// Initializes the component state index and validates state uniqueness.
    /// </summary>
    public UIComponentStateIndex(UIComponentState[] states)
    {
        ArgumentNullException.ThrowIfNull(states);

        _all = [.. states];

        Dictionary<UIComponentId, UIComponentState> builder = new(states.Length);

        for (var i = 0; i < states.Length; i++)
        {
            UIComponentState state = states[i];

            if (state.ComponentId.IsEmpty)
                throw new InvalidOperationException("State component id must not be empty.");

            if (!builder.TryAdd(state.ComponentId, state))
                throw new InvalidOperationException($"State for component '{state.ComponentId}' is already registered.");
        }

        _states = builder.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets all registered component states.
    /// </summary>
    public IReadOnlyList<UIComponentState> All => _all;

    /// <summary>
    /// Attempts to get component state by component id.
    /// </summary>
    public bool TryGet(UIComponentId componentId, [NotNullWhen(true)] out UIComponentState? state)
        => componentId.IsEmpty
            ? throw new ArgumentException("Component id must not be empty.", nameof(componentId))
            : _states.TryGetValue(componentId, out state);

    /// <summary>
    /// Gets component state by component id or throws when it is not registered.
    /// </summary>
    public UIComponentState GetRequired(UIComponentId componentId)
        => TryGet(componentId, out UIComponentState? state)
            ? state
            : throw new InvalidOperationException($"State for component '{componentId}' was not found.");

    /// <summary>
    /// Attempts to get a compiled property value for a component.
    /// </summary>
    public bool TryGetValue(UIComponentId componentId, UIProperty property, [NotNullWhen(true)] out CompiledUIPropertyValue? value)
    {
        if (!TryGet(componentId, out UIComponentState? state))
        {
            value = null;
            return false;
        }

        return state.TryGet(property, out value);
    }
}
