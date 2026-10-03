using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Holds each connection to <see cref="WebHubOptions"/>: a call past its budget fails alone, and the connection stays open.
/// </summary>
/// <remarks>
/// Every hub call is counted, the attach included: one socket can loop on any of them, and a limit at the proxy counts sockets,
/// not the calls inside one.
/// </remarks>
internal sealed partial class WebHubCallLimiter : IHubFilter
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "Connection '{ConnectionId}' called the hub faster than WebHubOptions allows ({PerSecond} a second, {Burst} at once); calls past it are refused. Refusals on this connection are not logged again.")]
        public static partial void Limited(ILogger logger, string connectionId, int perSecond, int burst);
    }

    private const string BudgetItemKey = "NE.Standard.UI.Web.CallBudget";

    private readonly TimeProvider _time;
    private readonly ILogger<WebHubCallLimiter> _logger;
    private readonly int _perSecond;
    private readonly int _burst;
    private readonly double _perTick;

    public WebHubCallLimiter(IOptions<WebHubOptions> options, TimeProvider time, ILogger<WebHubCallLimiter> logger)
    {
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(time);
        ArgumentNullException.ThrowIfNull(logger);

        WebHubOptions limits = options.Value;

        limits.Validate();

        _time = time;
        _logger = logger;
        _perSecond = limits.MaxCallsPerSecond ?? 0;
        _burst = limits.MaxCallBurst;
        _perTick = (double)_perSecond / time.TimestampFrequency;
    }

    public Task OnConnectedAsync(HubLifetimeContext context, Func<HubLifetimeContext, Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        // Made once here rather than on the first call, so a call only ever reads the connection's items.
        if (_perSecond > 0)
            context.Context.Items[BudgetItemKey] = new CallBudget(_burst, _time.GetTimestamp());

        return next(context);
    }

    public ValueTask<object?> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        ArgumentNullException.ThrowIfNull(invocationContext);
        ArgumentNullException.ThrowIfNull(next);

        if (_perSecond == 0
            || !invocationContext.Context.Items.TryGetValue(BudgetItemKey, out var value)
            || value is not CallBudget budget
            || budget.TryTake(_time.GetTimestamp(), _perTick, _burst))
        {
            return next(invocationContext);
        }

        if (budget.ClaimReport())
            Log.Limited(_logger, invocationContext.Context.ConnectionId, _perSecond, _burst);

        // A HubException's message reaches the client whatever the detailed-errors setting: the page's log says why the call failed.
        throw new HubException("Too many calls on this connection; it may go on once its allowance refills.");
    }

    /// <summary>One connection's allowance of calls: a token bucket that refills with time up to the burst.</summary>
    private sealed class CallBudget(double tokens, long at)
    {
        private readonly Lock _sync = new();
        private double _tokens = tokens;
        private long _at = at;
        private int _reported;

        public bool TryTake(long now, double perTick, int burst)
        {
            lock (_sync)
            {
                _tokens = Math.Min(burst, _tokens + ((now - _at) * perTick));
                _at = now;

                if (_tokens < 1)
                    return false;

                _tokens--;

                return true;
            }
        }

        /// <summary>Whether this is the connection's first refusal, the one to log.</summary>
        public bool ClaimReport()
            => Interlocked.Exchange(ref _reported, 1) == 0;
    }
}
