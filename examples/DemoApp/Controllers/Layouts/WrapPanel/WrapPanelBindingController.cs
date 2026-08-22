using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.WrapPanel;

internal sealed partial class WrapPanelGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial double HorizontalGap { get; set; } = 8d;

    [RecursiveMember]
    public partial double VerticalGap { get; set; } = 8d;

    public void CycleHorizontalGap()
        => SetLastChange(nameof(HorizontalGap), HorizontalGap = CycleValue(HorizontalGap, 0d, 8d, 16d, 24d));

    public void CycleVerticalGap()
        => SetLastChange(nameof(VerticalGap), VerticalGap = CycleValue(VerticalGap, 0d, 8d, 16d, 24d));
}

internal sealed partial class WrapPanelBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial WrapPanelGroupContext WrapPanelGroup { get; set; } = new();

    [UICommand]
    public void CycleHorizontalGap()
        => WrapPanelGroup.CycleHorizontalGap();

    [UICommand]
    public void CycleVerticalGap()
        => WrapPanelGroup.CycleVerticalGap();
}
