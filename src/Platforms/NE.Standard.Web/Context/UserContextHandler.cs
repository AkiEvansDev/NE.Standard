using Microsoft.AspNetCore.Components.Server.Circuits;
using Microsoft.AspNetCore.Http;
using System.Collections.Concurrent;

namespace NE.Standard.Web.Context;

internal class UserIdCookieMiddleware(RequestDelegate next)
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
    IHttpContextAccessor httpContextAccessor,
    INEDataContextProvider contextProvider,
    IClientBridge bridge,
    ConcurrentDictionary<string, IInternalDataContext> contextStore
) : CircuitHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly INEDataContextProvider _contextProvider = contextProvider;
    private readonly IClientBridge _bridge = bridge;
    private readonly ConcurrentDictionary<string, IInternalDataContext> _contextStore = contextStore;

    public override Task OnCircuitOpenedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return Task.CompletedTask;

        var id = httpContext.Request.Cookies[UserIdCookieMiddleware.COOKIE_NAME];
        if (id == null) return Task.CompletedTask;

        var context = _contextStore.GetOrAdd(id, _ =>
        {
            var context = (IInternalDataContext)_contextProvider.Create(id, httpContext.Request.Cookies);
            context.Id = id;

            return context;
        });

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
            if (removed?.Model != null)
                removed.Model.Dispose();
        }

        return Task.CompletedTask;
    }
}

internal class CurrentContextProvider(
    IHttpContextAccessor httpContextAccessor,
    ConcurrentDictionary<string, IInternalDataContext> contextStore
) : IInternalDataContextProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly ConcurrentDictionary<string, IInternalDataContext> _contextStore = contextStore;

    public IInternalDataContext? GetCurrentDataContext()
    {
        var id = _httpContextAccessor.HttpContext?.Request.Cookies[UserIdCookieMiddleware.COOKIE_NAME];
        if (id != null && _contextStore.TryGetValue(id, out var context))
            return context;

        return null;
    }
}