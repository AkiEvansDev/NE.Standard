using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Ends a hub call quietly when its connection closed under it, so SignalR does not log a reader's navigation or closed tab as an error.
/// </summary>
internal sealed partial class WebHubDisconnectFilter : IHubFilter
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Connection '{ConnectionId}' closed while '{HubMethod}' was running.")]
        public static partial void Aborted(ILogger logger, string connectionId, string hubMethod);
    }

    private readonly ILogger<WebHubDisconnectFilter> _logger;

    public WebHubDisconnectFilter(ILogger<WebHubDisconnectFilter> logger)
    {
        ArgumentNullException.ThrowIfNull(logger);

        _logger = logger;
    }

    public ValueTask<object?> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        ArgumentNullException.ThrowIfNull(invocationContext);
        ArgumentNullException.ThrowIfNull(next);

        return AwaitAsync(invocationContext, next);
    }

    private async ValueTask<object?> AwaitAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        try
        {
            return await next(invocationContext).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (invocationContext.Context.ConnectionAborted.IsCancellationRequested)
        {
            Log.Aborted(_logger, invocationContext.Context.ConnectionId, invocationContext.HubMethodName);

            return null;
        }
    }
}
