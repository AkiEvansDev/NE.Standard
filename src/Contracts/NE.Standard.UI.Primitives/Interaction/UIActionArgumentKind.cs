namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// Defines how an interaction action argument is resolved.
/// </summary>
public enum UIActionArgumentKind
{
    /// <summary>
    /// The argument value is a fixed literal.
    /// </summary>
    Literal = 0,

    /// <summary>
    /// The argument value is the current item of the enclosing items scope.
    /// </summary>
    CurrentItem = 1,

    /// <summary>
    /// The argument value is the key of the current item of the enclosing items scope.
    /// </summary>
    CurrentItemKey = 2,

    /// <summary>
    /// The argument value is resolved from a binding.
    /// </summary>
    Binding = 3,
}
