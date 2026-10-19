using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents an observable recursive collection whose item changes are forwarded as collection path changes.
/// </summary>
public class RecursiveCollection<T> : RecursiveObservable, IList<T>, IRecursiveCollection
    where T : RecursiveObservable
{
    private sealed class ItemForwarder
    {
        private readonly RecursiveCollection<T> _owner;
        private readonly T _item;

        public ItemForwarder(RecursiveCollection<T> owner, T item)
        {
            _owner = owner;
            _item = item;
            Notify = Forward;
        }

        /// <summary>The callback the item is handed, made once so a re-propagation allocates no delegate.</summary>
        public Action<RecursiveChange> Notify { get; }

        private void Forward(RecursiveChange change)
            => _owner.ForwardItemNotify(_item, change);
    }

    private static readonly bool SupportsKeyLookup = typeof(IBindableItem).IsAssignableFrom(typeof(T));
    private static readonly PathSegment CountSegment = PathSegment.ForProperty(nameof(Count));

    private readonly Lock _sync = new();
    private readonly List<T> _items = [];
    private readonly Dictionary<T, int> _indicesByItem = new(ReferenceEqualityComparer.Instance);
    private readonly Dictionary<T, ItemForwarder> _forwardersByItem = new(ReferenceEqualityComparer.Instance);
    private readonly Dictionary<string, T>? _itemsById = SupportsKeyLookup
        ? new Dictionary<string, T>(StringComparer.Ordinal)
        : null;

    /// <summary>
    /// Gets the number of items in the collection.
    /// </summary>
    [RecursiveMember(false)]
    public int Count
    {
        get
        {
            lock (_sync)
                return _items.Count;
        }
    }

    /// <inheritdoc />
    public bool IsReadOnly => false;

    /// <summary>
    /// Gets or sets the item at the specified index, notifying observers of the replacement.
    /// </summary>
    public T this[int index]
    {
        get
        {
            lock (_sync)
                return _items[index];
        }
        set
        {
            ArgumentNullException.ThrowIfNull(value);

            if (!TryReplace(PathSegment.AtIndex(index), value))
                throw new ArgumentOutOfRangeException(nameof(index), index, "Index was out of range.");
        }
    }

    /// <summary>
    /// Replaces the item a segment names, found under the same lock that replaces it: resolved first and replaced after, a keyed
    /// set racing a removal would land on whichever item moved into that index.
    /// </summary>
    private bool TryReplace(PathSegment segment, T value)
    {
        T oldItem;
        ItemForwarder forwarder;
        RecursiveChange change;

        lock (_sync)
        {
            if (!TryGetIndexNoLock(segment, out var index))
                return false;

            oldItem = _items[index];

            if (ReferenceEquals(oldItem, value))
                return true;

            EnsureItemCanBeAttachedNoLock(value, replacingIndex: index);
            EnsureIdCanBeAttachedNoLock(value, replacingItem: oldItem);
            value.EnsureCanAttach(this, this);

            var oldItemIds = GetItemIdsNoLock(index, count: 1);

            RemoveMapsNoLock(oldItem);

            _items[index] = value;

            AddMapsNoLock(value, index);

            var itemIds = GetItemIdsNoLock(index, count: 1);

            forwarder = GetOrCreateForwarderNoLock(value);
            change = RecursiveChange.Replace(RecursivePath.Empty, index, count: 1, oldItemIds, itemIds);
        }

        oldItem.DetachOwner(this);
        oldItem.ResetNotifier();

        value.AttachOwner(this, this);
        value.SetNotifier(forwarder.Notify);

        Notify(change);
        return true;
    }

    private bool TryGetIndexNoLock(PathSegment segment, out int index)
    {
        if (segment.Kind == PathSegmentKind.Index && (uint)segment.Index < (uint)_items.Count)
        {
            index = segment.Index;
            return true;
        }

        if (segment.Kind == PathSegmentKind.Key && _itemsById is not null && _itemsById.TryGetValue(segment.Key, out T? item))
        {
            index = _indicesByItem[item];
            return true;
        }

        index = -1;
        return false;
    }

    private void EnsureItemCanBeAttachedNoLock(T item, int replacingIndex = -1)
    {
        if (!_indicesByItem.TryGetValue(item, out var existingIndex))
            return;

        if (existingIndex == replacingIndex)
            return;

        throw new InvalidOperationException("The same recursive node instance cannot appear more than once in the same collection.");
    }

    /// <summary>Every check an incoming item must pass, run before the collection changes so a refused item leaves it as it was.</summary>
    private void EnsureCanAddNoLock(T item)
    {
        EnsureItemCanBeAttachedNoLock(item);
        EnsureIdCanBeAttachedNoLock(item);
        item.EnsureCanAttach(this, this);
    }

    private void EnsureIdCanBeAttachedNoLock(T item, T? replacingItem = null)
    {
        if (_itemsById is null)
            return;

        var id = GetItemId(item);

        if (_itemsById.TryGetValue(id, out T? existing) && !ReferenceEquals(existing, replacingItem))
            throw new InvalidOperationException($"Duplicate recursive item id '{id}'.");
    }

    private static string GetItemId(T item)
    {
        if (item is not IBindableItem bindableItem)
            throw NoKeyLookupException();

        // Names the type so a missing id points back to the model, not just to wherever inside Add it surfaced.
        return string.IsNullOrWhiteSpace(bindableItem.Id)
            ? throw new InvalidOperationException(
                $"Item of type '{item.GetType().Name}' has no id. Every item in a recursive collection needs a stable " +
                $"'{nameof(IBindableItem)}.{nameof(IBindableItem.Id)}' set at construction — wrap a plain value in " +
                "'UIValueItem<T>' or 'UIOptionValue<T>' when the value itself is the identity.")
            : bindableItem.Id;
    }

    private static InvalidOperationException NoKeyLookupException()
        => new($"Item type '{typeof(T).Name}' does not support key lookup.");

    private string[] GetItemIdsNoLock(int index, int count)
    {
        if (_itemsById is null)
            return [];

        var result = new string[count];

        for (var i = 0; i < count; i++)
            result[i] = GetItemId(_items[index + i]);

        return result;
    }

    private void RemoveMapsNoLock(T item)
    {
        _ = _indicesByItem.Remove(item);
        _ = _itemsById?.Remove(GetItemId(item));
        _ = _forwardersByItem.Remove(item);
    }

    private void AddMapsNoLock(T item, int index)
    {
        _indicesByItem.Add(item, index);
        AddIdNoLock(item);
    }

    private void AddIdNoLock(T item)
        => _itemsById?.Add(GetItemId(item), item);

    private ItemForwarder GetOrCreateForwarderNoLock(T item)
    {
        if (_forwardersByItem.TryGetValue(item, out ItemForwarder? forwarder))
            return forwarder;

        forwarder = new ItemForwarder(this, item);
        _forwardersByItem.Add(item, forwarder);

        return forwarder;
    }

    private void ForwardItemNotify(T item, RecursiveChange change)
    {
        PathSegment segment;

        lock (_sync)
        {
            if (!_indicesByItem.TryGetValue(item, out var index))
                return;

            segment = _itemsById is null
                ? PathSegment.AtIndex(index)
                : PathSegment.WithKey(GetItemId(item));
        }

        Notify(change.Prepend(segment));
    }

    /// <inheritdoc />
    public void Add(T item)
        => InsertCore(index: null, item);

    /// <summary>Inserts one item at <paramref name="index"/>, or at the end when it is null.</summary>
    private void InsertCore(int? index, T item)
    {
        ArgumentNullException.ThrowIfNull(item);

        int at;
        ItemForwarder forwarder;
        RecursiveChange change;

        lock (_sync)
        {
            EnsureCanAddNoLock(item);

            at = index ?? _items.Count;

            _items.Insert(at, item);

            ReindexRangeNoLock(at);
            AddIdNoLock(item);

            forwarder = GetOrCreateForwarderNoLock(item);
            change = RecursiveChange.Add(RecursivePath.Empty, at, count: 1, GetItemIdsNoLock(at, count: 1));
        }

        item.AttachOwner(this, this);
        item.SetNotifier(forwarder.Notify);

        Notify(change);
        NotifyCountChanged();
    }

    private void NotifyCountChanged()
        => Notify(RecursiveChange.Set(RecursivePath.Empty.Append(CountSegment)));

    /// <summary>
    /// Adds multiple items and emits a single collection add change.
    /// </summary>
    public void AddRange(IEnumerable<T> items)
        => InsertRangeCore(index: null, items);

    /// <summary>
    /// Inserts multiple items at <paramref name="index"/> and emits a single collection add change.
    /// </summary>
    public void InsertRange(int index, IEnumerable<T> items)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(index);

        InsertRangeCore(index, items);
    }

    /// <summary>Inserts a range at <paramref name="index"/>, or at the end when it is null.</summary>
    private void InsertRangeCore(int? index, IEnumerable<T> items)
    {
        ArgumentNullException.ThrowIfNull(items);

        T[] buffer = items as T[] ?? [.. items];

        HashSet<T> uniqueItems = new(buffer.Length, ReferenceEqualityComparer.Instance);
        HashSet<string>? uniqueIds = _itemsById is null ? null : new(buffer.Length, StringComparer.Ordinal);

        for (var i = 0; i < buffer.Length; i++)
        {
            T item = buffer[i];

            ArgumentNullException.ThrowIfNull(item);

            if (!uniqueItems.Add(item))
                throw new InvalidOperationException("The same recursive node instance cannot appear more than once in the same added range.");

            if (uniqueIds is not null && !uniqueIds.Add(GetItemId(item)))
                throw new InvalidOperationException("The same recursive item id cannot appear more than once in the same added range.");
        }

        int startIndex;
        ItemForwarder[] forwarders;
        RecursiveChange change;

        lock (_sync)
        {
            startIndex = index ?? _items.Count;

            ArgumentOutOfRangeException.ThrowIfGreaterThan(startIndex, _items.Count, nameof(index));

            if (buffer.Length == 0)
                return;

            for (var i = 0; i < buffer.Length; i++)
                EnsureCanAddNoLock(buffer[i]);

            forwarders = new ItemForwarder[buffer.Length];

            _items.InsertRange(startIndex, buffer);
            ReindexRangeNoLock(startIndex);

            for (var i = 0; i < buffer.Length; i++)
            {
                AddIdNoLock(buffer[i]);
                forwarders[i] = GetOrCreateForwarderNoLock(buffer[i]);
            }

            change = RecursiveChange.Add(RecursivePath.Empty, startIndex, buffer.Length, GetItemIdsNoLock(startIndex, buffer.Length));
        }

        // One visited set for the range rather than one per item: a node belongs to a single owner, so no item's subtree reaches another's.
        HashSet<RecursiveObservable> visited = new(buffer.Length, ReferenceEqualityComparer.Instance);

        for (var i = 0; i < buffer.Length; i++)
        {
            T item = buffer[i];

            item.AttachOwner(this, this);
            item.SetNotifier(forwarders[i].Notify, visited);
        }

        Notify(change);
        NotifyCountChanged();
    }

    private void ReindexRangeNoLock(int startIndex)
        => ReindexRangeNoLock(startIndex, _items.Count - 1);

    /// <summary>Writes the index of every item from <paramref name="startIndex"/> to <paramref name="endIndex"/>, both included.</summary>
    private void ReindexRangeNoLock(int startIndex, int endIndex)
    {
        for (var i = startIndex; i <= endIndex; i++)
            _indicesByItem[_items[i]] = i;
    }

    /// <inheritdoc />
    public void Clear()
    {
        T[] removedItems;
        RecursiveChange change;

        lock (_sync)
        {
            if (_items.Count == 0)
                return;

            removedItems = [.. _items];

            _items.Clear();
            _indicesByItem.Clear();
            _itemsById?.Clear();
            _forwardersByItem.Clear();

            change = RecursiveChange.Reset(RecursivePath.Empty);
        }

        HashSet<RecursiveObservable> visited = new(removedItems.Length, ReferenceEqualityComparer.Instance);

        for (var i = 0; i < removedItems.Length; i++)
        {
            removedItems[i].DetachOwner(this);
            removedItems[i].ResetNotifier(visited);
        }

        Notify(change);
        NotifyCountChanged();
    }

    /// <inheritdoc />
    public bool Contains(T item)
    {
        lock (_sync)
            return _indicesByItem.ContainsKey(item);
    }

    /// <inheritdoc />
    public void CopyTo(T[] array, int arrayIndex)
    {
        lock (_sync)
            _items.CopyTo(array, arrayIndex);
    }

    /// <inheritdoc />
    public int IndexOf(T item)
    {
        lock (_sync)
            return _indicesByItem.TryGetValue(item, out var index) ? index : -1;
    }

    /// <inheritdoc />
    int IRecursiveCollection.IndexOf(object item)
        => item is T typed ? IndexOf(typed) : -1;

    /// <summary>
    /// Gets the item held under <paramref name="key"/>, from the collection's own index by key.
    /// </summary>
    /// <exception cref="InvalidOperationException">The item type has no key: it is not an <see cref="IBindableItem"/>.</exception>
    public bool TryGet(string key, [NotNullWhen(true)] out T? item)
    {
        ArgumentNullException.ThrowIfNull(key);

        Dictionary<string, T> itemsById = KeyIndex;

        lock (_sync)
            return itemsById.TryGetValue(key, out item);
    }

    /// <summary>The index by key; refused for an item type that has none, where a key would silently find nothing.</summary>
    private Dictionary<string, T> KeyIndex
        => _itemsById ?? throw NoKeyLookupException();

    /// <inheritdoc />
    public void Insert(int index, T item)
        => InsertCore(index, item);

    /// <inheritdoc />
    public bool Remove(T item)
    {
        ArgumentNullException.ThrowIfNull(item);

        RecursiveChange change;

        lock (_sync)
        {
            if (!_indicesByItem.TryGetValue(item, out var removedIndex))
                return false;

            change = RemoveAtNoLock(removedIndex);
        }

        NotifyRemoved(item, change);

        return true;
    }

    /// <summary>
    /// Removes the item held under <paramref name="key"/>, found by the collection's own index by key, returning whether it was there.
    /// </summary>
    /// <exception cref="InvalidOperationException">The item type has no key: it is not an <see cref="IBindableItem"/>.</exception>
    public bool Remove(string key)
    {
        ArgumentNullException.ThrowIfNull(key);

        Dictionary<string, T> itemsById = KeyIndex;
        T? removedItem;
        RecursiveChange change;

        lock (_sync)
        {
            if (!itemsById.TryGetValue(key, out removedItem))
                return false;

            change = RemoveAtNoLock(_indicesByItem[removedItem]);
        }

        NotifyRemoved(removedItem, change);

        return true;
    }

    /// <summary>Takes the item at <paramref name="index"/> out of the list and its maps; the caller holds the lock.</summary>
    private RecursiveChange RemoveAtNoLock(int index)
    {
        T removedItem = _items[index];
        var oldItemIds = GetItemIdsNoLock(index, count: 1);

        _items.RemoveAt(index);

        RemoveMapsNoLock(removedItem);
        ReindexRangeNoLock(index);

        return RecursiveChange.Remove(RecursivePath.Empty, index, count: 1, oldItemIds);
    }

    /// <summary>Releases a removed item and tells the listeners, outside the lock.</summary>
    private void NotifyRemoved(T removedItem, RecursiveChange change)
    {
        removedItem.DetachOwner(this);
        removedItem.ResetNotifier();

        Notify(change);
        NotifyCountChanged();
    }

    /// <inheritdoc />
    public void RemoveAt(int index)
    {
        T removedItem;
        RecursiveChange change;

        lock (_sync)
        {
            removedItem = _items[index];
            change = RemoveAtNoLock(index);
        }

        NotifyRemoved(removedItem, change);
    }

    /// <summary>
    /// Removes a contiguous range of items and emits a single collection remove change.
    /// </summary>
    public void RemoveRange(int index, int count)
        => RemoveRangeCore(index, count, trimmed: false);

    /// <summary>
    /// Removes a contiguous range of items that still exist where the collection reads them from — a window's far side trimmed — and
    /// emits a single remove change marked <see cref="RecursiveChange.Trimmed"/>.
    /// </summary>
    public void TrimRange(int index, int count)
        => RemoveRangeCore(index, count, trimmed: true);

    private void RemoveRangeCore(int index, int count, bool trimmed)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(index);
        ArgumentOutOfRangeException.ThrowIfNegative(count);

        if (count == 0)
            return;

        T[] removedItems;
        RecursiveChange change;

        lock (_sync)
        {
            ArgumentOutOfRangeException.ThrowIfGreaterThan(index, _items.Count);
            ArgumentOutOfRangeException.ThrowIfGreaterThan(count, _items.Count - index);

            removedItems = [.. _items.GetRange(index, count)];
            var oldItemIds = GetItemIdsNoLock(index, count);

            _items.RemoveRange(index, count);

            for (var i = 0; i < removedItems.Length; i++)
                RemoveMapsNoLock(removedItems[i]);

            ReindexRangeNoLock(index);

            change = trimmed
                ? RecursiveChange.Trim(RecursivePath.Empty, index, count, oldItemIds)
                : RecursiveChange.Remove(RecursivePath.Empty, index, count, oldItemIds);
        }

        ReleaseRemoved(removedItems);

        Notify(change);
        NotifyCountChanged();
    }

    /// <summary>Lets go of items taken out of the list, outside the lock.</summary>
    private void ReleaseRemoved(T[] removedItems)
    {
        for (var i = 0; i < removedItems.Length; i++)
        {
            removedItems[i].DetachOwner(this);
            removedItems[i].ResetNotifier();
        }
    }

    /// <summary>
    /// Removes every item <paramref name="match"/> picks, in one pass and one reindex, and emits one remove change per run of
    /// neighbouring items it took, in order; answers how many went.
    /// </summary>
    /// <remarks>
    /// <paramref name="match"/> runs under the collection's lock on every item before anything changes: it must not change the
    /// collection, and one that throws leaves it as it was. Runs rather than a reset: a reset reads as emptied, and runs let the page
    /// keep every row they do not name.
    /// </remarks>
    public int RemoveAll(Predicate<T> match)
    {
        ArgumentNullException.ThrowIfNull(match);

        T[] removedItems;
        RecursiveChange[] changes;

        lock (_sync)
        {
            List<(int Start, int Count)>? runs = null;
            var removed = 0;

            for (var i = 0; i < _items.Count; i++)
            {
                if (!match(_items[i]))
                    continue;

                if (runs is { Count: > 0 } && runs[^1].Start + runs[^1].Count == i)
                    runs[^1] = (runs[^1].Start, runs[^1].Count + 1);
                else
                    (runs ??= []).Add((i, 1));

                removed++;
            }

            if (runs is null)
                return 0;

            removedItems = new T[removed];
            changes = new RecursiveChange[runs.Count];

            var taken = 0;

            for (var r = 0; r < runs.Count; r++)
            {
                (var start, var count) = runs[r];

                // Where the run stands once the runs before it are gone: the changes are replayed in their order.
                changes[r] = RecursiveChange.Remove(RecursivePath.Empty, start - taken, count, GetItemIdsNoLock(start, count));

                for (var i = 0; i < count; i++)
                {
                    removedItems[taken + i] = _items[start + i];
                    RemoveMapsNoLock(_items[start + i]);
                }

                taken += count;
            }

            // The maps no longer hold the removed items, so the ones the list holds that the maps do not are exactly those.
            _ = _items.RemoveAll(item => !_indicesByItem.ContainsKey(item));

            ReindexRangeNoLock(runs[0].Start);
        }

        ReleaseRemoved(removedItems);

        for (var i = 0; i < changes.Length; i++)
            Notify(changes[i]);

        NotifyCountChanged();

        return removedItems.Length;
    }

    /// <summary>
    /// Moves an item and emits a collection move change.
    /// </summary>
    public void Move(int oldIndex, int newIndex)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(oldIndex);
        ArgumentOutOfRangeException.ThrowIfNegative(newIndex);

        RecursiveChange? change;

        lock (_sync)
        {
            ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(oldIndex, _items.Count);
            ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(newIndex, _items.Count);

            change = MoveNoLock(oldIndex, newIndex);
        }

        if (change is not null)
            Notify(change);
    }

    /// <summary>
    /// Moves the item held under <paramref name="key"/> to <paramref name="index"/>, clamped to the collection, and emits a collection
    /// move change; returns whether the collection held it.
    /// </summary>
    /// <remarks>Clamped rather than refused: a drop names the place the reader let go, which a removal meanwhile may have put past the end.</remarks>
    /// <exception cref="InvalidOperationException">The item type has no key: it is not an <see cref="IBindableItem"/>.</exception>
    public bool Move(string key, int index)
    {
        ArgumentNullException.ThrowIfNull(key);

        Dictionary<string, T> itemsById = KeyIndex;
        RecursiveChange? change;

        lock (_sync)
        {
            if (!itemsById.TryGetValue(key, out T? item))
                return false;

            change = MoveNoLock(_indicesByItem[item], Math.Clamp(index, 0, _items.Count - 1));
        }

        if (change is not null)
            Notify(change);

        return true;
    }

    /// <summary>Moves the item at <paramref name="oldIndex"/> to <paramref name="newIndex"/>; null where it already stands there.</summary>
    private RecursiveChange? MoveNoLock(int oldIndex, int newIndex)
    {
        if (oldIndex == newIndex)
            return null;

        T movedItem = _items[oldIndex];
        var itemIds = GetItemIdsNoLock(oldIndex, count: 1);

        _items.RemoveAt(oldIndex);
        _items.Insert(newIndex, movedItem);

        // Only the items between the two places moved; past the farther one each stands where it stood.
        ReindexRangeNoLock(Math.Min(oldIndex, newIndex), Math.Max(oldIndex, newIndex));

        return RecursiveChange.Move(RecursivePath.Empty, oldIndex, newIndex, count: 1, itemIds);
    }

    /// <inheritdoc />
    IEnumerator IEnumerable.GetEnumerator()
        => GetEnumerator();

    /// <inheritdoc />
    public IEnumerator<T> GetEnumerator()
    {
        T[] snapshot = GetSnapshot();

        return ((IEnumerable<T>)snapshot).GetEnumerator();
    }

    private T[] GetSnapshot()
    {
        lock (_sync)
            return [.. _items];
    }

    /// <inheritdoc />
    protected internal override void SetNotifier(Action<RecursiveChange> notify, HashSet<RecursiveObservable>? visited = null)
    {
        base.SetNotifier(notify, visited);

        visited ??= new HashSet<RecursiveObservable>(ReferenceEqualityComparer.Instance);

        T[] snapshot;
        ItemForwarder[] forwarders;

        lock (_sync)
        {
            snapshot = [.. _items];
            forwarders = new ItemForwarder[snapshot.Length];

            for (var i = 0; i < snapshot.Length; i++)
                forwarders[i] = GetOrCreateForwarderNoLock(snapshot[i]);
        }

        for (var i = 0; i < snapshot.Length; i++)
        {
            T item = snapshot[i];

            item.AttachOwner(this, this);
            item.SetNotifier(forwarders[i].Notify, visited);
        }
    }

    /// <inheritdoc />
    protected internal override bool TryGetValueCore(ReadOnlySpan<PathSegment> segments, int offset, out object? value)
    {
        if (offset == segments.Length)
        {
            value = this;
            return true;
        }

        if (TryGetItemBySegment(segments[offset], out T? item))
        {
            if (offset == segments.Length - 1)
            {
                value = item;
                return true;
            }

            return item!.TryGetValueCore(segments, offset + 1, out value);
        }

        if (segments[offset].Kind == PathSegmentKind.Property &&
            string.Equals(segments[offset].Property, nameof(Count), StringComparison.Ordinal))
        {
            if (offset == segments.Length - 1)
            {
                value = Count;
                return true;
            }

            value = null;
            return false;
        }

        return base.TryGetValueCore(segments, offset, out value);
    }

    private bool TryGetItemBySegment(PathSegment segment, out T? item)
    {
        item = null;

        if (!IsCollectionSegment(segment))
            return false;

        lock (_sync)
        {
            if (!TryGetIndexNoLock(segment, out var index))
                return false;

            item = _items[index];
            return true;
        }
    }

    /// <inheritdoc />
    protected internal override bool TrySetValueCore(ReadOnlySpan<PathSegment> segments, int offset, object? value)
    {
        if (offset >= segments.Length)
            return false;

        if (IsCollectionSegment(segments[offset]))
        {
            if (offset == segments.Length - 1)
                return value is T typedValue && TryReplace(segments[offset], typedValue);

            return TryGetItemBySegment(segments[offset], out T? item) && item!.TrySetValueCore(segments, offset + 1, value);
        }

        return base.TrySetValueCore(segments, offset, value);
    }

    private static bool IsCollectionSegment(PathSegment segment)
        => segment.Kind is PathSegmentKind.Index or PathSegmentKind.Key;
}
