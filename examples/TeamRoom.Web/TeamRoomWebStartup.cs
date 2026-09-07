using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Web.Icons.Material;
using NE.Standard.UI.Web.Renderers.DI;
using NE.Standard.UI.Web.Startup;

namespace TeamRoom.Web;

internal sealed class TeamRoomWebStartup : WebStartupBase<TeamRoomStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, AppIcons.All());
    }
}
