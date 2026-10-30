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

    /// <summary>
    /// Creates the specified startup type and runs its UI configuration pipeline, then <paramref name="configureApplication"/> on its
    /// application builder before it is built: the routes and options a test or a tool adds over the application's own.
    /// </summary>
    public static void Configure<TStartup>(IServiceCollection services, Action<UIApplicationBuilder> configureApplication)
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configureApplication);

        UIStartupBase startup = new TStartup();

        startup.Configure(services, configureApplication);
    }
}
