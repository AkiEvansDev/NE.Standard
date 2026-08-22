namespace NE.Standard.UI.Primitives.Binding;

/// <summary>
/// Defines the component context used to resolve a binding path.
/// </summary>
public enum UIBindingScope
{
    /// <summary>
    /// Resolves the binding path relative to the component's own context.
    /// </summary>
    Relative = 0,

    /// <summary>
    /// Resolves the binding path relative to the parent component's context.
    /// </summary>
    Parent = 1,

    /// <summary>
    /// Resolves the binding path relative to the root context.
    /// </summary>
    Root = 2,
}
