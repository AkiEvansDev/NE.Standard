using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.WrapPanel;

/// <summary>
/// One wrapping panel, and every property that can be bound to it.
/// </summary>
internal sealed partial class WrapPanelController() : DemoStandardController
{
    [RecursiveMember]
    public partial WrapPanelGroupContext WrapGroup { get; set; } = new();

    [UICommand]
    public void CycleWrapGroupOption(string id)
        => WrapGroup.CycleOption(id);
}
