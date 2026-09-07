using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Tabs;

/// <summary>
/// One strip over three fixed pages, and every property that can be bound to it.
/// </summary>
internal sealed partial class TabsMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TabsGroupContext TabsGroup { get; set; } = new();

    [UICommand]
    public void CycleTabsGroupOption(string id)
        => TabsGroup.CycleOption(id);
}
