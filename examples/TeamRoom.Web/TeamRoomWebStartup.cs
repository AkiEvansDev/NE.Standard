using System;
using Microsoft.Extensions.DependencyInjection;

namespace TeamRoom.Web;

internal sealed class TeamRoomWebStartup : WebStartupBase<TeamRoomStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Fill | MaterialIconStyle.Outlined, AppIcons.All());
    }
}
