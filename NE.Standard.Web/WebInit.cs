using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NE.Standard.Web;

public static class WebInit
{
    public static void InitBuilder<TApp>(WebApplicationBuilder builder)
        where TApp : class, IUIApp
    {
        builder.Services
            .AddRazorComponents()
            .AddInteractiveServerComponents();

        builder.Services.AddSingleton<IUIApp, TApp>();
        builder.Services.AddScoped<BindingContext>();
    }

    public static void InitApp(WebApplication app)
    {
        app.UseRouting();
        app.UseAntiforgery();
        app.MapRazorComponents<AppHost>();
    }
}
