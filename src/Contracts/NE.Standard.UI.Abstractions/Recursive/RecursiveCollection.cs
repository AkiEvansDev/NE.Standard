using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents an observable recursive collection whose item changes are forwarded as collection path changes.
/// </summary>
public class RecursiveCollection<T> : RecursiveObservable, IList<T>
    where T : RecursiveObservable
{
    private sealed class ItemForwarder(RecursiveCollection<T> owner, T item)
    {
        private readonly RecursiveCollection<T> _owner = owner;
        private readonly T _item = item;

        public void Notify(RecursiveChange change)
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

            T oldItem;
            ItemForwarder forwarder;
            RecursiveChange change;

            lock (_sync)
            {
                oldItem = _items[index];

                if (ReferenceEquals(oldItem, value))
                    return;

                EnsureItemCanBeAttachedNoLock(value, replacingIndex: index);
                EnsureIdCanBeAttachedNoLock(value, replacingItem: oldItem);

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

            value.AttachOwner(this);
            value.SetNotifier(forwarder.Notify);

            Notify(change);
        }
    }

    private void EnsureItemCanBeAttachedNoLock(T item, int replacingIndex = -1)
    {
        if (!_indicesByItem.TryGetValue(item, out var existingIndex))
            return;

        if (existingIndex == replacingIndex)
            return;

        throw new InvalidOperationException("The same recursive node instance cannot appear more than once in the same collection.");
    }

    private void EnsureIdCanBeAttachedNoLock(T item, T? replacingItem = null)
    {
        if (_itemsById is null)
            return;

        var id = GetItemId(item);

        if (_itemsById.TryGetValue(id, out T? existing) && !ReferenceEquals(existing, replacingItem))
            throw new InvalidOperationException($"Duplicate recursive item id '{id}'.");
    }

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
    {
        ArgumentNullException.ThrowIfNull(item);

        int index;
        ItemForwarder forwarder;
        RecursiveChange change;

        lock (_sync)
        {
            EnsureItemCanBeAttachedNoLock(item);
            EnsureIdCanBeAttachedNoLock(item);

            index = _items.Count;

            _items.Add(item);
            AddMapsNoLock(item, index);

            forwarder = GetOrCreateForwarderNoLock(item);
            change = RecursiveChange.Add(RecursivePath.Empty, index, count: 1, GetItemIdsNoLock(index, count: 1));
        }

        item.AttachOwner(this);
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
    {
        ArgumentNullException.ThrowIfNull(items);

        T[] buffer = items as T[] ?? [.. items];

        if (buffer.Length == 0)
            return;

        HashSet<T> uniqueItems = new(ReferenceEqualityComparer.Instance);
        HashSet<string>? uniqueIds = _itemsById is null ? null : new(StringComparer.Ordinal);

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
            for (var i = 0; i < buffer.Length; i++)
            {
                EnsureItemCanBeAttachedNoLock(buffer[i]);
                EnsureIdCanBeAttachedNoLock(buffer[i]);
            }

            startIndex = _items.Count;
            forwarders = new ItemForwarder[buffer.Length];

            for (var i = 0; i < buffer.Length; i++)
            {
                T item = buffer[i];
                var index = startIndex + i;

                _items.Add(item);
                AddMapsNoLock(item, index);

                forwarders[i] = GetOrCreateForwarderNoLock(item);
            }

            change = RecursiveChange.Add(RecursivePath.Empty, startIndex, buffer.Length, GetItemIdsNoLock(startIndex, buffer.Length));
        }

        for (var i = 0; i < buffer.Length; i++)
        {
            T item = buffer[i];

            item.AttachOwner(this);
            item.SetNotifier(forwarders[i].Notify);
        }

        Notify(change);
        NotifyCountChanged();
    }

    private static string GetItemId(T item)
    {
        if (item is not IBindableItem bindableItem)
            throw new InvalidOperationException($"Item type '{typeof(T).Name}' does not support key lookup.");

        // Names the item type and the way out: a missing id surfaces deep inside Add, where nothing in the
        // message would otherwise point at the model the author forgot to give an id to.
        return string.IsNullOrWhiteSpace(bindableItem.Id)
            ? throw new InvalidOperationException(
                $"Item of type '{item.GetType().Name}' has no id. Every item in a recursive collection needs a stable " +
                $"'{nameof(IBindableItem)}.{nameof(IBindableItem.Id)}' set at construction — wrap a plain value in " +
                "'UIValueItem<T>' or 'UIOptionValue<T>' when the value itself is the identity.")
            : bindableItem.Id;
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

        for (var i = 0; i < removedItems.Length; i++)
        {
            removedItems[i].DetachOwner(this);
            removedItems[i].ResetNotifier();
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
    public void Insert(int index, T item)
    {
        ArgumentNullException.ThrowIfNull(item);

        ItemForwarder forwarder;
        RecursiveChange change;

        lock (_sync)
        {
            EnsureItemCanBeAttachedNoLock(item);
            EnsureIdCanBeAttachedNoLock(item);

            _items.Insert(index, item);

            ReindexRangeNoLock(index);
            AddIdNoLock(item);

            forwarder = GetOrCreateForwarderNoLock(item);
            change = RecursiveChange.Add(RecursivePath.Empty, index, count: 1, GetItemIdsNoLock(index, count: 1));
        }

        item.AttachOwner(this);
        item.SetNotifier(forwarder.Notify);

        Notify(change);
        NotifyCountChanged();
    }

    private void ReindexRangeNoLock(int startIndex)
    {
        for (var i = startIndex; i < _items.Count; i++)
            _indicesByItem[_items[i]] = i;
    }

    /// <inheritdoc />
    public bool Remove(T item)
    {
        ArgumentNullException.ThrowIfNull(item);

        RecursiveChange change;

        lock (_sync)
        {
            if (!_indicesByItem.TryGetValue(item, out var removedIndex))
                return false;

            var oldItemIds = GetItemIdsNoLock(removedIndex, count: 1);

            _items.RemoveAt(removedIndex);

            RemoveMapsNoLock(item);
            ReindexRangeNoLock(removedIndex);

            change = RecursiveChange.Remove(RecursivePath.Empty, removedIndex, count: 1, oldItemIds);
        }

        item.DetachOwner(this);
        item.ResetNotifier();

        Notify(change);
        NotifyCountChanged();

        return true;
    }

    /// <inheritdoc />
    public void RemoveAt(int index)
    {
        T removedItem;
        RecursiveChange change;

        lock (_sync)
        {
            removedItem = _items[index];

            var oldItemIds = GetItemIdsNoLock(index, count: 1);

            _items.RemoveAt(index);

            RemoveMapsNoLock(removedItem);
            ReindexRangeNoLock(index);

            change = RecursiveChange.Remove(RecursivePath.Empty, index, count: 1, oldItemIds);
        }

        removedItem.DetachOwner(this);
        removedItem.ResetNotifier();

        Notify(change);
        NotifyCountChanged();
    }

    /// <summary>
    /// Removes a contiguous range of items and emits a single collection remove change.
    /// </summary>
    public void RemoveRange(int index, int count)
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

            change = RecursiveChange.Remove(RecursivePath.Empty, index, count, oldItemIds);
        }

        for (var i = 0; i < removedItems.Length; i++)
        {
            removedItems[i].DetachOwner(this);
            removedItems[i].ResetNotifier();
        }

        Notify(change);
        NotifyCountChanged();
    }

    /// <summary>
    /// Moves an item and emits a collection move change.
    /// </summary>
    public void Move(int oldIndex, int newIndex)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(oldIndex);
        ArgumentOutOfRangeException.ThrowIfNegative(newIndex);

        T movedItem;
        RecursiveChange change;

        lock (_sync)
        {
            ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(oldIndex, _items.Count);
            ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(newIndex, _items.Count);

            if (oldIndex == newIndex)
                return;

            movedItem = _items[oldIndex];
            var itemIds = GetItemIdsNoLock(oldIndex, count: 1);

            _items.RemoveAt(oldIndex);
            _items.Insert(newIndex, movedItem);

            ReindexRangeNoLock(Math.Min(oldIndex, newIndex));

            change = RecursiveChange.Move(RecursivePath.Empty, oldIndex, newIndex, count: 1, itemIds);
        }

        Notify(change);
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

            item.AttachOwner(this);
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

        if (TryGetItemBySegment(segments[offset], out T? item, out _))
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

    private bool TryGetItemBySegment(PathSegment segment, out T? item, out int index)
    {
        if (segment.Kind == PathSegmentKind.Index)
        {
            lock (_sync)
            {
                index = segment.Index;

                if ((uint)index >= (uint)_items.Count)
                {
                    item = null;
                    index = -1;
                    return false;
                }

                item = _items[index];
                return true;
            }
        }

        if (segment.Kind == PathSegmentKind.Key)
        {
            Dictionary<string, T>? map = _itemsById;

            if (map is null)
            {
                item = null;
                index = -1;
                return false;
            }

            lock (_sync)
            {
                if (!map.TryGetValue(segment.Key, out item))
                {
                    index = -1;
                    return false;
                }

                index = _indicesByItem[item];
                return true;
            }
        }

        item = null;
        index = -1;
        return false;
    }

    /// <inheritdoc />
    protected internal override bool TrySetValueCore(ReadOnlySpan<PathSegment> segments, int offset, object? value)
    {
        if (offset >= segments.Length)
            return false;

        if (IsCollectionSegment(segments[offset]))
        {
            if (!TryGetItemBySegment(segments[offset], out T? item, out var index))
                return false;

            if (offset == segments.Length - 1)
            {
                if (value is not T typedValue)
                    return false;

                this[index] = typedValue;
                return true;
            }

            return item!.TrySetValueCore(segments, offset + 1, value);
        }

        return base.TrySetValueCore(segments, offset, value);
    }

    private static bool IsCollectionSegment(PathSegment segment)
        => segment.Kind is PathSegmentKind.Index or PathSegmentKind.Key;
}
