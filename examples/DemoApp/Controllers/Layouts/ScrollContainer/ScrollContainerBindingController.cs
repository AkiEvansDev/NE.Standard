using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.ScrollContainer;

internal sealed partial class ScrollContainerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIScrollMode HorizontalScroll { get; set; } = UIScrollMode.Disabled;

    [RecursiveMember]
    public partial UIScrollMode VerticalScroll { get; set; } = UIScrollMode.Auto;

    public void CycleHorizontalScroll()
        => SetLastChange(nameof(HorizontalScroll), HorizontalScroll = CycleEnum(HorizontalScroll));

    public void CycleVerticalScroll()
        => SetLastChange(nameof(VerticalScroll), VerticalScroll = CycleEnum(VerticalScroll));
}

internal sealed partial class ScrollContainerBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial ScrollContainerGroupContext ScrollGroup { get; set; } = new();

    [UICommand]
    public void CycleHorizontalScroll()
        => ScrollGroup.CycleHorizontalScroll();

    [UICommand]
    public void CycleVerticalScroll()
        => ScrollGroup.CycleVerticalScroll();
}
