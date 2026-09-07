using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Shell.Files;
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

        _ = services.AddOptions<WebViewRenderCacheOptions>();
        _ = services.AddOptions<WebEndpointOptions>();
        _ = services.AddOptions<WebResponseCompressionOptions>();

        ConfigureServices(services);
        ConfigureDefaults(services);

        UIStartupBuilder.Configure<TStartup>(services);
    }

    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);

    private static void ConfigureDefaults(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        // Registered whether or not it is switched on: an unused registration costs nothing.
        _ = services.AddResponseCompression();
        _ = services.AddOptions<BrotliCompressionProviderOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(static (options, ui) => options.Level = ui.Value.Level);
        _ = services.AddOptions<GzipCompressionProviderOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(static (options, ui) => options.Level = ui.Value.Level);
        _ = services.AddOptions<ResponseCompressionOptions>()
            .Configure<IOptions<WebResponseCompressionOptions>>(
                static (options, ui) => options.EnableForHttps = ui.Value.EnableForHttps
            );

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
        services.TryAddSingleton<IUIDownloadAddressProvider, WebDownloadAddressProvider>();
        services.TryAddSingleton<IUIContentAddressResolver>(new UIContentAddress(WebContentEndpoint.Prefix));
    }
}
