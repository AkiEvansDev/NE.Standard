using System;
using System.Collections.Generic;
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
    private readonly Func<string, CancellationToken, Task<int>> _endRemoved;
    private readonly ILogger _logger;
    private readonly UISessionOptions _options;

    /// <summary>Sweeps idle sessions out of the store, ending each through <paramref name="endRemoved"/> — its files and its open pages.</summary>
    public UISessionCleanupTask(Func<IUserSessionStore> storeFactory, Func<string, CancellationToken, Task<int>> endRemoved, ILogger logger, TimeSpan interval, UISessionOptions options)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(storeFactory);
        ArgumentNullException.ThrowIfNull(endRemoved);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(options);

        options.Validate();

        _storeFactory = storeFactory;
        _endRemoved = endRemoved;
        _logger = logger;
        _options = options;
    }

    public override async ValueTask ExecuteAsync(DateTime utcNow, CancellationToken cancellationToken)
    {
        IReadOnlyList<string> removed = await _storeFactory()
            .CleanupAsync(utcNow, _options, cancellationToken)
            .ConfigureAwait(false);

        if (removed.Count == 0)
            return;

        // Its files rather than waiting out their own retention, and a page still open under one — idle, its connection alive.
        for (var i = 0; i < removed.Count; i++)
            _ = await _endRemoved(removed[i], cancellationToken).ConfigureAwait(false);

        Log.SessionsRemoved(_logger, removed.Count);
    }
}
