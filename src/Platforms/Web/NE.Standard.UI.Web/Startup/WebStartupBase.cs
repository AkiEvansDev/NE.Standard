using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Server.Startup;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Assets;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Logging;
using NE.Standard.UI.Web.Rendering;

namespace NE.Standard.UI.Web.Startup;

/// <summary>Base startup class for ASP.NET Core web hosts rendering HTML pages and serving live UI updates over SignalR.</summary>
public abstract class WebStartupBase<TStartup>
    where TStartup : UIStartupBase, new()
{
    /// <summary>Configures the web host's services and the underlying <typeparamref name="TStartup"/> application.</summary>
    public void Configure(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddOptions<WebViewRenderCacheOptions>();
        WebServerRegistration.ConfigureOptions(services);

        ConfigureServices(services);
        ConfigureDefaults(services);

        UIStartupBuilder.Configure<TStartup>(services);
        UIConsoleLoggerRegistration.EnsureConsoleProviderIfEnabled(services);
    }

    /// <summary>Configures additional host-specific services before the default web services are added.</summary>
    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);

    private static void ConfigureDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        WebServerRegistration.ConfigureDefaults(services);

        services.TryAddSingleton<WebAssetCompression>();
        services.TryAddSingleton<IWebAssetRegistry, WebAssetRegistry>();
        services.TryAddSingleton<IWebRendererRegistry, WebRendererRegistry>();
        services.TryAddSingleton<IWebViewRenderer, WebViewRenderer>();

        services.TryAddSingleton<IWebViewRenderCache, FileSystemWebViewRenderCache>();
        services.TryAddSingleton<IServerViewInitBindingsProvider, WebServerSeams>();
        services.TryAddSingleton<IServerThemeColorsStylesheet, WebThemeColorsStylesheet>();
        services.TryAddSingleton<IServerRenderCacheMetrics, WebRenderCacheMetrics>();
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IHostedService, WebViewRenderCacheStartupTask>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IHostedService, WebAssetCompressionStartupTask>());
    }

    private sealed class WebServerSeams(IWebViewRenderCache renderCache, IWebViewRenderer renderer) : IServerViewInitBindingsProvider
    {
        public async ValueTask<IReadOnlyList<int>> GetInitBindingIdsAsync(UIViewResolution resolution, CancellationToken cancellationToken)
        {
            if (await renderCache.GetInitBindingIdsAsync(WebViewCacheKeys.Create(resolution), cancellationToken).ConfigureAwait(false) is { } cached)
                return cached;

            WebCachedViewRender render = await WebEndpointRouteBuilderExtensions.GetOrRenderViewAsync(resolution, renderer, renderCache, cancellationToken).ConfigureAwait(false);
            return render.InitBindingIds ?? [];
        }
    }

    private sealed class WebThemeColorsStylesheet : IServerThemeColorsStylesheet
    {
        public string BuildColorsCss(UITheme theme, UIThemeColors? colors)
            => WebThemeColorsCss.For(theme, colors);
    }

    private sealed class WebRenderCacheMetrics(IServiceProvider services) : IServerRenderCacheMetrics
    {
        public long HeldCount
            => services.GetService<IWebViewRenderCache>() switch
            {
                FileSystemWebViewRenderCache disk => disk.HeldCount,
                InMemoryWebViewRenderCache memory => memory.HeldCount,
                _ => 0
            };

        public long HeldBytes
            => services.GetService<IWebViewRenderCache>() switch
            {
                FileSystemWebViewRenderCache disk => disk.HeldBytes,
                InMemoryWebViewRenderCache memory => memory.HeldBytes,
                _ => 0
            };

        public long? DiskBytesRead
            => services.GetService<IWebViewRenderCache>() is FileSystemWebViewRenderCache disk ? disk.DiskBytesRead : null;

        public long? DiskBytesWritten
            => services.GetService<IWebViewRenderCache>() is FileSystemWebViewRenderCache disk ? disk.DiskBytesWritten : null;
    }
}
