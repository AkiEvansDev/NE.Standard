using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Services;

internal sealed partial class StandardWebUpdateSink : IUIUpdateSink
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Sending server UI changes to {InstanceCount} connection(s), tab '{ClientTabId}'.")]
        public static partial void SendingChanges(ILogger logger, int instanceCount, string clientTabId);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Sending command result to connection '{InstanceId}', tab '{ClientTabId}'.")]
        public static partial void SendingCommandResult(ILogger logger, string instanceId, string clientTabId);
    }

    private readonly IHubContext<WebUIHub> _hub;
    private readonly ILogger<StandardWebUpdateSink> _logger;

    public StandardWebUpdateSink(IHubContext<WebUIHub> hub, ILogger<StandardWebUpdateSink> logger)
    {
        ArgumentNullException.ThrowIfNull(hub);
        ArgumentNullException.ThrowIfNull(logger);

        _hub = hub;
        _logger = logger;
    }

    public async Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(instanceIds);
        ArgumentNullException.ThrowIfNull(changes);

        handle.Instance.Validate();
        changes.Validate();

        if (instanceIds.Count == 0)
            return;

        Log.SendingChanges(_logger, instanceIds.Count, handle.Instance.TabId);

        await _hub.Clients
            .Clients([.. instanceIds])
            .SendAsync("ui.changes", changes, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(result);

        handle.Instance.Validate();
        result.Validate();

        Log.SendingCommandResult(_logger, handle.Instance.Id, handle.Instance.TabId);

        await _hub.Clients
            .Client(handle.Instance.Id)
            .SendAsync("ui.commandResult", result, cancellationToken)
            .ConfigureAwait(false);
    }
}
