using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// Wraps a plain value as a selectable option, taking both the option's identity and its displayed title
/// from the value itself.
/// </summary>
/// <remarks>The option-shaped counterpart of <see cref="UIValueItem{T}"/>, for <c>Select</c>, <c>Search</c> and <c>RadioGroup</c>.</remarks>
public partial class UIOptionValue<T> : OptionItem
    where T : notnull
{
    /// <summary>
    /// Creates an option wrapping the specified value.
    /// </summary>
    public UIOptionValue(T value)
    {
        var id = UIValueItemId.Create(value);

        Id = id;
        Title = id;
        Value = value;
    }

    /// <summary>
    /// Gets the wrapped value.
    /// </summary>
    /// <remarks>See <see cref="UIValueItem{T}.Value"/> for why this does not change after construction.</remarks>
    [RecursiveMember(false)]
    public T Value { get; }

    public override string ToString()
        => Id;
}
