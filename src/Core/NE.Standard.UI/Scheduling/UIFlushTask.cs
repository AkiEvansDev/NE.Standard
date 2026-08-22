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

    public int LastFlushedRuntimeCount { get; private set; }
    public int LastSentChangeSetCount { get; private set; }
    public int LastFailedRuntimeCount { get; private set; }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        IUIRuntime[] runtimes = _runtimeStore.GetRuntimesReadyToFlush(utcNow);

        var sentChangeSetCount = 0;
        var failedRuntimeCount = 0;

        LastFlushedRuntimeCount = runtimes.Length;
        LastSentChangeSetCount = 0;
        LastFailedRuntimeCount = 0;

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

                    // A disconnected runtime is still drained — that is what keeps its pending queue from
                    // growing for the whole retention window — but there is nobody to send to, and a reattach
                    // rebuilds the client from scratch anyway.
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
            LastSentChangeSetCount = Volatile.Read(ref sentChangeSetCount);
            LastFailedRuntimeCount = Volatile.Read(ref failedRuntimeCount);
        }
    }
}
