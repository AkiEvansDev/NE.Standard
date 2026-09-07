using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Container;

/// <summary>
/// The grid everything else is placed in, and every property that can be bound to it.
/// </summary>
internal sealed partial class ContainerMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ContainerGroupContext ContainerGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleContainerGroupOption(string id)
        => ContainerGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderGroupOption(string id)
        => BorderGroup.CycleOption(id);
}
