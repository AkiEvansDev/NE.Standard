using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Application;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Testing;

/// <summary>A host built for a test, and what it was built from.</summary>
internal sealed record UITestBuiltHost(ServiceProvider Services, UIApplication Application, UIHost Host);

/// <summary>
/// Builds a host from an application's startup as <see cref="UIStartupBase"/> does, with no platform under it and its scheduler
/// parked, so nothing drains a runtime between a test's own steps.
/// </summary>
internal static class UITestHostBuilder
{
    [SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "The host is handed over in the result, whose owner disposes it.")]
    public static UITestBuiltHost Build<TStartup>(Action<IServiceCollection>? beforeStartup, Action<IServiceCollection>? configureServices, Action<UIApplicationBuilder>? configureApplication, Func<IServiceProvider, ILogger<UIHost>> createLogger)
        where TStartup : UIStartupBase, new()
    {
        ArgumentNullException.ThrowIfNull(createLogger);

        ServiceCollection services = new();
        UIApplicationBuilder applicationBuilder = new();

        // Ahead of the startup, whose check for the services a platform brings would otherwise refuse an application that has none.
        beforeStartup?.Invoke(services);

        UIStartupBuilder.Configure<TStartup>(services, applicationBuilder);

        // The scheduler is parked at an hour so a background drain cannot race a command's own change set.
        _ = applicationBuilder.ConfigurePersistence(static persistence =>
        {
            persistence.FlushSchedulerInterval = TimeSpan.FromHours(1);
            persistence.CleanupInterval = TimeSpan.FromHours(1);
        });

        configureServices?.Invoke(services);
        configureApplication?.Invoke(applicationBuilder);

        // As the startup registers them; the host is built after the container here.
        UIHost? built = null;
        UIStartupBase.AddHostServices(services, _ => built ?? throw new InvalidOperationException("The test host is not built yet."));

        UIApplication application;

        using (ServiceProvider bootstrapProvider = services.BuildServiceProvider(validateScopes: true))
            application = applicationBuilder.Build(bootstrapProvider);

        _ = services.AddSingleton(application);

        ServiceProvider provider = services.BuildServiceProvider(validateScopes: true);
        UIHost host = new(application, provider, createLogger(provider));

        built = host;

        return new UITestBuiltHost(provider, application, host);
    }
}
