using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Files;

namespace NE.Standard.UI.Scheduling;

/// <summary>
/// Sweeps staged upload and download content past its retention.
/// </summary>
/// <remarks>
/// The store is resolved per run rather than captured, for the same reason the session sweep does it: the
/// store is registered after this task is constructed.
/// </remarks>
internal sealed partial class UIFileCleanupTask : RuntimeScheduledTask
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Removed {Count} staged file(s) past retention.")]
        public static partial void FilesRemoved(ILogger logger, int count);
    }

    private readonly Func<IUIFileStore> _storeFactory;
    private readonly ILogger _logger;
    private readonly TimeSpan _uploadRetention;
    private readonly TimeSpan _downloadRetention;

    public UIFileCleanupTask(Func<IUIFileStore> storeFactory, ILogger logger, TimeSpan interval, TimeSpan uploadRetention, TimeSpan downloadRetention)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(storeFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(uploadRetention.Ticks);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(downloadRetention.Ticks);

        _storeFactory = storeFactory;
        _logger = logger;
        _uploadRetention = uploadRetention;
        _downloadRetention = downloadRetention;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        var removed = await _storeFactory()
            .CleanupAsync(utcNow, _uploadRetention, _downloadRetention, cancellationToken)
            .ConfigureAwait(false);

        if (removed > 0)
            Log.FilesRemoved(_logger, removed);
    }
}
