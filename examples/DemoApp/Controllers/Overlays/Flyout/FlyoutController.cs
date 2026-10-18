using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Overlays.Flyout;

/// <summary>
/// One hanging panel, and every property that can be bound to it.
/// </summary>
internal sealed partial class FlyoutController() : DemoStandardController
{
    [RecursiveMember]
    public partial FlyoutGroupContext FlyoutGroup { get; set; } = new();
}
