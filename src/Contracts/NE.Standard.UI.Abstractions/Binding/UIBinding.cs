using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Abstractions.Binding;

/// <summary>
/// Describes a binding from a recursive source path to a UI component property.
/// </summary>
public readonly record struct UIBinding
{
    private UIBinding(UIProperty target, RecursivePath source, UIBindingScope scope, UIBindingMode mode)
    {
        Target = target;
        Source = source;
        Scope = scope;
        Mode = mode;
    }

    /// <summary>
    /// Gets the target component property.
    /// </summary>
    public UIProperty Target { get; }

    /// <summary>
    /// Gets the recursive source path.
    /// </summary>
    public RecursivePath Source { get; }

    /// <summary>
    /// Gets the source context used to resolve the binding path.
    /// </summary>
    public UIBindingScope Scope { get; }

    /// <summary>
    /// Gets the binding data flow mode.
    /// </summary>
    public UIBindingMode Mode { get; }

    /// <summary>
    /// Creates a binding for a component property.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// <paramref name="path"/> is <see langword="null"/>.
    /// </exception>
    public static UIBinding Property(UIProperty property, RecursivePath path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.OneWay)
    {
        ArgumentNullException.ThrowIfNull(path);
        return new UIBinding(property, path, scope, mode);
    }

    /// <summary>
    /// Creates a binding for a component data context.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// <paramref name="path"/> is <see langword="null"/>.
    /// </exception>
    public static UIBinding Context(RecursivePath path, UIBindingScope scope = UIBindingScope.Relative, UIBindingMode mode = UIBindingMode.OneWay)
    {
        ArgumentNullException.ThrowIfNull(path);
        return new UIBinding(new UIProperty(nameof(IBindableComponent.Context)), path, scope, mode);
    }

    public override string ToString()
        => $"{Mode}:${Scope}.{Source}>{Target}";
}
