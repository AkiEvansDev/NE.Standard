using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.Text;

/// <summary>
/// One text component, and every property that can be bound to it.
/// </summary>
internal sealed partial class TextController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Two-factor authentication", "Adds a second step when signing in from a new device.");

    [RecursiveMember]
    public partial SelectableTextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();
}
