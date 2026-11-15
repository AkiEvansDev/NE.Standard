using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Desktop.Hosting;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Startup;

namespace NE.Standard.UI.Desktop.Startup;

/// <summary>Base class for configuring a WebView2 desktop application backed by <typeparamref name="TStartup"/>.</summary>
public abstract class DesktopStartupBase<TStartup> : WebStartupBase<TStartup>
    where TStartup : UIStartupBase, new()
{
    /// <summary>Configures desktop host options such as window size, title, mode, and static asset paths.</summary>
    protected internal virtual void ConfigureHost(DesktopHostOptions options)
        => ArgumentNullException.ThrowIfNull(options);

    internal void ConfigureDesktop(IServiceCollection services, DesktopHostOptions options)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(options);

        if (options.Mode == DesktopHostMode.InProcess)
            Configure(services);
        else
            ConfigureServices(services);
    }
}
