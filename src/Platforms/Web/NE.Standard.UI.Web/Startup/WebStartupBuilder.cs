using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Web.Startup;

public static class WebStartupBuilder
{
    public static void Configure<TWebStartup, TStartup>(IServiceCollection services)
        where TWebStartup : WebStartupBase<TStartup>, new()
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);

        TWebStartup startup = new();

        startup.Configure(services);
    }
}
