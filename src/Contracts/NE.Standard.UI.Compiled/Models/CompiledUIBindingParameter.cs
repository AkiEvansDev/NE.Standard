using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Defines the kind of compiled binding template parameter.
/// </summary>
public enum CompiledUIBindingParameterKind
{
    Dynamic = 0,
    Fixed = 1,
    Scope = 2
}

/// <summary>
/// Represents a fixed or runtime-provided binding template parameter.
/// </summary>
public sealed class CompiledUIBindingParameter
{
    /// <summary>
    /// Gets the parameter kind.
    /// </summary>
    public required CompiledUIBindingParameterKind Kind { get; init; }

    /// <summary>
    /// Gets the component id that provides the parameter value at runtime.
    /// </summary>
    public UIComponentId? ComponentId { get; init; }

    /// <summary>
    /// Gets the fixed parameter value.
    /// </summary>
    public object? Value { get; init; }

    /// <summary>
    /// Creates a dynamic binding parameter provided by a component at runtime.
    /// </summary>
    public static CompiledUIBindingParameter Dynamic(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return new CompiledUIBindingParameter
        {
            Kind = CompiledUIBindingParameterKind.Dynamic,
            ComponentId = componentId
        };
    }

    /// <summary>
    /// Creates a parameter that identifies an enclosing item scope without indexing this path.
    /// </summary>
    /// <remarks>
    /// Used when a nested items collection has a source of its own, so this path is not an extension of the row's own path.
    /// </remarks>
    public static CompiledUIBindingParameter Scope(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return new CompiledUIBindingParameter
        {
            Kind = CompiledUIBindingParameterKind.Scope,
            ComponentId = componentId
        };
    }

    /// <summary>
    /// Creates a fixed binding parameter.
    /// </summary>
    public static CompiledUIBindingParameter Fixed(object value)
    {
        ArgumentNullException.ThrowIfNull(value);

        return value is not int and not string
            ? throw new ArgumentException("Binding parameter must be int or string.", nameof(value))
            : new CompiledUIBindingParameter
            {
                Kind = CompiledUIBindingParameterKind.Fixed,
                Value = value
            };
    }
}
