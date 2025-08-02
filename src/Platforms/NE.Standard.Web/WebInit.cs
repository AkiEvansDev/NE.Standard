using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Server.Circuits;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Web.Context;
using NE.Standard.Web.Renderer;
using NE.Standard.Web.Renderer.UI;
using System.Collections.Concurrent;

namespace NE.Standard.Web;

public static class WebInit
{
    public static void InitBuilder<TApp, TContext>(WebApplicationBuilder builder)
        where TApp : NEApp
        where TContext : SessionContext
    {
        builder.Services.AddRazorComponents()
            .AddInteractiveServerComponents()
            .AddHubOptions(options =>
            {
                options.ClientTimeoutInterval = TimeSpan.FromMinutes(10);
                options.HandshakeTimeout = TimeSpan.FromSeconds(30);
                options.KeepAliveInterval = TimeSpan.FromSeconds(15);
            });

        builder.Services.AddSingleton<ConcurrentDictionary<string, ISessionContext>>();
        builder.Services.AddScoped<ISessionContextProvider, SessionContextProvider<TContext>>();

        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IPlatformBridge, BlazorPlatformBridge>();
        builder.Services.AddScoped<CircuitHandler, CookieAwareCircuitHandler>();
        builder.Services.AddScoped<JsInteropHandler>();

        builder.Services.AddSingleton<INEApp, TApp>();

        WebRendererRegistry.RegisterRenderer<GridArea, GridRenderer>();
        WebRendererRegistry.RegisterRenderer<LabelBlock, LabelRenderer>();
        WebRendererRegistry.RegisterRenderer<ButtonBlock, ButtonRenderer>();
    }

    public static void InitApp(WebApplication app)
    {
        app.UseMiddleware<SessionCookieMiddleware>();

        app.UseRouting();
        app.UseAntiforgery();

        app.MapStaticAssets();
        app.MapRazorComponents<App>()
            .AddInteractiveServerRenderMode();
    }
}
