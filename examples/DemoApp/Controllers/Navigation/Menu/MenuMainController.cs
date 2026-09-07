using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Menu;

/// <summary>
/// One menu, and every property that can be bound to it or to its entries.
/// </summary>
internal sealed partial class MenuMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial MenuGroupContext MenuGroup { get; set; } = new();

    [UICommand]
    public void CycleMenuGroupOption(string id)
        => MenuGroup.CycleOption(id);

    /// <summary>
    /// One command for the whole menu, told which entry by its key.
    /// </summary>
    [UICommand]
    public void Choose(string id)
        => MenuGroup.Report($"'{id}' chosen");
}
