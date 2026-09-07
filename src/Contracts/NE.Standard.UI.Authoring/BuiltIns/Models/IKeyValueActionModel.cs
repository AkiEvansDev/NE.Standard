using NE.Standard.UI.Abstractions.Binding;

namespace NE.Standard.UI.Authoring.BuiltIns.Models;

/// <summary>
/// Represents a bindable key-value item with an associated action.
/// </summary>
public interface IKeyValueActionModel : IBindableItem
{
    /// <summary>
    /// Gets the content rendered in the row's key slot.
    /// </summary>
    ITextModel Key { get; }

    /// <summary>
    /// Gets the content rendered in the row's value slot.
    /// </summary>
    ITextModel Value { get; }

    /// <summary>
    /// Gets the content rendered in the row's action slot.
    /// </summary>
    IButtonModel Action { get; }

    /// <summary>
    /// Gets whether the row shows its value as an input: editing state is the row's, so it survives anything the page does around it.
    /// </summary>
    bool? ShowInput { get; }

    /// <summary>
    /// Gets the draft the input edits; <c>Value</c> stays what the row shows until a save moves the draft over.
    /// </summary>
    object? EditValue { get; }

    /// <summary>
    /// Gets which typed input the row opens with, naming a variant registered on the list; unset, the list's default input.
    /// </summary>
    string? InputTemplate { get; }
}
