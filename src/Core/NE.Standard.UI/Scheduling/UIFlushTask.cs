using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Scheduling;

internal sealed partial class UIFlushTask : RuntimeScheduledTask
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Scheduled UI screen flush failed for '{InstanceId}'.")]
        public static partial void ScheduledFlushFailed(ILogger logger, Exception exception, string instanceId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Scheduled UI flush drained {RuntimeCount} runtime(s): {SentChangeSetCount} change set(s) sent, {FailedRuntimeCount} failed.")]
        public static partial void ScheduledFlushCompleted(ILogger logger, int runtimeCount, int sentChangeSetCount, int failedRuntimeCount);
    }

    private readonly UIRuntimeStore _runtimeStore;
    private readonly Func<IUIUpdateSink> _updatesFactory;
    private readonly ILogger _logger;
    private readonly int _maxParallelFlushes;

    public UIFlushTask(UIRuntimeStore runtimeStore, Func<IUIUpdateSink> updatesFactory, ILogger logger, TimeSpan interval, int maxParallelFlushes)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(runtimeStore);
        ArgumentNullException.ThrowIfNull(updatesFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxParallelFlushes);

        _runtimeStore = runtimeStore;
        _updatesFactory = updatesFactory;
        _logger = logger;
        _maxParallelFlushes = maxParallelFlushes;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        IUIRuntime[] runtimes = _runtimeStore.GetRuntimesReadyToFlush(utcNow);

        var sentChangeSetCount = 0;
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
                try
                {
                    ServerChangeSet changes = await runtime
                        .FlushAsync(itemCancellationToken)
                        .ConfigureAwait(false);

                    // A disconnected runtime is still drained to keep its pending queue from growing, even with no one to notify.
                    if (changes.IsEmpty || runtime.AttachedInstanceIds.Count == 0)
                        return;

                    IUIUpdateSink updates = _updatesFactory();

                    await updates
                        .SendChangesAsync(runtime.Handle, runtime.AttachedInstanceIds, changes, itemCancellationToken)
                        .ConfigureAwait(false);

                    _ = Interlocked.Increment(ref sentChangeSetCount);
                }
                catch (OperationCanceledException) when (itemCancellationToken.IsCancellationRequested)
                {
                    throw;
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
            var sent = Volatile.Read(ref sentChangeSetCount);
            var failed = Volatile.Read(ref failedRuntimeCount);

            if (sent > 0 || failed > 0)
                Log.ScheduledFlushCompleted(_logger, runtimes.Length, sent, failed);
        }
    }
}
