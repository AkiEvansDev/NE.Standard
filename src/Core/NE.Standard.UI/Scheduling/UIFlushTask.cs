using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Scheduling;

internal sealed partial class UIFlushTask : RuntimeScheduledTask
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Scheduled UI screen flush failed for '{InstanceId}'.")]
        public static partial void ScheduledFlushFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Scheduled UI flush drained {RuntimeCount} runtime(s) in {ElapsedMs:F1} ms: {SentChangeSetCount} change set(s) queued, {FailedRuntimeCount} failed.")]
        public static partial void ScheduledFlushCompleted(ILogger logger, int runtimeCount, double elapsedMs, int sentChangeSetCount, int failedRuntimeCount);
    }

    private readonly UIRuntimeStore _runtimeStore;
    private readonly UIUpdateDispatcher _dispatcher;
    private readonly ILogger _logger;
    private readonly UIMetrics? _metrics;
    private readonly int _maxParallelFlushes;

    // A runtime whose flush outlived its pass, still running on its own: no later pass starts another beside it.
    private readonly ConcurrentDictionary<IUIRuntime, byte> _inFlight = new(ReferenceEqualityComparer.Instance);

    public UIFlushTask(UIRuntimeStore runtimeStore, UIUpdateDispatcher dispatcher, ILogger logger, TimeSpan interval, int maxParallelFlushes, UIMetrics? metrics = null)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(runtimeStore);
        ArgumentNullException.ThrowIfNull(dispatcher);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxParallelFlushes);

        _runtimeStore = runtimeStore;
        _dispatcher = dispatcher;
        _logger = logger;
        _metrics = metrics;
        _maxParallelFlushes = maxParallelFlushes;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        IUIRuntime[] runtimes = _runtimeStore.GetRuntimesReadyToFlush(utcNow);

        // An interval with nothing to send is not a pass worth timing; the histogram would fill with zeros.
        if (runtimes.Length == 0)
            return;

        var started = Stopwatch.GetTimestamp();
        PassCounts counts = new();

        try
        {
            ParallelOptions options = new()
            {
                CancellationToken = cancellationToken,
                MaxDegreeOfParallelism = _maxParallelFlushes
            };

            await Parallel.ForEachAsync(runtimes, options, async (runtime, itemCancellationToken) =>
            {
                // Selected before the cleanup pass, which runs beside this one, may have stopped and disposed it since. One still
                // flushing from an earlier pass keeps its work pending, so a later pass picks it up once that flush ends.
                if (runtime.IsStopped || !_inFlight.TryAdd(runtime, 0))
                    return;

                // The stop token, not the item's: a flush that outlives its pass goes on once the pass is over.
                Task flush = FlushOneAsync(runtime, counts, cancellationToken);

                if (flush.IsCompleted)
                    return;

                try
                {
                    // A runtime held by its hook or by a slow window read would otherwise hold the whole pass, and with it every
                    // other runtime's next flush; past one interval it goes on alone.
                    await flush.WaitAsync(Options.Interval, itemCancellationToken).ConfigureAwait(false);
                }
                catch (TimeoutException)
                {
                }
            }).ConfigureAwait(false);
        }
        finally
        {
            // Logged rather than kept on the task since nothing holds the instance; logged only when the pass did something.
            var queued = Volatile.Read(ref counts.Queued);
            var failed = Volatile.Read(ref counts.Failed);
            TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

            if (queued > 0 || failed > 0)
                Log.ScheduledFlushCompleted(_logger, runtimes.Length, elapsed.TotalMilliseconds, queued, failed);

            _metrics?.FlushCompleted(elapsed, failed);
        }
    }

    /// <summary>
    /// Flushes one runtime and hands what it drained to the dispatcher; never faults, and lets go of the runtime's in-flight mark at
    /// its end, whether its pass waited for it or not.
    /// </summary>
    private async Task FlushOneAsync(IUIRuntime runtime, PassCounts counts, CancellationToken cancellationToken)
    {
        try
        {
            ServerChangeSet changes = await runtime
                .FlushAsync(cancellationToken)
                .ConfigureAwait(false);

            // A disconnected runtime is still drained to keep its pending queue from growing, even with no one to notify.
            if (changes.IsEmpty || runtime.AttachedInstanceIds.Count == 0)
                return;

            // Handed over, not sent here: a full transport would otherwise hold this flush until it gave up.
            _dispatcher.Enqueue(runtime, changes);

            _ = Interlocked.Increment(ref counts.Queued);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception) when (runtime.IsStopped && exception is ObjectDisposedException or InvalidOperationException)
        {
            // Stopped under the flush: a runtime that is gone has nothing left to send, and no failure to report.
        }
        catch (Exception exception)
        {
            _ = Interlocked.Increment(ref counts.Failed);
            Log.ScheduledFlushFailed(_logger, exception, runtime.Handle.Instance.Id);
        }
        finally
        {
            _ = _inFlight.TryRemove(runtime, out _);
        }
    }

    /// <summary>What one pass queued and failed; a flush that outlives its pass counts into a pass already logged.</summary>
    private sealed class PassCounts
    {
        public int Queued;
        public int Failed;
    }
}
