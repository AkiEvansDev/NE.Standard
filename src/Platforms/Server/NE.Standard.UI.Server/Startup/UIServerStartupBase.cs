#pragma warning disable IDE0130 // Public Server entry point namespace while transport internals keep NE.Standard.UI.Web.Hosting.

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Logging;
using NE.Standard.UI.Web.Services;

namespace NE.Standard.UI.Server.Startup;

/// <summary>
/// Base startup class for headless API-only <c>NE.Standard</c> server hosts serving remote <c>NE.Standard.UI.Client</c> applications
/// without HTML shell rendering or browser asset tasks.
/// </summary>
public abstract class UIServerStartupBase<TStartup>
    where TStartup : UIStartupBase, new()
{
    /// <summary>Configures the host's services and the underlying <typeparamref name="TStartup"/> application.</summary>
    public void Configure(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        WebServerRegistration.ConfigureOptions(services);

        ConfigureServices(services);
        WebServerRegistration.ConfigureDefaults(services);

        UIStartupBuilder.Configure<TStartup>(services);
        UIConsoleLoggerRegistration.EnsureConsoleProviderIfEnabled(services);
    }

    /// <summary>Configures additional host-specific services before the default server services are added.</summary>
    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);
}

internal static class WebServerRegistration
{
    public static void ConfigureOptions(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddOptions<WebEndpointOptions>();
        _ = services.AddOptions<WebValueOptions>();
        // Ahead of the application's own Configure, which so has the last word; a host with no configuration reads none.
        _ = services.AddOptions<WebHubOptions>()
            .Configure<IServiceProvider>(static (options, provider) => options.ReadConfiguration(provider.GetService<IConfiguration>()));
        _ = services.AddOptions<WebResponseCompressionOptions>();
    }

    public static void ConfigureDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        UIConsoleLoggerRegistration.RegisterDefaults(services);

        _ = services.AddResponseCompression();
        _ = services.AddOptions<BrotliCompressionProviderOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(static (options, ui) => options.Level = ui.Value.Level);
        _ = services.AddOptions<GzipCompressionProviderOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(static (options, ui) => options.Level = ui.Value.Level);
        _ = services.AddOptions<ResponseCompressionOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(static (options, ui) => options.EnableForHttps = ui.Value.EnableForHttps);

        _ = services.AddSignalR(static options =>
        {
            options.AddFilter<WebHubCallLimiter>();
            options.AddFilter<WebHubDisconnectFilter>();
            options.AddFilter<WebHubLatency>();
            options.StatefulReconnectBufferSize = 1024 * 1024;
            options.KeepAliveInterval = TimeSpan.FromSeconds(10);
            options.ClientTimeoutInterval = TimeSpan.FromSeconds(24);
        }).AddJsonProtocol();
        _ = services.AddOptions<JsonHubProtocolOptions>()
            .Configure<IServiceProvider>(static (options, provider) => WebHubProtocol.Configure(options, provider.GetService<UIApplication>()?.Security));

        services.TryAddSingleton(TimeProvider.System);
        services.TryAddSingleton<WebSessionAllowance>();
        services.TryAddSingleton<WebSessionCookie>();
        services.TryAddSingleton<WebValueStagingStore>();
        services.TryAddSingleton<WebOutgoingValues>();
        services.TryAddSingleton<WebRuntimeStamps>();
        services.TryAddSingleton<WebHubCallLimiter>();
        services.TryAddSingleton<WebHubDisconnectFilter>();
        services.TryAddSingleton<WebHubLatency>();
        services.TryAddSingleton<WebUIMetrics>();
        services.TryAddSingleton<IUIUpdateSink, StandardWebUpdateSink>();
        services.TryAddSingleton<WebSessionKeys>();
        services.TryAddSingleton<IUISessionKeyHandover>(static provider => provider.GetRequiredService<WebSessionKeys>());
        services.TryAddSingleton<IUIDownloadAddressProvider, WebDownloadAddressProvider>();
        services.TryAddSingleton<IUIContentAddressResolver>(new UIContentAddress(WebContentEndpoint.Prefix));

        services.TryAddSingleton(static provider => new UIPlatformDefaults
        {
            ReportMissingWords = provider.GetService<IHostEnvironment>()?.IsDevelopment() == true,
            ReportsToPage = provider.GetService<IHostEnvironment>()?.IsDevelopment() == true
        });
    }
}
