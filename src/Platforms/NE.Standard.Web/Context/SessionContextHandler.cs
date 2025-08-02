using Microsoft.AspNetCore.Components.Server.Circuits;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design.Data;
using NE.Standard.Extensions;
using System.Collections.Concurrent;

namespace NE.Standard.Web.Context;

internal class SessionCookieMiddleware(RequestDelegate next)
{
    public const string COOKIE_NAME = "ne-user";

    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Cookies.ContainsKey(COOKIE_NAME))
        {
            var userId = Guid.NewGuid().ToString();

            context.Response.Cookies.Append(COOKIE_NAME, userId, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(1)
            });
        }

        await _next(context);
    }
}

internal class CookieAwareCircuitHandler(
    ISessionContextProvider contextProvider,
    IPlatformBridge bridge,
    ConcurrentDictionary<string, ISessionContext> contextStore
) : CircuitHandler
{
    private readonly ISessionContextProvider _contextProvider = contextProvider;
    private readonly IPlatformBridge _bridge = bridge;
    private readonly ConcurrentDictionary<string, ISessionContext> _contextStore = contextStore;

    public override Task OnCircuitOpenedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        var context = _contextProvider.GetCurrentSessionContext();
        if (context == null) return Task.CompletedTask;

        context.CircuitId = circuit.Id;
        context.Bridge = _bridge;

        return Task.CompletedTask;
    }

    public override Task OnCircuitClosedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        var match = _contextStore.FirstOrDefault(u => u.Value.CircuitId == circuit.Id);
        if (!match.Key.IsNull())
        {
            _contextStore.TryRemove(match.Key, out var removed);
            removed?.Dispose();
        }

        return Task.CompletedTask;
    }
}

internal class SessionContextProvider<T>(
    IHttpContextAccessor httpContextAccessor,
    ConcurrentDictionary<string, ISessionContext> contextStore,
    IServiceProvider serviceProvider
) : ISessionContextProvider
    where T : class, ISessionContext
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly ConcurrentDictionary<string, ISessionContext> _contextStore = contextStore;
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public ISessionContext? GetCurrentSessionContext()
    {
        var id = _httpContextAccessor.HttpContext?.Request.Cookies[SessionCookieMiddleware.COOKIE_NAME];
        if (id != null)
            return _contextStore.GetOrAdd(id, _ => ActivatorUtilities.CreateInstance<T>(_serviceProvider));

        return null;
    }
}