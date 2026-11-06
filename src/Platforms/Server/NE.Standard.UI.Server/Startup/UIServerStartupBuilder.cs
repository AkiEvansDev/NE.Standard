using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Server.Startup;

/// <summary>Configures a headless API-only <c>NE.Standard</c> server startup.</summary>
public static class UIServerStartupBuilder
{
    /// <summary>Configures <paramref name="services"/> using <typeparamref name="TServerStartup"/> and <typeparamref name="TStartup"/>.</summary>
    public static void Configure<TServerStartup, TStartup>(IServiceCollection services)
        where TServerStartup : UIServerStartupBase<TStartup>, new()
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);

        TServerStartup startup = new();
        startup.Configure(services);
    }
}
