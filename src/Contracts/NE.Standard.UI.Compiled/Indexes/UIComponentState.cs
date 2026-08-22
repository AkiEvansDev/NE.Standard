using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Holds the resolved compiled property values for a single component.
/// </summary>
public sealed class UIComponentState
{
    private readonly FrozenDictionary<UIProperty, CompiledUIPropertyValue> _values;
    private readonly CompiledUIPropertyValue[] _all;

    /// <summary>
    /// Creates a component's state from its compiled property values, validating each one.
    /// </summary>
    public UIComponentState(UIComponentId componentId, CompiledUIPropertyValue[] values)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentNullException.ThrowIfNull(values);

        ComponentId = componentId;
        _all = [.. values];

        Dictionary<UIProperty, CompiledUIPropertyValue> builder = new(values.Length);

        for (var i = 0; i < values.Length; i++)
        {
            CompiledUIPropertyValue value = values[i];

            ValidateValue(componentId, value);

            if (!builder.TryAdd(value.Property, value))
                throw new InvalidOperationException($"Property '{value.Property.Name}' is already registered in state for component '{componentId}'.");
        }

        _values = builder.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets the component id this state belongs to.
    /// </summary>
    public UIComponentId ComponentId { get; }

    /// <summary>
    /// Gets all compiled property values for the component.
    /// </summary>
    public IReadOnlyList<CompiledUIPropertyValue> All => _all;

    /// <summary>
    /// Attempts to get a compiled property value by property key.
    /// </summary>
    public bool TryGet(UIProperty property, [NotNullWhen(true)] out CompiledUIPropertyValue? value)
        => _values.TryGetValue(property, out value);

    private static void ValidateValue(UIComponentId componentId, CompiledUIPropertyValue value)
    {
        ArgumentNullException.ThrowIfNull(value);

        if (value.IsBind)
        {
            if (value.BindingId is not { IsEmpty: false })
                throw new InvalidOperationException($"Bound property '{value.Property.Name}' on component '{componentId}' must specify binding id.");

            if (value.Value is not null)
                throw new InvalidOperationException($"Bound property '{value.Property.Name}' on component '{componentId}' must not specify static value.");

            return;
        }

        if (value.BindingId is not null)
            throw new InvalidOperationException($"Static property '{value.Property.Name}' on component '{componentId}' must not specify binding id.");
    }
}
