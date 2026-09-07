using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Indicators.Spinner;

/// <summary>
/// One waiting mark, and every property that can be bound to it.
/// </summary>
internal sealed partial class SpinnerMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial SpinnerGroupContext SpinnerGroup { get; set; } = new();

    [UICommand]
    public void CycleSpinnerGroupOption(string id)
        => SpinnerGroup.CycleOption(id);
}
