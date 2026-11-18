using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Web.Startup;

/// <summary>Registers a <see cref="WebStartupBase{TStartup}"/> and its <see cref="UIStartupBase"/> into DI.</summary>
public static class WebStartupBuilder
{
    /// <summary>Configures web host services and the underlying UI application on <paramref name="services"/>.</summary>
    public static void Configure<TWebStartup, TStartup>(IServiceCollection services)
        where TWebStartup : WebStartupBase<TStartup>, new()
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);

        TWebStartup startup = new();

        startup.Configure(services);
    }
}
