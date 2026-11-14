using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Link;

/// <summary>
/// One link, and every property that can be bound to it.
/// </summary>
internal sealed partial class LinkController() : DemoStandardController
{
    [RecursiveMember]
    public partial LinkGroupContext LinkGroup { get; set; } = new();

    [RecursiveMember]
    public partial LinkIconGroupContext IconGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();
}
