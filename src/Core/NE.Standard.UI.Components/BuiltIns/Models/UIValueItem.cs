using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.BuiltIns.Models;

/// <summary>
/// Wraps a plain value as a bindable item, taking the item's identity from the value itself.
/// </summary>
/// <remarks>
/// Every item collection is addressed by <see cref="IBindableItem.Id"/>, so a list of plain values —
/// strings, enums, numbers — needs an identity before it can be bound to an items component. Wrapping is
/// deliberately the author's call rather than something the framework does behind the collection: a value
/// carries no identity beyond "it is this value", and only the author knows whether that holds for their
/// list. It does not hold for a list that may contain the same value twice, and the collection refuses that
/// case rather than silently addressing both copies as one.
/// Use <see cref="UIOptionValue{T}"/> instead for <c>Select</c>/<c>Search</c>/<c>RadioGroup</c>, whose item
/// contract is <c>IOptionModel</c>.
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
    /// <remarks>
    /// Read-only on purpose: the id was derived from this value, and letting the two drift apart would leave
    /// the item addressed by something it no longer holds. Replace the item to change the value.
    /// </remarks>
    [RecursiveMember(false)]
    public T Value { get; } = value;

    public override string ToString()
        => Id;
}
