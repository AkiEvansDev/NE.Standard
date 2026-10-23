using System.Collections;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Scheduling;

/// <summary>
/// Change sets queued for the same pages joined into one as they arrive, for <see cref="UIUpdateDispatcher"/>: a value replaced by a
/// later one for the same property, with no other kind of update between them, is left out. Also estimates what a set weighs on the
/// wire, for the dispatcher's bounds.
/// </summary>
/// <remarks>
/// Each set joins in its own length — a map from each property to its latest value, a running estimate — and the joined set is built
/// once, as it leaves to be sent, so a stalled link joining a set every flush costs no more than the sets themselves. Only values: an
/// insert, a removal or a move changes what a row's address names, so anything else stands between two values as a barrier and is
/// never dropped. Queue numbers follow their updates; a set the runtime did not number counts as newer than any snapshot.
/// </remarks>
internal sealed class UIQueuedChangesJoin
{
    // What an update's envelope — its kind, its address — weighs before its value; a guess, close enough for a bound.
    private const int UpdateBytes = 64;
    private const int ItemBytes = 128;

    // A slot left null is a value a later one replaced.
    private readonly List<ServerUIUpdate?> _updates = [];
    private readonly Dictionary<UIPropertyAddress, int> _latestValues = [];
    private List<long>? _sequences;

    // The slot of the last update that was not a value: a value at or before it is never replaced.
    private int _lastBarrier = -1;
    private int _replaced;

    /// <summary>Starts a join from the set queued first.</summary>
    public UIQueuedChangesJoin(ServerChangeSet first)
    {
        Add(first);
    }

    /// <summary>What the joined set is estimated to weigh as JSON.</summary>
    public long Bytes { get; private set; }

    /// <summary>Joins a later set after what is held, in its own length.</summary>
    public void Add(ServerChangeSet changes)
    {
        var numbers = changes.Sequences;

        // The first numbered set numbers what came before it as never queued.
        if (numbers is not null && _sequences is null)
        {
            _sequences = new List<long>(_updates.Count + numbers.Length);

            for (var i = 0; i < _updates.Count; i++)
                _sequences.Add(ServerChangeSet.Unnumbered);
        }

        for (var i = 0; i < changes.Updates.Length; i++)
        {
            ServerUIUpdate update = changes.Updates[i];
            var slot = _updates.Count;

            if (update is ServerValueUIUpdate value)
            {
                if (_latestValues.TryGetValue(value.Address, out var earlier) && earlier > _lastBarrier)
                {
                    Bytes -= EstimateBytes(_updates[earlier]!);
                    _updates[earlier] = null;
                    _replaced++;
                }

                _latestValues[value.Address] = slot;
            }
            else
            {
                _lastBarrier = slot;
            }

            _updates.Add(update);
            _sequences?.Add(numbers is null ? ServerChangeSet.Unnumbered : numbers[i]);
            Bytes += EstimateBytes(update);
        }
    }

    /// <summary>The joined set, the replaced values left out; built once, as the set leaves the queue.</summary>
    public ServerChangeSet Build()
    {
        ServerUIUpdate[] updates = new ServerUIUpdate[_updates.Count - _replaced];
        var sequences = _sequences is null ? null : new long[updates.Length];
        var at = 0;

        for (var i = 0; i < _updates.Count; i++)
        {
            if (_updates[i] is not { } update)
                continue;

            updates[at] = update;

            sequences?[at] = _sequences![i];

            at++;
        }

        return new ServerChangeSet { Updates = updates, Sequences = sequences };
    }

    /// <summary>
    /// What a set is estimated to weigh as JSON: an envelope per update, a text by its length, a list or a collection change by its
    /// items. Never serialized to be measured — the estimate bounds a queue, it does not need to be exact.
    /// </summary>
    public static long EstimateBytes(ServerChangeSet changes)
    {
        long bytes = 0;

        foreach (ServerUIUpdate update in changes.Updates)
            bytes += EstimateBytes(update);

        return bytes;
    }

    private static long EstimateBytes(ServerUIUpdate update)
        => UpdateBytes + update switch
        {
            ServerValueUIUpdate { Value: string text } => text.Length,
            ServerValueUIUpdate { Value: ICollection items } => (long)items.Count * ItemBytes,
            ServerCollectionChangeUIUpdate collection => (long)(collection.Items.Length + collection.Moves.Length) * ItemBytes,
            _ => 0
        };
}
