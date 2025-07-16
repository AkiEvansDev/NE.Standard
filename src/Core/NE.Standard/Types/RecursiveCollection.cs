using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace NE.Standard.Types
{
    /// <summary>
    /// A recursively observable, thread-safe collection that tracks deep changes in items of type <typeparamref name="T"/>.
    /// Implements <see cref="IList{T}"/>, <see cref="INotifyCollectionChanged"/>.
    /// </summary>
    public class RecursiveCollection<T> : RecursiveObservable, IList<T>, INotifyCollectionChanged
        where T : RecursiveObservable
    {
        private readonly List<T> _items = new List<T>();
        private readonly object _sync = new object();

        public event NotifyCollectionChangedEventHandler? CollectionChanged;

        public int Count
        {
            get { lock (_sync) return _items.Count; }
        }

        public bool IsReadOnly => false;

        public T this[int index]
        {
            get { lock (_sync) return _items[index]; }
            set
            {
                lock (_sync)
                {
                    var old = _items[index];

                    if (!ReferenceEquals(old, value))
                    {
                        old?.ResetNotifier();
                        _items[index] = value;
                        value.SetNotifier(Notify, $"[{index}]");

                        RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                            NotifyCollectionChangedAction.Replace,
                            value,
                            old,
                            index
                        ));

                        Notify(new RecursiveChangedEventArgs(
                            RecursiveChangedAction.Replace,
                            $"[{index}]", index
                        ));
                    }
                }
            }
        }

        /// <inheritdoc />
        public void Add(T item)
        {
            lock (_sync)
            {
                var index = _items.Count;
                _items.Add(item);
                item?.SetNotifier(Notify, $"[{index}]");

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Add,
                    item,
                    index
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Add,
                    $"[{index}]", index, 1
                ));
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <summary>
        /// Adds a range of items to the end of the collection and raises appropriate notifications.
        /// </summary>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="collection"/> is null.</exception>
        public void AddRange(IEnumerable<T> collection)
        {
            if (collection == null) throw new ArgumentNullException(nameof(collection));

            lock (_sync)
            {
                var startIndex = _items.Count;
                var itemsToAdd = collection.ToList();
                if (itemsToAdd.Count == 0) return;

                var visited = new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);
                foreach (var item in itemsToAdd)
                {
                    _items.Add(item);
                    item.SetNotifier(Notify, $"[{_items.Count - 1}]", visited);
                }

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Add,
                    itemsToAdd,
                    startIndex
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Add,
                    $"[{startIndex}]",
                    startIndex,
                    itemsToAdd.Count
                ));
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <inheritdoc />
        public void Insert(int index, T item)
        {
            lock (_sync)
            {
                _items.Insert(index, item);
                UpdateIndices(index);

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Add,
                    item,
                    index
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Add,
                    $"[{index}]", index, 1
                ));
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <inheritdoc />
        public bool Remove(T item)
        {
            lock (_sync)
            {
                var index = _items.IndexOf(item);
                if (index < 0) return false;

                item?.ResetNotifier();
                _items.RemoveAt(index);
                UpdateIndices(index);

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Remove,
                    item,
                    index
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Remove,
                    $"[{index}]", index, 1
                ));
            }

            OnPropertyChanged(nameof(Count));
            return true;
        }

        /// <inheritdoc />
        public void RemoveAt(int index)
        {
            lock (_sync)
            {
                var item = _items[index];
                item?.ResetNotifier();
                _items.RemoveAt(index);
                UpdateIndices(index);

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Remove,
                    item,
                    index
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Remove,
                    $"[{index}]", index, 1
                ));
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <summary>
        /// Removes a range of items from the collection starting at the specified index.
        /// </summary>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if <paramref name="index"/> or <paramref name="count"/> is invalid.</exception>
        public void RemoveRange(int index, int count)
        {
            if (index < 0 || count < 0 || index + count > _items.Count)
                throw new ArgumentOutOfRangeException();

            lock (_sync)
            {
                var removed = _items.GetRange(index, count);

                var visited = new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);
                foreach (var item in removed)
                    item.ResetNotifier(visited);

                _items.RemoveRange(index, count);

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(
                    NotifyCollectionChangedAction.Remove,
                    removed,
                    index
                ));

                Notify(new RecursiveChangedEventArgs(
                    RecursiveChangedAction.Remove,
                    $"[{index}]",
                    index,
                    count
                ));

                UpdateIndices(index);
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <inheritdoc />
        public void Clear()
        {
            lock (_sync)
            {
                var visited = new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);
                foreach (var item in _items)
                    item.ResetNotifier(visited);

                _items.Clear();

                RaiseCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
                Notify(new RecursiveChangedEventArgs(RecursiveChangedAction.Reset, ""));
            }

            OnPropertyChanged(nameof(Count));
        }

        /// <inheritdoc />
        public bool Contains(T item) => _items.Contains(item);

        /// <inheritdoc />
        public int IndexOf(T item) => _items.IndexOf(item);

        /// <inheritdoc />
        public void CopyTo(T[] array, int arrayIndex)
        {
            lock (_sync) _items.CopyTo(array, arrayIndex);
        }

        /// <inheritdoc />
        public IEnumerator<T> GetEnumerator()
        {
            lock (_sync) return _items.ToList().GetEnumerator();
        }

        /// <inheritdoc />
        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        protected internal override void ResetNotifier(HashSet<RecursiveObservable>? visited = null)
        {
            visited ??= new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);

            base.ResetNotifier(visited);

            foreach (var item in _items)
                item.ResetNotifier(visited);
        }

        protected internal override void SetNotifier(Action<RecursiveChangedEventArgs> notify, string? prefix = null, HashSet<RecursiveObservable>? visited = null)
        {
            visited ??= new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);

            base.SetNotifier(notify, prefix, visited);

            for (var i = 0; i < _items.Count; i++)
                _items[i].SetNotifier(notify, BuildPath($"[{i}]"), visited);
        }

        /// <inheritdoc />
        public override object? GetValue(string path)
        {
            if (path.StartsWith('['))
            {
                SplitPath(path, out var head, out var tail);

                if (int.TryParse(head.Trim('[', ']'), out var index))
                {
                    lock (_sync)
                    {
                        if (index >= 0 && index < _items.Count)
                        {
                            var item = _items[index];
                            return tail == null ? item : item.GetValue(tail);
                        }
                    }

                    throw new IndexOutOfRangeException($"Index {index} is out of range.");
                }
            }

            return base.GetValue(path);
        }

        /// <inheritdoc />
        public override void SetValue(string path, object? value)
        {
            if (path.StartsWith('['))
            {
                SplitPath(path, out var head, out var tail);

                if (int.TryParse(head.Trim('[', ']'), out var index))
                {
                    lock (_sync)
                    {
                        if (index >= 0 && index < _items.Count)
                        {
                            var item = _items[index];
                            if (tail == null)
                                this[index] = (T)value!;
                            else
                                item.SetValue(tail, value);
                            return;
                        }
                    }

                    throw new IndexOutOfRangeException($"Index {index} is out of range.");
                }
            }

            base.SetValue(path, value);
        }

        private void UpdateIndices(int start = 0)
        {
            var visited = new HashSet<RecursiveObservable>(ReferenceComparer<RecursiveObservable>.Instance);

            for (var i = start; i < _items.Count; i++)
                _items[i].SetNotifier(Notify, $"[{i}]", visited);
        }

        private void RaiseCollectionChanged(NotifyCollectionChangedEventArgs args)
        {
            CollectionChanged?.Invoke(this, args);
        }
    }
}
