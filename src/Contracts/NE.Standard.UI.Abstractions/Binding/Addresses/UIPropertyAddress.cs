using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Identifies a component property by compiled component id and property key.
/// </summary>
public readonly record struct UIPropertyAddress
{
    /// <summary>
    /// Creates an address from a component id, a property name, and optional dynamic parameters.
    /// </summary>
    public UIPropertyAddress(UIComponentId componentId, string property, object?[]? dynamicParameters = null)
        : this(new UIComponentAddress(componentId, dynamicParameters), new UIProperty(property))
    { }

    /// <summary>
    /// Creates an address from a component id, a property key, and optional dynamic parameters.
    /// </summary>
    public UIPropertyAddress(UIComponentId componentId, UIProperty property, object?[]? dynamicParameters = null)
        : this(new UIComponentAddress(componentId, dynamicParameters), property)
    { }

    /// <summary>
    /// Creates an address from an already-resolved component address and property key.
    /// </summary>
    public UIPropertyAddress(UIComponentAddress component, UIProperty property)
    {
        if (component.Id.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(component));

        Component = component;
        Property = property;
    }

    /// <summary>
    /// Gets the compiled component address.
    /// </summary>
    public UIComponentAddress Component { get; }

    /// <summary>
    /// Gets the component property key.
    /// </summary>
    public UIProperty Property { get; }

    public override string ToString()
        => $"{Component}.{Property}";
}
