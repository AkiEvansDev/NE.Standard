using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Flyout;

/// <summary>
/// One hanging panel, and every property that can be bound to it.
/// </summary>
internal sealed partial class FlyoutMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial FlyoutGroupContext FlyoutGroup { get; set; } = new();

    [UICommand]
    public void CycleFlyoutGroupOption(string id)
        => FlyoutGroup.CycleOption(id);
}
