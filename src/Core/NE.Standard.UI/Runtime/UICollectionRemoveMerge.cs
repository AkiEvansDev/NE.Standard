using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Merges the removes a sent change set holds on one list back to back — a controller's <c>Remove</c> per row — into one remove, which
/// the page applies as it applied each. Only on a set about to leave the runtime, as <see cref="UICollectionInsertMerge"/>: the merged
/// set carries no queue numbers.
/// </summary>
internal static class UICollectionRemoveMerge
{
    /// <summary>
    /// The change set with each run of removes on one list as one remove: each right after the one before it, on the same host and
    /// scope, trimmed alike, its keyed rows standing next to the rows the run took — just after them or just before. Every row carries
    /// its place in the list as it stood before the run, as one range's removal does. The same instance when nothing merges.
    /// </summary>
    /// <remarks>A trim and a remove are never joined: the page keeps a trimmed row's place for the window that draws it again.</remarks>
    public static ServerChangeSet Merge(ServerChangeSet changes)
    {
        ArgumentNullException.ThrowIfNull(changes);

        ServerUIUpdate[] updates = changes.Updates;

        if (!HoldsTwoRemovesInARow(updates))
            return changes;

        List<ServerUIUpdate> merged = new(updates.Length);
        Run? run = null;
        var any = false;

        foreach (ServerUIUpdate update in updates)
        {
            if (update is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Remove } remove)
            {
                if (run is not null && run.TryTake(remove))
                {
                    any = true;
                    continue;
                }

                run?.Close(merged);
                run = Run.TryOpen(remove, merged.Count);
                merged.Add(update);
                continue;
            }

            run?.Close(merged);
            run = null;
            merged.Add(update);
        }

        if (!any)
            return changes;

        run?.Close(merged);

        return new ServerChangeSet { Updates = [.. merged] };
    }

    private static bool HoldsTwoRemovesInARow(ServerUIUpdate[] updates)
    {
        for (var i = 1; i < updates.Length; i++)
        {
            if (IsRemove(updates[i]) && IsRemove(updates[i - 1]))
                return true;
        }

        return false;
    }

    private static bool IsRemove(ServerUIUpdate update)
        => update is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Remove };

    /// <summary>A run of removes on one list: where its first stands in the merged set, and the range of the list it took.</summary>
    private sealed class Run
    {
        private readonly int _slot;
        private readonly ServerCollectionChangeUIUpdate _first;
        private readonly HashSet<string> _keys = new(StringComparer.Ordinal);
        private List<ServerCollectionItemChange>? _items;

        // The range taken, as the list stood before the run's first remove.
        private int _start;
        private int _count;

        private Run(int slot, ServerCollectionChangeUIUpdate first)
        {
            _slot = slot;
            _first = first;
        }

        private UIComponentAddress Host => _first.Component;

        /// <summary>A run from a remove whose rows are keyed and stand one after another; null for any other.</summary>
        public static Run? TryOpen(ServerCollectionChangeUIUpdate remove, int slot)
        {
            Run run = new(slot, remove);

            if (!run.TryReadRange(remove.Items, out var start))
                return null;

            run.TakeKeys(remove.Items);
            run._start = start;
            run._count = remove.Items.Length;

            return run;
        }

        /// <summary>Whether the rows are keyed, none the run took already, and stand one after another; answers where the first stands.</summary>
        private bool TryReadRange(ServerCollectionItemChange[] items, out int start)
        {
            start = -1;

            if (items.Length == 0 || items[0].Index is not int first)
                return false;

            for (var i = 0; i < items.Length; i++)
            {
                if (items[i].Key is not { } key || _keys.Contains(key) || items[i].Index != first + i)
                    return false;
            }

            start = first;

            return true;
        }

        private void TakeKeys(ServerCollectionItemChange[] items)
        {
            for (var i = 0; i < items.Length; i++)
                _ = _keys.Add(items[i].Key!);
        }

        /// <summary>Takes a remove into the run where it continues it, rewriting each row's place to the list before the run.</summary>
        public bool TryTake(ServerCollectionChangeUIUpdate remove)
        {
            ServerCollectionItemChange[] items = remove.Items;

            if (!remove.Component.Equals(Host) || remove.Trimmed != _first.Trimmed || !TryReadRange(items, out var start))
                return false;

            var after = start == _start;

            if (!after && start + items.Length != _start)
                return false;

            _items ??= [.. _first.Items];

            if (after)
            {
                // The rows that stood right after the run's: before the run, they stood past the rows it took.
                for (var i = 0; i < items.Length; i++)
                    _items.Add(new ServerCollectionItemChange { Index = _start + _count + i, Key = items[i].Key });
            }
            else
            {
                // The rows right before the run's, which it did not move.
                _items.InsertRange(0, items);
                _start = start;
            }

            TakeKeys(items);
            _count += items.Length;

            return true;
        }

        public void Close(List<ServerUIUpdate> merged)
        {
            if (_items is not null)
                merged[_slot] = new ServerCollectionChangeUIUpdate { Action = CollectionUpdateAction.Remove, Component = Host, Items = [.. _items], Trimmed = _first.Trimmed };
        }
    }
}
