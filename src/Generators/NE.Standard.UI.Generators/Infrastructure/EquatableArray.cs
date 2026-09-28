using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// An immutable array compared element by element, so a pipeline model holding one stays equal across compilations and
/// the incremental driver can cache what follows it.
/// </summary>
internal readonly struct EquatableArray<T>(ImmutableArray<T> items) : IEquatable<EquatableArray<T>>, IEnumerable<T>
    where T : IEquatable<T>
{
    public static EquatableArray<T> Empty { get; } = new([]);

    public int Count
        => Items.Length;

    public T this[int index]
        => Items[index];

    // A default instance reads as empty rather than throwing.
    private ImmutableArray<T> Items
        => items.IsDefault ? [] : items;

    public bool Equals(EquatableArray<T> other)
    {
        ImmutableArray<T> items = Items;
        ImmutableArray<T> otherItems = other.Items;

        if (items.Length != otherItems.Length)
            return false;

        for (var i = 0; i < items.Length; i++)
        {
            if (!EqualityComparer<T>.Default.Equals(items[i], otherItems[i]))
                return false;
        }

        return true;
    }

    public override bool Equals(object? obj)
        => obj is EquatableArray<T> other && Equals(other);

    public override int GetHashCode()
    {
        var hash = 17;

        foreach (T item in Items)
            hash = unchecked((hash * 31) + (item?.GetHashCode() ?? 0));

        return hash;
    }

    public ImmutableArray<T>.Enumerator GetEnumerator()
        => Items.GetEnumerator();

    IEnumerator<T> IEnumerable<T>.GetEnumerator()
        => ((IEnumerable<T>)Items).GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator()
        => ((IEnumerable<T>)Items).GetEnumerator();

    public static bool operator ==(EquatableArray<T> left, EquatableArray<T> right)
        => left.Equals(right);

    public static bool operator !=(EquatableArray<T> left, EquatableArray<T> right)
        => !left.Equals(right);
}

internal static class EquatableArray
{
    public static EquatableArray<T> ToEquatableArray<T>(this IEnumerable<T> items)
        where T : IEquatable<T>
        => new([.. items]);
}
