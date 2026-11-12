using System;
using System.Threading;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Testing;

/// <summary>A host built for a test, and what it was built from; the container owns the host.</summary>
internal sealed record UITestBuiltHost(ServiceProvider Services, UIApplication Application, IUIHost Host);

/// <summary>
/// Builds a host from an application's startup as <see cref="UIStartupBase"/> does, with no platform under it and its scheduler
/// parked, so nothing drains a runtime between a test's own steps.
/// </summary>
internal static class UITestHostBuilder
{
    public static UITestBuiltHost Build<TStartup>(Action<IServiceCollection>? beforeStartup, Action<IServiceCollection>? configureServices, Action<UIApplicationBuilder>? configureApplication)
        where TStartup : UIStartupBase, new()
    {
        ServiceCollection services = [];

        // Ahead of the startup, whose check for the services a platform brings would otherwise refuse an application that has none.
        beforeStartup?.Invoke(services);

        UIStartupBuilder.Configure<TStartup>(services, application =>
        {
            // No scheduled flush, a route's short interval neither, so a background drain cannot race a command's own change set.
            _ = application.ConfigurePersistence(static persistence =>
            {
                persistence.FlushSchedulerInterval = Timeout.InfiniteTimeSpan;
                persistence.CleanupInterval = TimeSpan.FromHours(1);
            });

            configureApplication?.Invoke(application);
        });

        // A host with no platform under it may have no logging: the host's log then goes nowhere.
        _ = services.AddLogging();

        configureServices?.Invoke(services);

        // Only the routes a test opens need compiling unless the startup or test set its own mode.
        services.TryAddSingleton(new UIPlatformDefaults { DefaultViewCompilationMode = UIViewCompilationMode.Lazy });

        ServiceProvider provider = services.BuildServiceProvider(validateScopes: true);

        return new UITestBuiltHost(provider, provider.GetRequiredService<UIApplication>(), provider.GetRequiredService<IUIHost>());
    }
}
