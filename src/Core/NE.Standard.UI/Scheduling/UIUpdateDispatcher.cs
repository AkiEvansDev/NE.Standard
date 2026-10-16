using System;
using System.Collections.Generic;
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
/// (<see cref="EnqueueAnswer"/>), so an answer reaches its page after every set drained before it and ahead of every set drained after;
/// a runaway queue is emptied and the runtime asked for a full resync, since a dropped set would leave the client silently stale.
/// </remarks>
internal sealed partial class UIUpdateDispatcher : IDisposable
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Sending UI changes failed for '{InstanceId}'.")]
        public static partial void SendFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "A client fell {QueuedCount} change set(s) behind; its queue was dropped and the runtime asked for a full resync.")]
        public static partial void QueueOverflowed(ILogger logger, int queuedCount);
    }

    private readonly Dictionary<IUIRuntime, RuntimeQueue> _queues = [];
    private readonly Lock _sync = new();
    private readonly Func<IUIUpdateSink> _sinkFactory;
    private readonly ILogger _logger;
    private readonly int _maxQueued;
    private readonly CancellationTokenSource _stopping = new();

    // Taken once: a drain already past its check reads it after Dispose, when the source's own Token would throw.
    private readonly CancellationToken _stoppingToken;
    private bool _disposed;

    public UIUpdateDispatcher(Func<IUIUpdateSink> sinkFactory, ILogger logger, int maxQueued)
    {
        ArgumentNullException.ThrowIfNull(sinkFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxQueued);

        _sinkFactory = sinkFactory;
        _logger = logger;
        _maxQueued = maxQueued;
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

        _ = TryQueue(runtime, new QueuedChanges(runtime.Handle, instanceIds, changes, Answer: null), whenIdle: true);
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

            if (queue.Pending.Count >= _maxQueued)
            {
                dropped = DropPendingNoLock(queue);

                if (queued.Answer is { } answer)
                    (dropped ??= []).Add(answer);

                Log.QueueOverflowed(_logger, _maxQueued);
                runtime.RequestFullResync();
            }
            else
            {
                queue.Pending.Enqueue(queued);

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

    /// <summary>Drops the sets still queued, answering the answers among them: a resync or a stop is what follows them; null for none.</summary>
    private static List<QueuedAnswer>? DropPendingNoLock(RuntimeQueue queue)
    {
        List<QueuedAnswer>? dropped = null;

        while (queue.Pending.TryDequeue(out QueuedChanges queued))
        {
            if (queued.Answer is { } answer)
                (dropped ??= []).Add(answer);
        }

        return dropped;
    }

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
        while (TryTakeNext(runtime, queue, out QueuedChanges next))
        {
            try
            {
                // An empty answer only waited its turn.
                if (!next.Changes.IsEmpty)
                {
                    IUIUpdateSink sink = _sinkFactory();

                    await UIChangeDelivery
                        .SendAsync(sink, runtime, next.Handle, next.InstanceIds, next.Changes, _stoppingToken)
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
    private bool TryTakeNext(IUIRuntime runtime, RuntimeQueue queue, out QueuedChanges next)
    {
        List<QueuedAnswer>? dropped;

        lock (_sync)
        {
            if (queue.Pending.Count > 0 && !_stopping.IsCancellationRequested && !runtime.IsStopped)
            {
                next = queue.Pending.Dequeue();
                queue.Sending = next.Answer;
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

        next = default;
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

        public bool Draining { get; set; }

        // The answer whose send is under way, let go at a stop, which a send may never come back from.
        public QueuedAnswer? Sending { get; set; }
    }

    private readonly record struct QueuedChanges(UIHandle Handle, IReadOnlyCollection<string> InstanceIds, ServerChangeSet Changes, QueuedAnswer? Answer);

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
