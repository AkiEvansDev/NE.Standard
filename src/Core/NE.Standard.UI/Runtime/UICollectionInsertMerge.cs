using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Merges the inserts a sent change set holds on one list one after another — a controller's <c>Add</c> per item — into one insert,
/// which the page applies as it applied each and reads as one refill after a reset. Only on a set about to leave the runtime: the
/// merged set carries no queue numbers, so nothing may split it by a watermark afterwards.
/// </summary>
internal static class UICollectionInsertMerge
{
    // Lists merged at once: a run stays open across the updates of the rows it inserted, which open runs of their own.
    private const int MaxOpenRuns = 8;

    /// <summary>
    /// The change set with each run of inserts on one list as one insert: indexes running on from where the run's last item stood,
    /// with nothing between them but updates inside the rows the run inserted, which a later row of the run cannot change. The same
    /// instance when nothing merges.
    /// </summary>
    public static ServerChangeSet Merge(ServerChangeSet changes)
    {
        ArgumentNullException.ThrowIfNull(changes);

        ServerUIUpdate[] updates = changes.Updates;

        if (!HoldsTwoInserts(updates))
            return changes;

        List<ServerUIUpdate> merged = new(updates.Length);
        List<Run> runs = [];
        var any = false;

        foreach (ServerUIUpdate update in updates)
        {
            Run? target = update is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Insert } insert ? FindContinuedRun(runs, insert) : null;

            // Every other run judges the update where it stood, so no item later moved above it into an earlier run crosses it unasked.
            CloseRunsNotPassing(runs, update, target, merged);

            if (target is not null)
            {
                target.Append((ServerCollectionChangeUIUpdate)update);
                any = true;
                continue;
            }

            if (update is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Insert } opening && Run.TryOpen(opening, merged.Count) is { } run)
            {
                if (runs.Count == MaxOpenRuns)
                {
                    runs[0].Close(merged);
                    runs.RemoveAt(0);
                }

                runs.Add(run);
            }

            merged.Add(update);
        }

        if (!any)
            return changes;

        foreach (Run run in runs)
            run.Close(merged);

        return new ServerChangeSet { Updates = [.. merged] };
    }

    private static bool HoldsTwoInserts(ServerUIUpdate[] updates)
    {
        var inserts = 0;

        foreach (ServerUIUpdate update in updates)
        {
            if (update is ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Insert } && ++inserts == 2)
                return true;
        }

        return false;
    }

    private static Run? FindContinuedRun(List<Run> runs, ServerCollectionChangeUIUpdate insert)
    {
        foreach (Run run in runs)
        {
            if (run.Host.Equals(insert.Component))
                return run.Continues(insert) ? run : null;
        }

        return null;
    }

    private static void CloseRunsNotPassing(List<Run> runs, ServerUIUpdate update, Run? target, List<ServerUIUpdate> merged)
    {
        for (var i = runs.Count - 1; i >= 0; i--)
        {
            if (ReferenceEquals(runs[i], target) || runs[i].Passes(update))
                continue;

            runs[i].Close(merged);
            runs.RemoveAt(i);
        }
    }

    /// <summary>A run of inserts on one list: where its first stands in the merged set, and what the ones after it brought.</summary>
    private sealed class Run
    {
        private readonly int _slot;
        private readonly ServerCollectionChangeUIUpdate _first;
        private readonly HashSet<string> _keys = new(StringComparer.Ordinal);
        private List<ServerCollectionItemChange>? _items;

        // The index the next item must carry to continue the run; null where every item so far carried none, which appends.
        private int? _next;

        private Run(int slot, ServerCollectionChangeUIUpdate first)
        {
            _slot = slot;
            _first = first;
        }

        public UIComponentAddress Host => _first.Component;

        /// <summary>A run from an insert whose items are keyed and run on from one index, or all carry none; null for any other.</summary>
        public static Run? TryOpen(ServerCollectionChangeUIUpdate insert, int slot)
        {
            Run run = new(slot, insert);

            return run.TryTake(insert.Items, first: true) ? run : null;
        }

        public bool Continues(ServerCollectionChangeUIUpdate insert)
        {
            ServerCollectionItemChange[] items = insert.Items;

            if (items.Length == 0 || items[0].Index != _next)
                return false;

            for (var i = 0; i < items.Length; i++)
            {
                if (items[i].Key is not { } key || _keys.Contains(key) || items[i].Index != (_next is { } next ? next + i : null))
                    return false;
            }

            return true;
        }

        public void Append(ServerCollectionChangeUIUpdate insert)
        {
            _items ??= [.. _first.Items];
            _items.AddRange(insert.Items);
            _ = TryTake(insert.Items, first: false);
        }

        /// <summary>
        /// Whether a later insert of this run may move above the update: one inside a row the run already inserted, which a row
        /// inserted later neither holds nor is found by.
        /// </summary>
        public bool Passes(ServerUIUpdate update)
        {
            UIComponentAddress address;

            switch (update)
            {
                case ServerCollectionChangeUIUpdate collection:
                    address = collection.Component;
                    break;
                case ServerValueUIUpdate value:
                    address = value.Address.Component;
                    break;
                default:
                    return false;
            }

            var host = Host.DynamicParameters;
            var parameters = address.DynamicParameters;

            if (parameters.Length <= host.Length || !parameters.AsSpan(0, host.Length).SequenceEqual(host))
                return false;

            return KeyText(parameters[host.Length]) is { } key && _keys.Contains(key);
        }

        public void Close(List<ServerUIUpdate> merged)
        {
            if (_items is not null)
                merged[_slot] = new ServerCollectionChangeUIUpdate { Action = CollectionUpdateAction.Insert, Component = _first.Component, Items = [.. _items] };
        }

        private bool TryTake(ServerCollectionItemChange[] items, bool first)
        {
            if (items.Length == 0)
                return false;

            var start = items[0].Index;

            for (var i = 0; i < items.Length; i++)
            {
                if (items[i].Key is not { } key || !_keys.Add(key))
                    return false;

                if (first && items[i].Index != (start is { } at ? at + i : null))
                    return false;
            }

            _next = start is { } begin ? begin + items.Length : null;

            return true;
        }

        // A row key is text on the page, whatever the address carried it as.
        private static string? KeyText(object? parameter)
            => parameter switch
            {
                string text => text,
                int number => number.ToString(CultureInfo.InvariantCulture),
                _ => null
            };
    }
}
