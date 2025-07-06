using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design;
using NE.Standard.Design.Models;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web;

public static class WebInit
{
    public static void InitBuilder<TApp>(WebApplicationBuilder builder)
        where TApp : class, IApp
    {
        builder.Services.AddRazorComponents()
            .AddInteractiveServerComponents();

        builder.Services.AddSingleton<IApp, TApp>();
        builder.Services.AddScoped<IClientBridge, BlazorClientBridge>();
        builder.Services.AddScoped<IDataBuilder, DataBuilder>();
    }

    public static void InitApp(WebApplication app)
    {
        app.UseRouting();
        app.UseAntiforgery();

        app.MapStaticAssets();
        app.MapRazorComponents<App>()
            .AddInteractiveServerRenderMode();
    }
}
