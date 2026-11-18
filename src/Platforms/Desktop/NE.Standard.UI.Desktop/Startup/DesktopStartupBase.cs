using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Application;
using NE.Standard.UI.Desktop.Hosting;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Rendering;
using NE.Standard.UI.Web.Startup;

namespace NE.Standard.UI.Desktop.Startup;

/// <summary>Base class for configuring a WebView2 desktop application backed by <typeparamref name="TStartup"/>.</summary>
public abstract class DesktopStartupBase<TStartup> : WebStartupBase<TStartup>
    where TStartup : UIStartupBase, new()
{
    private const long DefaultDesktopMaxFileBytes = 4L * 1024 * 1024 * 1024;
    private const long DefaultDesktopSessionTransferBytes = 16L * 1024 * 1024 * 1024;
    private const int DefaultDesktopMaxFilesPerSelection = 128;

    /// <summary>Configures desktop host options such as window size, title, mode, and static asset paths.</summary>
    protected internal virtual void ConfigureHost(DesktopHostOptions options)
        => ArgumentNullException.ThrowIfNull(options);

    internal static (UITheme Theme, string? Icon) ReadShellDefaults()
        => UIStartupBuilder.ReadShellDefaults<TStartup>();

    internal void ConfigureDesktop(IServiceCollection services, DesktopHostOptions options, DesktopRemoteApplicationDefaults remoteDefaults)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(remoteDefaults);

        if (options.Mode == DesktopHostMode.InProcess)
        {
            // Loopback over localhost gains nothing from Brotli/Gzip and saves cold-start asset precompression CPU.
            _ = services.Configure<WebResponseCompressionOptions>(static compression => compression.Enabled = false);
            Configure(services);
            ApplyInProcessDefaults(services);
        }
        else
        {
            _ = services.AddSingleton(remoteDefaults);
        }
    }

    private static void ApplyInProcessDefaults(IServiceCollection services)
    {
        for (var i = 0; i < services.Count; i++)
        {
            ServiceDescriptor descriptor = services[i];
            if (descriptor.ServiceType == typeof(IWebViewRenderCache) && descriptor.ImplementationType == typeof(FileSystemWebViewRenderCache))
            {
                services[i] = ServiceDescriptor.Singleton<IWebViewRenderCache, InMemoryWebViewRenderCache>();
            }
            else if (descriptor.ServiceType == typeof(UIPlatformDefaults) && descriptor.ImplementationFactory is not null)
            {
                services[i] = ServiceDescriptor.Singleton(static provider => new UIPlatformDefaults
                {
                    ReportMissingWords = provider.GetService<IHostEnvironment>()?.IsDevelopment() == true,
                    ReportsToPage = provider.GetService<IHostEnvironment>()?.IsDevelopment() == true,
                    ConfigureDefaultFiles = SeedDesktopFileDefaults
                });
            }
        }
    }

    private static void SeedDesktopFileDefaults(UIFileOptions files)
    {
        files.MaxFileSize = DefaultDesktopMaxFileBytes;
        files.MaxFilesPerSelection = DefaultDesktopMaxFilesPerSelection;
        files.MaxUploadBytesPerSession = DefaultDesktopSessionTransferBytes;
        files.MaxUploadBytesTotal = null;
        files.MaxDownloadBytesPerSession = DefaultDesktopSessionTransferBytes;
        files.MaxDownloadBytesTotal = null;
    }
}
