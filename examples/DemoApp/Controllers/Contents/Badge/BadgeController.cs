using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Badge;

/// <summary>
/// One badge, and every property that can be bound to it.
/// </summary>
internal sealed partial class BadgeController() : DemoStandardController
{
    [RecursiveMember]
    public partial BadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
