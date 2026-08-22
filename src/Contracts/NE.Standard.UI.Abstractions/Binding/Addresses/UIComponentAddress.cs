using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Identifies a compiled component instance on the client.
/// </summary>
public readonly record struct UIComponentAddress
{
    public UIComponentAddress(UIComponentId componentId, object?[]? dynamicParameters = null)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        Id = componentId;
        DynamicParameters = dynamicParameters is null || dynamicParameters.Length == 0
            ? []
            : [.. dynamicParameters];

        UIComponentReference.ValidateDynamicParameters(DynamicParameters);
    }

    /// <summary>
    /// Gets the compiled component id.
    /// </summary>
    public UIComponentId Id { get; }

    /// <summary>
    /// Gets dynamic address parameters used for templated or repeated component instances.
    /// </summary>
    public object?[] DynamicParameters { get; }

    /// <summary>
    /// Gets whether this address contains dynamic parameters.
    /// </summary>
    public bool HasDynamicParameters => DynamicParameters.Length != 0;

    /// <summary>
    /// Determines whether this address is equal to another, comparing dynamic parameters by value.
    /// </summary>
    public bool Equals(UIComponentAddress other)
        => Id.Equals(other.Id) && DynamicParameters.AsSpan().SequenceEqual(other.DynamicParameters);

    public override int GetHashCode()
    {
        HashCode hash = new();
        hash.Add(Id);

        foreach (var parameter in DynamicParameters)
            hash.Add(parameter);

        return hash.ToHashCode();
    }

    public override string ToString()
        => DynamicParameters.Length == 0
            ? Id.ToString()
            : $"{Id}[{string.Join(", ", DynamicParameters)}]";
}
