using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NE.Standard.UI.Application;
using NE.Standard.UI.Files;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Localization;
using NE.Standard.UI.Security;
using NE.Standard.UI.Sessions;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;

namespace NE.Standard.UI.Startup;

/// <summary>
/// Base class for configuring UI services, application routes, persistence, localization, and theme tokens.
/// </summary>
public abstract class UIStartupBase
{
    /// <summary>
    /// Runs startup configuration, applies default services, and validates required UI services.
    /// </summary>
    public void Configure(IServiceCollection services)
    {
        UIApplicationBuilder application = new();

        Configure(services, application);

        using ServiceProvider provider = services.BuildServiceProvider(validateScopes: true);
        UIApplication app = application.Build(provider);

        _ = services.AddSingleton(app);
        _ = services.AddSingleton<IUIHost, UIHost>();
    }

    internal void Configure(IServiceCollection services, UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(application);

        ConfigureServices(services);
        ConfigureApplication(application);
        ConfigureDefaults(services);
        ValidateRequiredServices(services);
    }

    /// <summary>
    /// Configures dependency injection services for the UI application.
    /// </summary>
    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);

    /// <summary>
    /// Configures UI application routes, persistence, localization, and theme tokens.
    /// </summary>
    protected virtual void ConfigureApplication(UIApplicationBuilder application)
        => ArgumentNullException.ThrowIfNull(application);

    private static void ConfigureDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        services.TryAddSingleton<IUserSessionStore, InMemoryUserSessionStore>();
        services.TryAddSingleton<IUIFileStore, FileSystemUIFileStore>();
        services.TryAddSingleton<IUserSessionResolver, StoredUserSessionResolver>();
        services.TryAddSingleton<IUserClaimsMapper, StandardUserClaimsMapper>();
        services.TryAddSingleton<IAuthorizationService, StandardAuthorizationService>();
        services.TryAddSingleton<IResolveExceptionViewHandler, StandardResolveExceptionViewHandler>();
        services.TryAddSingleton<ITranslator>(static provider => new UITranslationRegistry(sources: [.. provider.GetServices<ITranslationSource>()]));
    }

    private static void ValidateRequiredServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = ServiceRequirement.Validate(services)
            .Required<IUserSessionStore>()
            .Required<IUIFileStore>()
            .Required<IUserSessionResolver>()
            .Required<IUserClaimsMapper>()
            .Required<IAuthorizationService>()
            .Required<IResolveExceptionViewHandler>()
            .Required<IUIUpdateSink>()
            .Required<IUIDialogService>()
            .Required<IUIDownloadService>()
            .Required<IUIUploadService>()
            .Required<ITranslator>();
    }
}
