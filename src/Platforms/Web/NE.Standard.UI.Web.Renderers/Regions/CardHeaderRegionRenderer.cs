using NE.Standard.UI.Components.BuiltIns.Regions;

namespace NE.Standard.UI.Web.Renderers.Regions;

public sealed class CardHeaderRegionRenderer : TextRegionRendererBase
{
    public override string ComponentTypeKey => CardHeaderRegion.ComponentTypeKey;

    protected override string ClassName => "ui-card__header-text";
}
