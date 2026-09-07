using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One command bar, and every property that can be bound to it or to its buttons.
/// </summary>
internal sealed partial class CommandBarMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial CommandBarGroupContext BarGroup { get; set; } = new();

    [UICommand]
    public void CycleBarGroupOption(string id)
        => BarGroup.CycleOption(id);

    /// <summary>
    /// One command for the whole bar, told which button by its key.
    /// </summary>
    [UICommand]
    public void Press(string id)
        => BarGroup.Report($"'{id}' pressed");
}
