using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Marks a property as part of a recursively observed object graph.
/// </summary>
[AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
public sealed class RecursiveMemberAttribute : Attribute
{
    /// <summary>
    /// Initializes the attribute with recursive member metadata generation enabled.
    /// </summary>
    public RecursiveMemberAttribute() { }

    /// <summary>
    /// Initializes the attribute and controls whether recursive member metadata should be generated.
    /// </summary>
    public RecursiveMemberAttribute(bool generate)
    {
        Generate = generate;
    }

    /// <summary>
    /// Gets whether recursive member metadata should be generated for the property.
    /// </summary>
    public bool Generate { get; } = true;
}
