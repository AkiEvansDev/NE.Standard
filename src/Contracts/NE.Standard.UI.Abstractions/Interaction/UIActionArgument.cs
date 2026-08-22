using System;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Represents a value, binding, or contextual value passed to a UI action.
/// </summary>
public readonly record struct UIActionArgument
{
    /// <summary>
    /// Creates a literal action argument from a value.
    /// </summary>
    public UIActionArgument(object? value)
    {
        Kind = UIActionArgumentKind.Literal;
        Value = value;
        Binding = null;
    }

    /// <summary>
    /// Creates a contextual action argument resolved from the given kind.
    /// </summary>
    public UIActionArgument(UIActionArgumentKind kind)
    {
        if (kind is UIActionArgumentKind.Literal or UIActionArgumentKind.Binding)
            throw new ArgumentOutOfRangeException(nameof(kind));

        Kind = kind;
        Value = null;
        Binding = null;
    }

    /// <summary>
    /// Creates an action argument resolved from a binding path.
    /// </summary>
    public UIActionArgument(UIBindingPath binding)
    {
        Kind = UIActionArgumentKind.Binding;
        Value = null;
        Binding = binding;
    }

    /// <summary>
    /// Gets how this argument is resolved.
    /// </summary>
    public UIActionArgumentKind Kind { get; }

    /// <summary>
    /// Gets the literal value for literal arguments.
    /// </summary>
    public object? Value { get; }

    /// <summary>
    /// Gets the binding path for binding arguments.
    /// </summary>
    public UIBindingPath? Binding { get; }

    /// <summary>
    /// Creates a literal action argument from a value.
    /// </summary>
    public static UIActionArgument Literal(object? value)
        => new(value);

    /// <summary>
    /// Creates an action argument resolved from the current item.
    /// </summary>
    public static UIActionArgument CurrentItem()
        => new(UIActionArgumentKind.CurrentItem);

    /// <summary>
    /// Creates an action argument resolved from the current item key.
    /// </summary>
    public static UIActionArgument CurrentItemKey()
        => new(UIActionArgumentKind.CurrentItemKey);

    /// <summary>
    /// Creates an action argument resolved from a binding path.
    /// </summary>
    public static UIActionArgument Bind(UIBindingPath binding)
        => new(binding);

    public override string ToString()
        => Kind switch
        {
            UIActionArgumentKind.Literal => $"{Value}",
            UIActionArgumentKind.Binding => $"{{{Binding}}}",
            UIActionArgumentKind.CurrentItem or UIActionArgumentKind.CurrentItemKey => $"{{{Kind}}}",
            _ => throw new UnreachableException()
        };
}
