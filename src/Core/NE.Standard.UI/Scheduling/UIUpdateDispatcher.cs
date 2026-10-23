using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Runtime;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Scheduling;

/// <summary>Hands a runtime's change sets to the client without making the flush pass wait for the send.</summary>
/// <remarks>
/// One drain per runtime keeps change sets ordered — the flush's for every attached instance and an answer's for its caller alike
/// (<see cref="EnqueueAnswer"/>), so an answer reaches its page after every set drained before it and ahead of every set drained after.
/// A set queued behind another for the same pages joins it, a value it carries replacing an earlier one for the same property, so a
/// slow link takes the latest state rather than every step; a queue still past its bound in sets or in bytes is emptied and the runtime
/// asked for a full resync, since a dropped set would leave the client silently stale.
/// </remarks>
internal sealed partial class UIUpdateDispatcher : IDisposable
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Sending UI changes failed for '{InstanceId}'.")]
        public static partial void SendFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "A client fell {QueuedCount} change set(s), about {QueuedBytes} bytes, behind; its queue was dropped and the runtime asked for a full resync.")]
        public static partial void QueueOverflowed(ILogger logger, int queuedCount, long queuedBytes);
    }

    private readonly Dictionary<IUIRuntime, RuntimeQueue> _queues = [];
    private readonly Lock _sync = new();
    private readonly Func<IUIUpdateSink> _sinkFactory;
    private readonly ILogger _logger;
    private readonly int _maxQueued;
    private readonly long _maxQueuedBytes;
    private readonly TimeSpan _sendTimeout;
    private readonly CancellationTokenSource _stopping = new();

    // Taken once: a drain already past its check reads it after Dispose, when the source's own Token would throw.
    private readonly CancellationToken _stoppingToken;
    private bool _disposed;

    /// <summary>A dispatcher bounded by set count alone, whose sends take as long as they take.</summary>
    public UIUpdateDispatcher(Func<IUIUpdateSink> sinkFactory, ILogger logger, int maxQueued)
        : this(sinkFactory, logger, maxQueued, maxQueuedBytes: 0, Timeout.InfiniteTimeSpan)
    {
    }

    /// <summary>
    /// A dispatcher bounded by set count and by estimated bytes (<paramref name="maxQueuedBytes"/>, zero for none), whose send to one
    /// page is given up past <paramref name="sendTimeout"/> (<see cref="Timeout.InfiniteTimeSpan"/> for none).
    /// </summary>
    public UIUpdateDispatcher(Func<IUIUpdateSink> sinkFactory, ILogger logger, int maxQueued, long maxQueuedBytes, TimeSpan sendTimeout)
    {
        ArgumentNullException.ThrowIfNull(sinkFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxQueued);
        ArgumentOutOfRangeException.ThrowIfNegative(maxQueuedBytes);

        if (sendTimeout <= TimeSpan.Zero && sendTimeout != Timeout.InfiniteTimeSpan)
            throw new ArgumentOutOfRangeException(nameof(sendTimeout), sendTimeout, "A send timeout must be greater than zero, or infinite.");

        _sinkFactory = sinkFactory;
        _logger = logger;
        _maxQueued = maxQueued;
        _maxQueuedBytes = maxQueuedBytes;
        _sendTimeout = sendTimeout;
        _stoppingToken = _stopping.Token;
    }

    /// <summary>Queues a change set for the runtime's attached clients and returns; the send happens on its own.</summary>
    public void Enqueue(IUIRuntime runtime, ServerChangeSet changes)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        ArgumentNullException.ThrowIfNull(changes);

        if (_stopping.IsCancellationRequested || runtime.IsStopped)
            return;

        // Taken now rather than at the send: the change set belongs to the clients that were attached when it was made.
        string[] instanceIds = [.. runtime.AttachedInstanceIds];

        if (instanceIds.Length == 0)
            return;

        _ = TryQueue(runtime, new QueuedChanges(runtime.Handle, instanceIds, changes, answer: null), whenIdle: true);
    }

    /// <summary>
    /// Queues one caller's answer for that caller alone, behind every set queued for the runtime so far, and answers the task that
    /// completes once it is sent — <paramref name="sent"/> run then, before any later set goes — or dropped for a resync or a stop. An
    /// empty one only waits its turn. Null where nothing was queued: the runtime or the dispatcher stopping, or an empty answer with
    /// nothing ahead of it.
    /// </summary>
    /// <remarks>Called in the hold of the runtime's state lock that took the answer's copy, so no set drained after it goes before it.</remarks>
    public Task? EnqueueAnswer(IUIRuntime runtime, string instanceId, ServerChangeSet changes, Action? sent)
    {
        ArgumentNullException.ThrowIfNull(runtime);
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(changes);

        if (_stopping.IsCancellationRequested || runtime.IsStopped)
            return null;

        QueuedAnswer answer = new(sent);

        return TryQueue(runtime, new QueuedChanges(runtime.Handle, [instanceId], changes, answer), whenIdle: !changes.IsEmpty) ? answer.Done : null;
    }

    /// <summary>
    /// Queues a set behind the runtime's others and starts its drain where none runs; past the bound, drops the queue and the set and
    /// asks for a resync. False only where <paramref name="whenIdle"/> is off and nothing is queued or sending to go behind.
    /// </summary>
    private bool TryQueue(IUIRuntime runtime, QueuedChanges queued, bool whenIdle)
    {
        RuntimeQueue queue;
        var startDrain = false;
        List<QueuedAnswer>? dropped = null;

        lock (_sync)
        {
            if (!_queues.TryGetValue(runtime, out RuntimeQueue? held))
            {
                if (!whenIdle)
                    return false;

                held = new RuntimeQueue();
                _queues.Add(runtime, held);
            }
            else if (!whenIdle && !held.Draining)
            {
                return false;
            }

            queue = held;

            if (CanJoinLastNoLock(queue, queued))
            {
                JoinLastNoLock(queue, queued);

                // Past the bound once joined, the queue overflows as it would have taking the set apart: the join goes with it.
                if (!IsOverNoLock(queue))
                    return true;

                dropped = OverflowNoLock(runtime, queue, answer: null);
            }
            else if (IsFullNoLock(queue, queued.BoundBytes))
            {
                dropped = OverflowNoLock(runtime, queue, queued.Answer);
            }
            else
            {
                queue.Pending.Enqueue(queued);
                queue.Last = queued;
                queue.Bytes += queued.BoundBytes;
                queue.Sets++;

                // Raised only here, lowered only by the leaving drain: writing it unconditionally would let a still-running drain
                // get cleared and a second one start beside it — the exact out-of-order delivery this queue prevents.
                startDrain = !queue.Draining;

                if (startDrain)
                    queue.Draining = true;
            }
        }

        Release(dropped);

        if (startDrain)
            _ = Task.Run(() => DrainAsync(runtime, queue), CancellationToken.None);

        return true;
    }

    /// <summary>
    /// Whether a flush set may join the last one queued: both for the same pages under the same handle, neither a resync. Sent back to
    /// back they are one set anyway, and joined, a value replaces an earlier one for its property.
    /// </summary>
    /// <remarks>Never across an answer, which marks its place among the sets; never into the set already sending, which left the queue.</remarks>
    private static bool CanJoinLastNoLock(RuntimeQueue queue, QueuedChanges queued)
        => queue.Last is { } last
        && last.Answer is null
        && queued.Answer is null
        && ReferenceEquals(last.Handle, queued.Handle)
        && !last.HasFullResync
        && !queued.HasFullResync
        && SameInstances(last.InstanceIds, queued.InstanceIds);

    private static bool SameInstances(string[] first, string[] second)
    {
        if (first.Length != second.Length)
            return false;

        for (var i = 0; i < first.Length; i++)
        {
            if (Array.IndexOf(second, first[i]) < 0)
                return false;
        }

        return true;
    }

    /// <summary>Joins the set into the last one queued, in the set's own length, and counts it.</summary>
    private static void JoinLastNoLock(RuntimeQueue queue, QueuedChanges queued)
    {
        QueuedChanges last = queue.Last!;
        var before = last.Bytes;

        last.Join(queued);

        queue.Bytes += last.Bytes - before;
        queue.Sets += queued.Sets;
    }

    /// <summary>
    /// Whether a queue a set just joined is past its bound: in estimated bytes where there is one; else in sets, joined ones counted, so
    /// a set of ever new properties joining every flush cannot grow without end.
    /// </summary>
    private bool IsOverNoLock(RuntimeQueue queue)
        => _maxQueuedBytes > 0 ? queue.Bytes > _maxQueuedBytes : queue.Sets > _maxQueued;

    /// <summary>Empties a queue past its bound and asks the runtime for a full resync; answers the answers dropped, the set's own among them.</summary>
    private List<QueuedAnswer>? OverflowNoLock(IUIRuntime runtime, RuntimeQueue queue, QueuedAnswer? answer)
    {
        Log.QueueOverflowed(_logger, queue.Sets, queue.Bytes);

        List<QueuedAnswer>? dropped = DropPendingNoLock(queue);

        if (answer is not null)
            (dropped ??= []).Add(answer);

        runtime.RequestFullResync();

        return dropped;
    }

    /// <summary>Drops the sets still queued, answering the answers among them: a resync or a stop is what follows them; null for none.</summary>
    private static List<QueuedAnswer>? DropPendingNoLock(RuntimeQueue queue)
    {
        List<QueuedAnswer>? dropped = null;

        while (queue.Pending.TryDequeue(out QueuedChanges? queued))
        {
            if (queued.Answer is { } answer)
                (dropped ??= []).Add(answer);
        }

        queue.Last = null;
        queue.Bytes = 0;
        queue.Sets = 0;

        return dropped;
    }

    /// <summary>
    /// Whether one more set would take the queue past its bound in sets, or in estimated bytes; a queue holding nothing yet takes a set of
    /// any size, or one large set would be dropped for good. Without a byte bound the sets joined count too (<see cref="IsOverNoLock"/>).
    /// A full resync weighs nothing here (<see cref="QueuedChanges.BoundBytes"/>).
    /// </summary>
    private bool IsFullNoLock(RuntimeQueue queue, long bytes)
        => (_maxQueuedBytes > 0 ? queue.Pending.Count : queue.Sets) >= _maxQueued || (_maxQueuedBytes > 0 && queue.Pending.Count > 0 && queue.Bytes + bytes > _maxQueuedBytes);

    /// <summary>Lets the answers dropped go, outside the lock.</summary>
    private static void Release(List<QueuedAnswer>? dropped)
    {
        if (dropped is null)
            return;

        for (var i = 0; i < dropped.Count; i++)
            dropped[i].Release();
    }

    private async Task DrainAsync(IUIRuntime runtime, RuntimeQueue queue)
    {
        while (TryTakeNext(runtime, queue, out QueuedChanges? next))
        {
            try
            {
                // Out of the lock: once taken, nothing joins it any more.
                ServerChangeSet changes = next.TakeChanges();

                // An empty answer only waited its turn.
                if (!changes.IsEmpty)
                {
                    IUIUpdateSink sink = _sinkFactory();

                    await UIChangeDelivery
                        .SendAsync(sink, runtime, next.Handle, next.InstanceIds, changes, _sendTimeout, _stoppingToken)
                        .ConfigureAwait(false);
                }
            }
            catch (OperationCanceledException) when (_stopping.IsCancellationRequested)
            {
                lock (_sync)
                    queue.Draining = false;

                next.Answer?.Release();
                return;
            }
            catch (Exception exception)
            {
                // The queue keeps going: one client's failed send is not a reason to stop the ones behind it. The delivery sent the
                // others theirs and asked for the resync that brings the failed one back.
                Log.SendFailed(_logger, exception, runtime.Handle.Instance.Id);
            }

            // Before the next set is taken, so what the answer marks holds for every set behind it.
            next.Answer?.Sent();
        }
    }

    /// <summary>
    /// Takes the next set to send; with none left, or the runtime or the dispatcher stopping, lets go of the queue and of every answer
    /// still in it, and answers false.
    /// </summary>
    private bool TryTakeNext(IUIRuntime runtime, RuntimeQueue queue, [NotNullWhen(true)] out QueuedChanges? next)
    {
        List<QueuedAnswer>? dropped;

        lock (_sync)
        {
            if (queue.Pending.Count > 0 && !_stopping.IsCancellationRequested && !runtime.IsStopped)
            {
                next = queue.Pending.Dequeue();
                queue.Sending = next.Answer;
                queue.Bytes -= next.BoundBytes;
                queue.Sets -= next.Sets;

                // Sending now, it takes no more joins.
                if (ReferenceEquals(queue.Last, next))
                    queue.Last = null;

                return true;
            }

            // A queue leaves the map only here, under the same lock enqueue takes: a gone runtime holds no entry, and a stopped
            // runtime's leftovers are nobody's to send.
            dropped = DropPendingNoLock(queue);
            queue.Draining = false;
            queue.Sending = null;

            if (_queues.TryGetValue(runtime, out RuntimeQueue? held) && ReferenceEquals(held, queue))
                _ = _queues.Remove(runtime);
        }

        Release(dropped);

        next = null;
        return false;
    }

    /// <summary>How many change sets wait in every queue together, for the host's meter: a client falling behind shows here first.</summary>
    internal int PendingCount
    {
        get
        {
            var pending = 0;

            lock (_sync)
            {
                foreach (RuntimeQueue queue in _queues.Values)
                    pending += queue.Pending.Count;
            }

            return pending;
        }
    }

    /// <summary>How many runtimes hold a queue right now.</summary>
    internal int QueueCount
    {
        get
        {
            lock (_sync)
                return _queues.Count;
        }
    }

    public void Dispose()
    {
        // Idempotent: a host is disposed by its container as well as by whoever built it.
        if (_disposed)
            return;

        _disposed = true;
        _stopping.Cancel();

        List<QueuedAnswer>? dropped = null;

        lock (_sync)
        {
            foreach (RuntimeQueue queue in _queues.Values)
            {
                if (DropPendingNoLock(queue) is { } pending)
                    (dropped ??= []).AddRange(pending);

                // A send still under way may never end now: nothing waits for it.
                if (queue.Sending is { } sending)
                    (dropped ??= []).Add(sending);
            }

            _queues.Clear();
        }

        Release(dropped);

        _stopping.Dispose();
    }

    private sealed class RuntimeQueue
    {
        public Queue<QueuedChanges> Pending { get; } = new();

        // The set queued last, which a flush set for the same pages may still join; null once it is sending.
        public QueuedChanges? Last { get; set; }

        // What the queued sets are estimated to weigh on the wire, a full resync left out (QueuedChanges.BoundBytes).
        public long Bytes { get; set; }

        // How many sets the queue took, those joined into another counted.
        public int Sets { get; set; }

        public bool Draining { get; set; }

        // The answer whose send is under way, let go at a stop, which a send may never come back from.
        public QueuedAnswer? Sending { get; set; }
    }

    /// <summary>
    /// One set waiting in a queue; a later flush set for the same pages may join it while it waits. Made outside the lock, so its
    /// estimate and its resync check are read before the lock is taken.
    /// </summary>
    private sealed class QueuedChanges(UIHandle handle, string[] instanceIds, ServerChangeSet changes, QueuedAnswer? answer)
    {
        private ServerChangeSet? _changes = changes;
        private UIQueuedChangesJoin? _join;

        public UIHandle Handle { get; } = handle;

        public string[] InstanceIds { get; } = instanceIds;

        public QueuedAnswer? Answer { get; } = answer;

        public bool HasFullResync { get; } = UIChangeDelivery.IsFullResync(changes);

        public long Bytes { get; private set; } = UIQueuedChangesJoin.EstimateBytes(changes);

        /// <summary>
        /// What the set weighs against the byte bound: nothing for a full resync. Dropped, it is only built again at the next flush and
        /// dropped again by the next set behind the send under way — a whole snapshot every flush for nothing.
        /// </summary>
        public long BoundBytes => HasFullResync ? 0 : Bytes;

        /// <summary>How many sets this one holds: itself and those joined into it.</summary>
        public int Sets { get; private set; } = 1;

        /// <summary>Joins a later set, in that set's length; under the dispatcher's lock, while this one waits.</summary>
        public void Join(QueuedChanges later)
        {
            if (_join is null)
            {
                _join = new UIQueuedChangesJoin(_changes!);
                _changes = null;
            }

            _join.Add(later.TakeChanges());

            Bytes = _join.Bytes;
            Sets += later.Sets;
        }

        /// <summary>The set to send: as queued where nothing joined it, else the joined one, built now.</summary>
        public ServerChangeSet TakeChanges()
            => _changes ?? _join!.Build();
    }

    /// <summary>An answer waiting for its turn among the sends: what it runs once it is sent, then its wait let go.</summary>
    private sealed class QueuedAnswer(Action? sent)
    {
        private readonly TaskCompletionSource _done = new(TaskCreationOptions.RunContinuationsAsynchronously);

        public Task Done => _done.Task;

        /// <summary>Handed to the sink: runs what it asked to run there, then lets its wait go.</summary>
        public void Sent()
        {
            try
            {
                // Let go already by a stop: the runtime it would mark is going too.
                if (!_done.Task.IsCompleted)
                    sent?.Invoke();
            }
            finally
            {
                _ = _done.TrySetResult();
            }
        }

        /// <summary>Dropped, or given up at a stop: lets its wait go and runs nothing.</summary>
        public void Release()
            => _ = _done.TrySetResult();
    }
}
