using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Server.Circuits;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design;
using NE.Standard.Design.Data;
using NE.Standard.Web.Context;
using System.Collections.Concurrent;

namespace NE.Standard.Web;

public static class WebInit
{
    public static void InitBuilder<TApp, TContextProvider>(WebApplicationBuilder builder)
        where TApp : NEApp
        where TContextProvider : class, INEDataContextProvider
    {
        builder.Services.AddRazorComponents()
            .AddInteractiveServerComponents();

        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<INEDataContextProvider, TContextProvider>();
        builder.Services.AddScoped<IClientBridge, BlazorClientBridge>();
        builder.Services.AddSingleton<ConcurrentDictionary<string, IInternalDataContext>>();
        builder.Services.AddScoped<CircuitHandler, CookieAwareCircuitHandler>();
        builder.Services.AddScoped<IInternalDataContextProvider, CurrentContextProvider>();

        builder.Services.AddSingleton<IInternalApp, TApp>();
    }

    public static void InitApp(WebApplication app)
    {
        app.UseMiddleware<UserIdCookieMiddleware>();

        app.UseRouting();
        app.UseAntiforgery();

        app.MapStaticAssets();
        app.MapRazorComponents<App>()
            .AddInteractiveServerRenderMode();
    }
}
