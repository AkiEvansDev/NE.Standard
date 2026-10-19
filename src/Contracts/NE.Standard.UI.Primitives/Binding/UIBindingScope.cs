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
    /// Resolves the binding path in the scope around the component's own: up past the nearest component that defines a context (a
    /// row's template, a menu's entry), one step out — so a control straight in a row reaches the list's scope, not the row.
    /// </summary>
    Parent = 1,

    /// <summary>
    /// Resolves the binding path relative to the root context.
    /// </summary>
    Root = 2,
}
