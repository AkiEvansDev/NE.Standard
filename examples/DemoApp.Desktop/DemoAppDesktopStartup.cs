using System;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Desktop;

internal sealed class DemoAppDesktopStartup : DesktopStartupBase<DemoAppStartup>
{
    protected override void ConfigureHost(DesktopHostOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        options.WindowTitle = "NE.Standard — DemoApp";
        options.InitialWidth = 1400;
        options.InitialHeight = 880;
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        _ = services.AddSystemNotifications();
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, DemoIcons.All());
    }
}
