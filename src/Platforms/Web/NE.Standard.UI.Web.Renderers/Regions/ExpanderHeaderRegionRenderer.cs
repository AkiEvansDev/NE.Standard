using NE.Standard.UI.Components.BuiltIns.Regions;

namespace NE.Standard.UI.Web.Renderers.Regions;

public sealed class ExpanderHeaderRegionRenderer : TextRegionRendererBase
{
    public override string ComponentTypeKey => ExpanderHeaderRegion.ComponentTypeKey;

    protected override string ClassName => "ui-expander__header-region";
}
