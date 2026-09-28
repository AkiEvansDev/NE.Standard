using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Files;
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
    private readonly Func<IUIFileStore> _filesFactory;
    private readonly ILogger _logger;
    private readonly UISessionOptions _options;

    public UISessionCleanupTask(Func<IUserSessionStore> storeFactory, Func<IUIFileStore> filesFactory, ILogger logger, TimeSpan interval, UISessionOptions options)
        : base(new RuntimeScheduledTaskOptions { Interval = interval })
    {
        ArgumentNullException.ThrowIfNull(storeFactory);
        ArgumentNullException.ThrowIfNull(filesFactory);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(options);

        options.Validate();

        _storeFactory = storeFactory;
        _filesFactory = filesFactory;
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

        // A session's uploads are reachable only through it, so they go with it rather than waiting out their own retention.
        IUIFileStore files = _filesFactory();

        for (var i = 0; i < removed.Count; i++)
            await files.RemoveSessionAsync(removed[i], cancellationToken).ConfigureAwait(false);

        Log.SessionsRemoved(_logger, removed.Count);
    }
}
