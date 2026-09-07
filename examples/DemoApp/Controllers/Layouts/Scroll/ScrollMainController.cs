using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Scroll;

/// <summary>
/// One viewport, and every property that can be bound to it.
/// </summary>
internal sealed partial class ScrollMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ScrollGroupContext ScrollGroup { get; set; } = new();

    [UICommand]
    public void CycleScrollGroupOption(string id)
        => ScrollGroup.CycleOption(id);
}
