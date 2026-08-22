using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.StackPanel;

internal sealed partial class StackPanelGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial UIOrientation Orientation { get; set; } = UIOrientation.Horizontal;

    [RecursiveMember]
    public partial double Spacing { get; set; } = 8d;

    [RecursiveMember]
    public partial bool Wrap { get; set; }

    [RecursiveMember]
    public partial UIOverflow Overflow { get; set; } = UIOverflow.Hidden;

    public void CycleOrientation()
        => SetLastChange(nameof(Orientation), Orientation = CycleEnum(Orientation));

    public void CycleSpacing()
        => SetLastChange(nameof(Spacing), Spacing = CycleValue(Spacing, 0d, 8d, 16d, 24d));

    public void ToggleWrap()
        => SetLastChange(nameof(Wrap), Wrap = !Wrap);

    public void CycleOverflow()
        => SetLastChange(nameof(Overflow), Overflow = CycleEnum(Overflow));
}

internal sealed partial class StackPanelBindingController() : DemoBindingController
{
    [RecursiveMember]
    public partial StackPanelGroupContext StackPanelGroup { get; set; } = new();

    [UICommand]
    public void CycleOrientation()
        => StackPanelGroup.CycleOrientation();

    [UICommand]
    public void CycleSpacing()
        => StackPanelGroup.CycleSpacing();

    [UICommand]
    public void ToggleWrap()
        => StackPanelGroup.ToggleWrap();

    [UICommand]
    public void CycleOverflow()
        => StackPanelGroup.CycleOverflow();
}
