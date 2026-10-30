using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Gives a property that a <see cref="UIComponentPropertyBlockAttribute"/> or a base component brings onto the type a default of the
/// type's own, read from a static member the type declares.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = true)]
public sealed class UIComponentPropertyDefaultAttribute(string propertyName, string valueMember) : Attribute
{
    /// <summary>
    /// Gets the name of the block or inherited component property the default is for.
    /// </summary>
    public string PropertyName { get; } = propertyName;

    /// <summary>
    /// Gets the name of the static field, property or parameterless method on the type that gives the default.
    /// </summary>
    public string ValueMember { get; } = valueMember;
}
