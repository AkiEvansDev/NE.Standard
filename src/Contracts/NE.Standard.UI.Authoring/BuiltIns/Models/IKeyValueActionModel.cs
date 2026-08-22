using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents a bindable key-value item with an associated action.
/// </summary>
public interface IKeyValueActionModel : IBindableItem
{
    /// <summary>
    /// Gets the key content context.
    /// </summary>
    ITextModel Key { get; }

    /// <summary>
    /// Gets the value content context.
    /// </summary>
    ITextModel Value { get; }

    /// <summary>
    /// Gets the associated action content context.
    /// </summary>
    IButtonModel Action { get; }
}
