using System;

namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Identifies an authoring component reference before compilation/runtime resolution.
/// </summary>
public readonly record struct UIComponentReference
{
    /// <summary>
    /// Creates a reference from an authoring component id and the row keys it needs, outermost first.
    /// </summary>
    public UIComponentReference(string componentId, object?[]? dynamicParameters = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        Id = componentId;
        DynamicParameters = CopyAndValidateDynamicParameters(dynamicParameters);
    }

    /// <summary>
    /// Creates a reference from an authoring component and the row keys it needs, outermost first.
    /// </summary>
    public UIComponentReference(IBindableComponent component, object?[]? dynamicParameters = null)
        : this(component is null ? throw new ArgumentNullException(nameof(component)) : component.Id, dynamicParameters)
    { }

    /// <summary>
    /// Gets the authoring component id.
    /// </summary>
    public string Id { get; }

    /// <summary>
    /// Gets dynamic reference parameters used for templated or repeated component instances.
    /// </summary>
    // A default instance, never constructed, holds none rather than null: its hash, text and count read it.
    public object?[] DynamicParameters => field ?? [];

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
        => CombineDynamicParametersHash(Id, DynamicParameters);

    internal static object?[] CopyAndValidateDynamicParameters(object?[]? dynamicParameters)
    {
        object?[] copy = dynamicParameters is null || dynamicParameters.Length == 0
            ? []
            : [.. dynamicParameters];

        ValidateDynamicParameters(copy);
        return copy;
    }

    internal static int CombineDynamicParametersHash<TId>(TId id, object?[] dynamicParameters)
    {
        HashCode hash = new();
        hash.Add(id);

        foreach (var parameter in dynamicParameters)
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
            if (!UIRowKeys.IsKey(dynamicParameters[i]))
                throw new ArgumentException($"Dynamic parameter #{i} must be int or string.", nameof(dynamicParameters));
        }
    }

    public override string ToString()
        => DynamicParameters.Length == 0
            ? Id
            : $"{Id}[{string.Join(", ", DynamicParameters)}]";
}
