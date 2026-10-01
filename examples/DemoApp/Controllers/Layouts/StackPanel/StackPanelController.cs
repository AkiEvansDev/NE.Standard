using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.StackPanel;

/// <summary>
/// One line of things, and every property that can be bound to it.
/// </summary>
internal sealed partial class StackPanelController() : DemoStandardController
{
    [RecursiveMember]
    public partial StackPanelGroupContext StackGroup { get; set; } = new();

    [UICommand]
    public void CycleStackGroupOption(string id)
        => StackGroup.CycleOption(id);
}
