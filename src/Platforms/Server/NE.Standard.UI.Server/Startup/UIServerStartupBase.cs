using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Startup;
using NE.Standard.UI.Web.Startup;

namespace NE.Standard.UI.Server.Startup;

/// <summary>
/// Base startup class for headless API-only <c>NE.Standard</c> server hosts serving remote <c>NE.Standard.UI.Client</c> and WPF clients
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
    }

    /// <summary>Configures additional host-specific services before the default server services are added.</summary>
    protected virtual void ConfigureServices(IServiceCollection services)
        => ArgumentNullException.ThrowIfNull(services);
}
