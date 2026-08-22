using System;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Abstractions.Binding.Properties;

/// <summary>
/// Describes a registered UI component property.
/// </summary>
public sealed class UIPropertyDefinition
{
    /// <summary>
    /// Gets the component type key that owns the property.
    /// </summary>
    public required string ComponentTypeKey { get; init; }

    /// <summary>
    /// Gets the property key.
    /// </summary>
    public required UIProperty Property { get; init; }

    /// <summary>
    /// Gets the CLR value type accepted by the property.
    /// </summary>
    public required Type ValueType { get; init; }

    /// <summary>
    /// Gets whether the property can participate in UI bindings.
    /// </summary>
    public bool IsBindable { get; init; }

    /// <summary>
    /// Gets the binding operations supported by the property.
    /// </summary>
    public UIBindingCapabilities BindingCapabilities { get; init; }

    /// <summary>
    /// Gets the default property value, when one is registered.
    /// </summary>
    public object? DefaultValue { get; init; }

    /// <summary>
    /// Gets whether the property accepts <see langword="null"/> values.
    /// </summary>
    public bool IsNullable { get; init; }

    /// <summary>
    /// Gets whether the property value is localizable text.
    /// </summary>
    public bool IsTranslatable { get; init; }

    /// <summary>
    /// Gets the accessor used to read the property value from a component instance.
    /// </summary>
    public required Func<IBindableComponent, object?> Getter { get; init; }
}
