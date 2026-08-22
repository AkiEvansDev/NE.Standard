using System;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Configures generated metadata and fluent API support for a UI component property.
/// </summary>
[AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
public sealed class UIComponentPropertyAttribute : Attribute
{
    /// <summary>
    /// Gets or sets the contract type that exposes the property.
    /// </summary>
    public Type? Contract { get; init; }

    /// <summary>
    /// Gets or sets the property name on the contract type when it differs from the annotated property.
    /// </summary>
    public string? ContractPropertyName { get; init; }

    /// <summary>
    /// Gets or sets whether the property can participate in UI bindings.
    /// </summary>
    public bool IsBindable { get; init; } = true;

    /// <summary>
    /// Gets or sets the binding operations supported by the property.
    /// </summary>
    public UIBindingCapabilities BindingCapabilities { get; init; } = UIBindingCapabilities.SourceToTarget;

    /// <summary>
    /// Gets or sets the default value assigned to generated property metadata.
    /// </summary>
    public object? DefaultValue { get; init; }

    /// <summary>
    /// Gets or sets the member name used to read the default value when it cannot be represented as an attribute value.
    /// </summary>
    public string? DefaultValueMember { get; init; }

    /// <summary>
    /// Gets or sets whether a fluent value setter should be generated.
    /// </summary>
    public bool GenerateSetter { get; init; } = true;

    /// <summary>
    /// Gets or sets whether a fluent binding setter should be generated.
    /// </summary>
    public bool GenerateBinder { get; init; } = true;

    /// <summary>
    /// Gets or sets the default scope used when the property is bound.
    /// </summary>
    public UIBindingScope DefaultBindingScope { get; init; } = UIBindingScope.Root;

    /// <summary>
    /// Gets or sets the default binding mode used when the property is bound.
    /// </summary>
    public UIBindingMode DefaultBindingMode { get; init; } = UIBindingMode.OneWay;
}
