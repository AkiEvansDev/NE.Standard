using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Web;

internal sealed class DemoAppWebStartup : WebStartupBase<DemoAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
        => DemoAppWebServices.Register(services);
}
