using System;
using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Identifies a component property by authoring component reference and property key.
/// </summary>
public readonly record struct UIPropertyReference
{
    /// <summary>
    /// Creates a reference from a component id, a property name, and optional dynamic parameters.
    /// </summary>
    public UIPropertyReference(string componentId, string property, object?[]? dynamicParameters = null)
        : this(new UIComponentReference(componentId, dynamicParameters), new UIProperty(property))
    { }

    /// <summary>
    /// Creates a reference from a component id, a property key, and optional dynamic parameters.
    /// </summary>
    public UIPropertyReference(string componentId, UIProperty property, object?[]? dynamicParameters = null)
        : this(new UIComponentReference(componentId, dynamicParameters), property)
    { }

    /// <summary>
    /// Creates a reference from an already-resolved component reference and property key.
    /// </summary>
    public UIPropertyReference(UIComponentReference component, UIProperty property)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(component.Id);

        Component = component;
        Property = property;
    }

    /// <summary>
    /// Gets the authoring component reference.
    /// </summary>
    public UIComponentReference Component { get; }

    /// <summary>
    /// Gets the component property key.
    /// </summary>
    public UIProperty Property { get; }

    public override string ToString()
        => $"{Component}.{Property}";
}
