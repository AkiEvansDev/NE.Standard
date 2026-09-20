using NE.Standard.UI.Components.BuiltIns.Regions;

namespace NE.Standard.UI.Web.Renderers.Regions;

public sealed class TabCaptionRegionRenderer : TextRegionRendererBase
{
    public override string ComponentTypeKey => TabCaptionRegion.ComponentTypeKey;

    protected override string ClassName => "ui-tab__caption";
}
