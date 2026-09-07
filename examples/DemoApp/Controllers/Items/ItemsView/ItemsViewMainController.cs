using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Items.ItemsView;

/// <summary>
/// One template over one collection, and every property that can be bound to the host that lays it out.
/// </summary>
internal sealed partial class ItemsViewMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ItemsViewGroupContext ItemsGroup { get; set; } = new();

    [UICommand]
    public void CycleItemsGroupOption(string id)
        => ItemsGroup.CycleOption(id);
}
