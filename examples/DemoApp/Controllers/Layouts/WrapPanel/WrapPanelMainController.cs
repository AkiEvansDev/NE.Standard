using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.WrapPanel;

/// <summary>
/// One wrapping panel, and every property that can be bound to it.
/// </summary>
internal sealed partial class WrapPanelMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial WrapPanelGroupContext WrapGroup { get; set; } = new();

    [UICommand]
    public void CycleWrapGroupOption(string id)
        => WrapGroup.CycleOption(id);
}
