using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Actions;

/// <summary>
/// One button, and every property that can be bound to it.
/// </summary>
internal sealed partial class ButtonController() : DemoStandardController
{
    [RecursiveMember]
    public partial ButtonGroupContext ButtonGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Restart", "Graceful restart of api-eu-west-1");

    [RecursiveMember]
    public partial TextLayoutGroupContext LayoutGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

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
