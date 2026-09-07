using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Contents.Text;

/// <summary>
/// One text component, and every property that can be bound to it.
/// </summary>
internal sealed partial class TextMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Two-factor authentication", "Adds a second step when signing in from a new device.");

    [RecursiveMember]
    public partial TextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleLayoutOption(string id)
        => LayoutGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);
}
