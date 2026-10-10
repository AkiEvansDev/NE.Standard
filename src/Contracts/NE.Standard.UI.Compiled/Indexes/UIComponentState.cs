using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Holds the resolved compiled property values for a single component.
/// </summary>
/// <remarks>
/// The values stand in the slots of a layout shared by the component's type, so a view of thousands of components holds one
/// property index per type rather than one per component.
/// </remarks>
public sealed class UIComponentState
{
    private readonly CompiledUIPropertyValue[] _values;

    /// <summary>
    /// Creates a component's state from its compiled property values, validating each one.
    /// </summary>
    public UIComponentState(UIComponentId componentId, CompiledUIPropertyValue[] values)
        : this(componentId, CreateLayout(values), values)
    {
    }

    /// <summary>
    /// Creates a component's state from a value per slot of its type's layout, validating each one.
    /// </summary>
    public UIComponentState(UIComponentId componentId, UIComponentStateLayout layout, CompiledUIPropertyValue[] values)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        ArgumentNullException.ThrowIfNull(layout);
        ArgumentNullException.ThrowIfNull(values);

        if (values.Length != layout.Count)
            throw new ArgumentException($"Component '{componentId}' has {values.Length} value(s) for a layout of {layout.Count} slot(s).", nameof(values));

        for (var i = 0; i < values.Length; i++)
        {
            CompiledUIPropertyValue value = values[i];

            ValidateValue(componentId, value);

            if (!value.Property.Equals(layout.Properties[i]))
                throw new InvalidOperationException($"Property '{value.Property.Name}' on component '{componentId}' stands in the slot of '{layout.Properties[i].Name}'.");
        }

        ComponentId = componentId;
        Layout = layout;
        _values = [.. values];
    }

    private static UIComponentStateLayout CreateLayout(CompiledUIPropertyValue[] values)
    {
        ArgumentNullException.ThrowIfNull(values);

        UIProperty[] properties = new UIProperty[values.Length];

        for (var i = 0; i < values.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(values[i]);
            properties[i] = values[i].Property;
        }

        return new UIComponentStateLayout(properties);
    }

    /// <summary>
    /// Gets the component id this state belongs to.
    /// </summary>
    public UIComponentId ComponentId { get; }

    /// <summary>
    /// Gets the layout the values stand in, shared by the component's type.
    /// </summary>
    public UIComponentStateLayout Layout { get; }

    /// <summary>
    /// Gets all compiled property values for the component.
    /// </summary>
    public IReadOnlyList<CompiledUIPropertyValue> All => _values;

    /// <summary>
    /// Attempts to get a compiled property value by property key.
    /// </summary>
    public bool TryGet(UIProperty property, [NotNullWhen(true)] out CompiledUIPropertyValue? value)
    {
        if (Layout.TryGetSlot(property, out var slot))
        {
            value = _values[slot];
            return true;
        }

        value = null;
        return false;
    }

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
