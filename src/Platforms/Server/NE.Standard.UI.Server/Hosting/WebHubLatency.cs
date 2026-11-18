using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Holds every hub call for <see cref="WebHubOptions.SimulatedLatency"/> before it is handled, so a developer sees the page as over a
/// slow link; nothing outside Development.
/// </summary>
internal sealed partial class WebHubLatency : IHubFilter
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "WebHubOptions.SimulatedLatency is set to {Latency} outside Development; it is a development aid and is ignored here.")]
        public static partial void Ignored(ILogger logger, TimeSpan latency);
    }

    private readonly TimeProvider _time;
    private readonly TimeSpan _latency;

    public WebHubLatency(IOptions<WebHubOptions> options, TimeProvider time, ILogger<WebHubLatency> logger, IHostEnvironment? environment = null)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(time);
        ArgumentNullException.ThrowIfNull(logger);

        TimeSpan latency = options.Value.SimulatedLatency ?? TimeSpan.Zero;

        _time = time;

        // Said once, as the filter is made: a production host slowed for every reader by a forgotten switch would be worse than none.
        if (latency > TimeSpan.Zero && environment?.IsDevelopment() != true)
        {
            Log.Ignored(logger, latency);
            latency = TimeSpan.Zero;
        }

        _latency = latency;
    }

    public ValueTask<object?> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        ArgumentNullException.ThrowIfNull(invocationContext);
        ArgumentNullException.ThrowIfNull(next);

        return _latency == TimeSpan.Zero ? next(invocationContext) : DelayedAsync(invocationContext, next);
    }

    private async ValueTask<object?> DelayedAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        await Task.Delay(_latency, _time, invocationContext.Context.ConnectionAborted).ConfigureAwait(false);

        return await next(invocationContext).ConfigureAwait(false);
    }
}
