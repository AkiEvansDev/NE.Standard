using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Web.Icons.Lucide;
using NE.Standard.UI.Web.Renderers.DI;
using NE.Standard.UI.Web.Startup;

namespace DemoApp.Web;

internal sealed class DemoAppWebStartup : WebStartupBase<DemoAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddLucideWebIcons();
    }
}
