using System;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Abstractions.Binding;

/// <summary>
/// Represents a recursive binding path and the context used to resolve it.
/// </summary>
public readonly record struct UIBindingPath
{
    /// <summary>
    /// Creates a binding path from a recursive path and the scope used to resolve it.
    /// </summary>
    public UIBindingPath(RecursivePath path, UIBindingScope scope = UIBindingScope.Relative)
    {
        ArgumentNullException.ThrowIfNull(path);

        Path = path;
        Scope = scope;
    }

    /// <summary>
    /// Gets the recursive binding path.
    /// </summary>
    public RecursivePath Path { get; }

    /// <summary>
    /// Gets the context used to resolve the path.
    /// </summary>
    public UIBindingScope Scope { get; }

    /// <summary>
    /// Creates a binding path resolved relative to the current binding context.
    /// </summary>
    public static UIBindingPath Relative(RecursivePath path)
        => new(path, UIBindingScope.Relative);

    /// <summary>
    /// Creates a binding path resolved relative to the parent binding context.
    /// </summary>
    public static UIBindingPath Parent(RecursivePath path)
        => new(path, UIBindingScope.Parent);

    /// <summary>
    /// Creates a binding path resolved relative to the root binding context.
    /// </summary>
    public static UIBindingPath Root(RecursivePath path)
        => new(path, UIBindingScope.Root);

    public override string ToString()
        => $"${Scope}.{Path}";
}
