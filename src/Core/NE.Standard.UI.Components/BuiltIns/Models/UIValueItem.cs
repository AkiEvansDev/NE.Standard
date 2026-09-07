using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// Wraps a plain value as a bindable item, taking the item's identity from the value itself.
/// </summary>
/// <remarks>
/// The identity is the value, so a list holding the same value twice is refused; use <see cref="UIOptionValue{T}"/>
/// for <c>Select</c>/<c>Search</c>/<c>RadioGroup</c>.
/// </remarks>
public partial class UIValueItem<T>(T value) : RecursiveObservable, IBindableItem
    where T : notnull
{
    /// <inheritdoc />
    [RecursiveMember(false)]
    public string Id { get; } = UIValueItemId.Create(value);

    /// <summary>
    /// Gets the wrapped value.
    /// </summary>
    /// <remarks>Read-only: the id is derived from it, so replace the item to change the value.</remarks>
    [RecursiveMember(false)]
    public T Value { get; } = value;

    public override string ToString()
        => Id;
}
