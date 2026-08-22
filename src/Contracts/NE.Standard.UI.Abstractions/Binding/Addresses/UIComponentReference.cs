using System;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Identifies an authoring component reference before compilation/runtime resolution.
/// </summary>
public readonly record struct UIComponentReference
{
    public UIComponentReference(string componentId, object?[]? dynamicParameters = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        Id = componentId;
        DynamicParameters = dynamicParameters is null || dynamicParameters.Length == 0
            ? []
            : [.. dynamicParameters];

        ValidateDynamicParameters(DynamicParameters);
    }

    /// <summary>
    /// Gets the authoring component id.
    /// </summary>
    public string Id { get; }

    /// <summary>
    /// Gets dynamic reference parameters used for templated or repeated component instances.
    /// </summary>
    public object?[] DynamicParameters { get; }

    /// <summary>
    /// Gets whether this reference contains dynamic parameters.
    /// </summary>
    public bool HasDynamicParameters => DynamicParameters.Length != 0;

    /// <summary>
    /// Determines whether this reference is equal to another, comparing dynamic parameters by value.
    /// </summary>
    public bool Equals(UIComponentReference other)
        => Id == other.Id && DynamicParameters.AsSpan().SequenceEqual(other.DynamicParameters);

    public override int GetHashCode()
    {
        HashCode hash = new();
        hash.Add(Id);

        foreach (var parameter in DynamicParameters)
            hash.Add(parameter);

        return hash.ToHashCode();
    }

    /// <summary>
    /// Validates that all dynamic parameters are supported reference parameter values.
    /// </summary>
    public static void ValidateDynamicParameters(object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        for (var i = 0; i < dynamicParameters.Length; i++)
        {
            if (dynamicParameters[i] is not null and not int and not string)
                throw new ArgumentException($"Dynamic parameter #{i} must be int or string.", nameof(dynamicParameters));
        }
    }

    public override string ToString()
        => DynamicParameters.Length == 0
            ? Id
            : $"{Id}[{string.Join(", ", DynamicParameters)}]";
}
