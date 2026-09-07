using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Hosting;

namespace NE.Standard.UI.Scheduling;

internal sealed partial class UIRuntimeCleanupTask : RuntimeScheduledTask
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "UI runtime cleanup failed.")]
        public static partial void ScheduledCleanupFailed(ILogger logger, Exception exception);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "UI runtime cleanup removed {RemovedCount} runtime(s).")]
        public static partial void ScheduledCleanupCompleted(ILogger logger, int removedCount);
    }

    private readonly UIRuntimeStore _store;
    private readonly ILogger _logger;
    private readonly TimeSpan _retention;

    public UIRuntimeCleanupTask(UIRuntimeStore store, ILogger logger, TimeSpan interval, TimeSpan retention)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(logger);

        if (retention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(retention), retention, "Retention cannot be negative.");

        _store = store;
        _logger = logger;
        _retention = retention;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        try
        {
            // Logged rather than kept on the task: nothing holds the instance to read a property from.
            var removed = await _store
                .CleanupAsync(utcNow, _retention)
                .ConfigureAwait(false);

            Log.ScheduledCleanupCompleted(_logger, removed);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            Log.ScheduledCleanupFailed(_logger, exception);
        }
    }
}
