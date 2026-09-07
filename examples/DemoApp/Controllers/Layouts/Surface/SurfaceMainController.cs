using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Card;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Layouts.Surface;

/// <summary>
/// The base a card is built on, and every property that can be bound to it.
/// </summary>
/// <remarks>It reuses the card's own two group contexts: both answer the same questions.</remarks>
internal sealed partial class SurfaceMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial CardSurfaceGroupContext SurfaceGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleSurfaceOption(string id)
        => SurfaceGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
