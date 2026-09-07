using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Declares that a component type carries the whole annotated property block of <see cref="Contract"/>,
/// generating its properties, metadata, setters and binders as if declared by hand.
/// </summary>
/// <remarks>
/// A property declared by hand on the consuming type overrides the generated one.
/// </remarks>
[AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = true)]
public sealed class UIComponentPropertyBlockAttribute(Type contract) : Attribute
{
    /// <summary>
    /// Gets the contract whose annotated properties are generated onto the type.
    /// </summary>
    public Type Contract { get; } = contract;
}
