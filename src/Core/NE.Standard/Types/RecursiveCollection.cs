using NE.Standard.Extensions;
using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;

namespace NE.Standard.Types
{
    /// <summary>
    /// An observable collection of <see cref="IRecursiveObservable"/> elements that propagates
    /// nested change notifications using index-based paths (e.g. "[0].Property").
    /// </summary>
    /// <typeparam name="T">The type of elements in the collection. Must implement <see cref="IRecursiveObservable"/>.</typeparam>
    public class RecursiveCollection<T> : ObservableCollection<T>, IRecursiveObservable
        where T : IRecursiveObservable
    {
        private WeakAction<RecursiveChangedEventArgs>? _notifier;
        private string _propertyPrefix = "";

        /// <summary>
        /// Sets a recursive change notifier for this collection and all nested items.
        /// </summary>
        /// <param name="notify">The callback to invoke when changes occur in any nested element.</param>
        /// <param name="prefix">
        /// An optional string to prefix to the property path for each change. Useful for tracking nested context.
        /// </param>
        public void SetNotifier(Action<RecursiveChangedEventArgs> notify, string? prefix = null)
        {
            _notifier = new WeakAction<RecursiveChangedEventArgs>(notify);
            _propertyPrefix = prefix.IsNull() ? "" : $"{prefix}.";

            for (var i = 0; i < Count; i++)
            {
                this[i].SetNotifier(NotifyChange, $"[{i}]");
            }
        }

        /// <summary>
        /// Removes the recursive notifier from this collection and all nested elements.
        /// </summary>
        public void ClearNotifier()
        {
            _notifier = null;
            _propertyPrefix = "";

            foreach (var item in this)
                item.ClearNotifier();
        }

        /// <summary>
        /// Handles collection change events (add, remove, replace, move, reset) and automatically
        /// updates nested change tracking and path re-indexing for affected items.
        /// </summary>
        /// <param name="e">The collection change event arguments.</param>
        protected override void OnCollectionChanged(NotifyCollectionChangedEventArgs e)
        {
            base.OnCollectionChanged(e);

            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                    if (e.NewItems != null)
                    {
                        for (int i = 0; i < e.NewItems.Count; i++)
                        {
                            var item = (T)e.NewItems[i]!;
                            int index = e.NewStartingIndex + i;
                            item.SetNotifier(NotifyChange, $"[{index}]");
                        }
                    }
                    break;

                case NotifyCollectionChangedAction.Remove:
                    if (e.OldItems != null)
                    {
                        foreach (T item in e.OldItems)
                            item.ClearNotifier();

                        ResequenceFrom(e.OldStartingIndex);
                    }
                    break;

                case NotifyCollectionChangedAction.Replace:
                    if (e.OldItems != null)
                    {
                        foreach (T item in e.OldItems)
                            item.ClearNotifier();
                    }

                    if (e.NewItems != null)
                    {
                        for (int i = 0; i < e.NewItems.Count; i++)
                        {
                            var item = (T)e.NewItems[i]!;
                            int index = e.NewStartingIndex + i;
                            item.SetNotifier(NotifyChange, $"[{index}]");
                        }
                    }
                    break;

                case NotifyCollectionChangedAction.Move:
                    if (e.OldStartingIndex != e.NewStartingIndex)
                    {
                        ResequenceFrom(Math.Min(e.OldStartingIndex, e.NewStartingIndex));
                    }
                    break;

                case NotifyCollectionChangedAction.Reset:
                    foreach (var item in this)
                    {
                        item.ClearNotifier();
                    }

                    for (int i = 0; i < Count; i++)
                    {
                        this[i].SetNotifier(NotifyChange, $"[{i}]");
                    }
                    break;
            }
        }

        private void ResequenceFrom(int startIndex)
        {
            for (int i = startIndex; i < Count; i++)
            {
                this[i].SetNotifier(NotifyChange, $"[{i}]");
            }
        }

        private void NotifyChange(RecursiveChangedEventArgs e)
        {
            if (_notifier is null)
                return;

            var fullPath = $"{_propertyPrefix}{e.Path}";
            var forwarded = e.Action switch
            {
                RecursiveChangedAction.Set => new RecursiveChangedEventArgs(fullPath, e.Value),
                _ => new RecursiveChangedEventArgs(
                    e.Action,
                    fullPath,
                    e.NewStartingIndex,
                    e.NewItems,
                    e.OldStartingIndex,
                    e.OldItems
                )
            };

            _notifier.Execute(forwarded);
        }
    }
}
