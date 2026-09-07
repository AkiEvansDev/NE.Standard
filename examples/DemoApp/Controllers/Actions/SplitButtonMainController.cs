using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One split button, and every property that can be bound to it — the button's own, since the menu adds no property.
/// </summary>
internal sealed partial class SplitButtonMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ButtonGroupContext ButtonGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Merge", "Squash and merge into main");

    [RecursiveMember]
    public partial TextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    /// <summary>What was pressed last — the main part, or which entry — shown under the preview.</summary>
    [RecursiveMember]
    public partial string LastPress { get; set; } = "Nothing pressed yet.";

    [UICommand]
    public void Merge()
        => LastPress = "The main part: Merge.";

    [UICommand]
    public void MergeAs(string id)
        => LastPress = $"The menu: {id}.";

    [UICommand]
    public void CycleButtonOption(string id)
        => ButtonGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleLayoutOption(string id)
        => LayoutGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
