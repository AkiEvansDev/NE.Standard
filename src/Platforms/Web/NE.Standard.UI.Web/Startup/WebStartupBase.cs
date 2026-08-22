using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Assets;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Rendering;
using NE.Standard.UI.Web.Services;

namespace NE.Standard.UI.Web.Startup;

public abstract class WebStartupBase<TStartup>
    where TStartup : UIStartupBase, new()
{
    public void Configure(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddOptions<WebAssetOptions>();
        _ = services.AddOptions<WebViewRenderCacheOptions>();
        _ = services.AddOptions<WebEndpointOptions>();

        ConfigureServices(services);
        ConfigureDefaults(services);

        UIStartupBuilder.Configure<TStartup>(services);
    }

    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);

    private static void ConfigureDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddSignalR().AddJsonProtocol(options =>
        {
            WebWireJson.Apply(options.PayloadSerializerOptions);
            options.PayloadSerializerOptions.Converters.Add(new ObjectToInferredTypesConverter());
        });

        services.TryAddSingleton<IWebAssetRegistry, WebAssetRegistry>();
        services.TryAddSingleton<IWebRendererRegistry, WebRendererRegistry>();
        services.TryAddSingleton<IWebViewRenderer, WebViewRenderer>();

        services.TryAddSingleton<IWebViewRenderCache, FileSystemWebViewRenderCache>();
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IHostedService, WebViewRenderCacheStartupTask>());

        services.TryAddSingleton<IUIUpdateSink, StandardWebUpdateSink>();
        services.TryAddSingleton<IUIDialogService, StandardWebDialogService>();
        services.TryAddSingleton<IUIDownloadService, StandardWebDownloadService>();
        services.TryAddSingleton<IUIUploadService, StandardWebUploadService>();

        services.TryAddSingleton<IUIDefaultErrorPagesProvider, WebUIDefaultErrorPagesProvider>();
    }
}
