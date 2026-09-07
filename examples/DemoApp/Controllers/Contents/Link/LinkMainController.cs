using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Contents.Link;

/// <summary>
/// One link, and every property that can be bound to it.
/// </summary>
internal sealed partial class LinkMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial LinkGroupContext LinkGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("The rollout plan");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleLinkGroupOption(string id)
        => LinkGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
