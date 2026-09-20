using System;
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

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Scheduled UI flush drained {RuntimeCount} runtime(s): {SentChangeSetCount} change set(s) queued, {FailedRuntimeCount} failed.")]
        public static partial void ScheduledFlushCompleted(ILogger logger, int runtimeCount, int sentChangeSetCount, int failedRuntimeCount);
    }

    private readonly UIRuntimeStore _runtimeStore;
    private readonly UIUpdateDispatcher _dispatcher;
    private readonly ILogger _logger;
    private readonly int _maxParallelFlushes;

    public UIFlushTask(UIRuntimeStore runtimeStore, UIUpdateDispatcher dispatcher, ILogger logger, TimeSpan interval, int maxParallelFlushes)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(runtimeStore);
        ArgumentNullException.ThrowIfNull(dispatcher);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxParallelFlushes);

        _runtimeStore = runtimeStore;
        _dispatcher = dispatcher;
        _logger = logger;
        _maxParallelFlushes = maxParallelFlushes;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        IUIRuntime[] runtimes = _runtimeStore.GetRuntimesReadyToFlush(utcNow);

        var queuedChangeSetCount = 0;
        var failedRuntimeCount = 0;

        try
        {
            ParallelOptions options = new()
            {
                CancellationToken = cancellationToken,
                MaxDegreeOfParallelism = _maxParallelFlushes
            };

            await Parallel.ForEachAsync(runtimes, options, async (runtime, itemCancellationToken) =>
            {
                // Selected before the cleanup pass, which runs beside this one, may have stopped and disposed it since.
                if (runtime.IsStopped)
                    return;

                try
                {
                    ServerChangeSet changes = await runtime
                        .FlushAsync(itemCancellationToken)
                        .ConfigureAwait(false);

                    // A disconnected runtime is still drained to keep its pending queue from growing, even with no one to notify.
                    if (changes.IsEmpty || runtime.AttachedInstanceIds.Count == 0)
                        return;

                    // Handed over, not sent here: a full transport would otherwise hold this pass's slot until it gave up,
                    // delaying every runtime behind it.
                    _dispatcher.Enqueue(runtime, changes);

                    _ = Interlocked.Increment(ref queuedChangeSetCount);
                }
                catch (OperationCanceledException) when (itemCancellationToken.IsCancellationRequested)
                {
                    throw;
                }
                catch (Exception exception) when (runtime.IsStopped && exception is ObjectDisposedException or InvalidOperationException)
                {
                    // Stopped under the flush: a runtime that is gone has nothing left to send, and no failure to report.
                }
                catch (Exception exception)
                {
                    _ = Interlocked.Increment(ref failedRuntimeCount);
                    Log.ScheduledFlushFailed(_logger, exception, runtime.Handle.Instance.Id);
                }
            }).ConfigureAwait(false);
        }
        finally
        {
            // Logged rather than kept on the task since nothing holds the instance; logged only when the pass did something.
            var queued = Volatile.Read(ref queuedChangeSetCount);
            var failed = Volatile.Read(ref failedRuntimeCount);

            if (queued > 0 || failed > 0)
                Log.ScheduledFlushCompleted(_logger, runtimes.Length, queued, failed);
        }
    }
}
