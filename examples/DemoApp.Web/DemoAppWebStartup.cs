using System;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Web;

internal sealed class DemoAppWebStartup : WebStartupBase<DemoAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        // Only the glyphs the demo names, in both drawings: registering a whole Material style costs megabytes.
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, DemoIcons.All());
    }
}
