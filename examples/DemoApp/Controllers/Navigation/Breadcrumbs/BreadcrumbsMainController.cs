using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Navigation.Breadcrumbs;

/// <summary>
/// One trail, and every property that can be bound to it.
/// </summary>
internal sealed partial class BreadcrumbsMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial BreadcrumbsGroupContext TrailGroup { get; set; } = new();

    [UICommand]
    public void CycleTrailGroupOption(string id)
        => TrailGroup.CycleOption(id);
}
