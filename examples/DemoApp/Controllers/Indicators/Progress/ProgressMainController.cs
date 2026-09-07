using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Indicators.Progress;

/// <summary>
/// One reading of how far along something is, and every property that can be bound to it.
/// </summary>
internal sealed partial class ProgressMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ProgressGroupContext ProgressGroup { get; set; } = new();

    [UICommand]
    public void CycleProgressGroupOption(string id)
        => ProgressGroup.CycleOption(id);
}
