namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// A recursive collection read without its item type: how many items it holds, and where an item stands, answered from the
/// collection's own index of its items.
/// </summary>
public interface IRecursiveCollection
{
    /// <summary>Gets the number of items in the collection.</summary>
    int Count { get; }

    /// <summary>
    /// Gets the place of <paramref name="item"/> in the collection, or -1 where the collection does not hold that very instance.
    /// </summary>
    int IndexOf(object item);
}
