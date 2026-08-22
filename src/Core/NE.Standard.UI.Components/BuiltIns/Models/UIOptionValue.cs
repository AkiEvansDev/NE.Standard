using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// Wraps a plain value as a selectable option, taking both the option's identity and its displayed title
/// from the value itself.
/// </summary>
/// <remarks>
/// The option-shaped counterpart of <see cref="UIValueItem{T}"/>: <c>Select</c>, <c>Search</c> and
/// <c>RadioGroup</c> type their items as <see cref="IOptionModel"/> and their default template binds
/// <c>Title</c>, so a bare value wrapper would bind against nothing and render empty rows. Filling
/// <c>Title</c> here is what lets a list of values be bound with no template of its own.
/// </remarks>
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
