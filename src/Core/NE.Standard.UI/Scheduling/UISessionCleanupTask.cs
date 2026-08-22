using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Scheduling;

internal sealed partial class UISessionCleanupTask : RuntimeScheduledTask
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Removed {Count} idle user session(s).")]
        public static partial void SessionsRemoved(ILogger logger, int count);
    }

    private readonly Func<IUserSessionStore> _storeFactory;
    private readonly ILogger _logger;
    private readonly TimeSpan _idleTimeout;

    public UISessionCleanupTask(Func<IUserSessionStore> storeFactory, ILogger logger, TimeSpan interval, TimeSpan idleTimeout)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(storeFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(idleTimeout.Ticks);

        _storeFactory = storeFactory;
        _logger = logger;
        _idleTimeout = idleTimeout;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        var removed = await _storeFactory()
            .CleanupAsync(utcNow, _idleTimeout, cancellationToken)
            .ConfigureAwait(false);

        if (removed > 0)
            Log.SessionsRemoved(_logger, removed);
    }
}
