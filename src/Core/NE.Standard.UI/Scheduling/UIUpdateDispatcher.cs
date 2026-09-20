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

/// <summary>
/// Hands a runtime's change sets to the client without making the flush pass wait for the send.
/// </summary>
/// <remarks>
/// One drain per runtime keeps change sets ordered; a runaway queue is emptied and the runtime asked for a full resync, since
/// a dropped set would leave the client silently stale.
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
    private bool _disposed;

    public UIUpdateDispatcher(Func<IUIUpdateSink> sinkFactory, ILogger logger, int maxQueued)
    {
        ArgumentNullException.ThrowIfNull(sinkFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxQueued);

        _sinkFactory = sinkFactory;
        _logger = logger;
        _maxQueued = maxQueued;
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

        RuntimeQueue queue;
        bool startDrain;

        lock (_sync)
        {
            if (!_queues.TryGetValue(runtime, out RuntimeQueue? held))
            {
                held = new RuntimeQueue();
                _queues.Add(runtime, held);
            }

            queue = held;

            if (queue.Pending.Count >= _maxQueued)
            {
                queue.Pending.Clear();
                Log.QueueOverflowed(_logger, _maxQueued);
                runtime.RequestFullResync();
                return;
            }

            queue.Pending.Enqueue(new QueuedChanges(runtime.Handle, instanceIds, changes));

            // Raised only here, lowered only by the leaving drain: writing it unconditionally would let a still-running drain
            // get cleared and a second one start beside it — the exact out-of-order delivery this queue prevents.
            startDrain = !queue.Draining;

            if (startDrain)
                queue.Draining = true;
        }

        if (startDrain)
            _ = Task.Run(() => DrainAsync(runtime, queue), CancellationToken.None);
    }

    private async Task DrainAsync(IUIRuntime runtime, RuntimeQueue queue)
    {
        while (true)
        {
            QueuedChanges next;

            lock (_sync)
            {
                // A queue leaves the map only here, under the same lock enqueue takes: a gone runtime holds no entry, and a
                // stopped runtime's leftovers are nobody's to send.
                if (queue.Pending.Count == 0 || _stopping.IsCancellationRequested || runtime.IsStopped)
                {
                    queue.Pending.Clear();
                    queue.Draining = false;

                    if (_queues.TryGetValue(runtime, out RuntimeQueue? held) && ReferenceEquals(held, queue))
                        _ = _queues.Remove(runtime);

                    return;
                }

                next = queue.Pending.Dequeue();
            }

            try
            {
                IUIUpdateSink sink = _sinkFactory();

                await UIChangeDelivery
                    .SendAsync(sink, next.Handle, next.InstanceIds, next.Changes, _stopping.Token)
                    .ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (_stopping.IsCancellationRequested)
            {
                lock (_sync)
                    queue.Draining = false;

                return;
            }
            catch (Exception exception)
            {
                // The queue keeps going: one client's failed send is not a reason to stop the ones behind it.
                Log.SendFailed(_logger, exception, runtime.Handle.Instance.Id);
            }
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

        lock (_sync)
        {
            foreach (RuntimeQueue queue in _queues.Values)
                queue.Pending.Clear();

            _queues.Clear();
        }

        _stopping.Dispose();
    }

    private sealed class RuntimeQueue
    {
        public Queue<QueuedChanges> Pending { get; } = new();

        public bool Draining { get; set; }
    }

    private readonly record struct QueuedChanges(UIHandle Handle, IReadOnlyCollection<string> InstanceIds, ServerChangeSet Changes);
}
