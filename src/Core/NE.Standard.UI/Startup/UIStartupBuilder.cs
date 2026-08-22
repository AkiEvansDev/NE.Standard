using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Startup;

/// <summary>
/// Provides helpers for running UI startup configuration.
/// </summary>
public static class UIStartupBuilder
{
    /// <summary>
    /// Creates the specified startup type and runs its UI configuration pipeline.
    /// </summary>
    public static void Configure<TStartup>(IServiceCollection services)
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);

        UIStartupBase startup = new TStartup();

        startup.Configure(services);
    }

    internal static void Configure<TStartup>(IServiceCollection services, UIApplicationBuilder application)
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);

        UIStartupBase startup = new TStartup();

        startup.Configure(services, application);
    }
}
