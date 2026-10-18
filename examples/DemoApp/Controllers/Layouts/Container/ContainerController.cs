using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Container;

/// <summary>
/// The grid everything else is placed in, and every property that can be bound to it.
/// </summary>
internal sealed partial class ContainerController() : DemoStandardController
{
    [RecursiveMember]
    public partial ContainerGroupContext ContainerGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();
}
