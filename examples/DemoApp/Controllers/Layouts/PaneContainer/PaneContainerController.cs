using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.PaneContainer;

/// <summary>
/// What the workspace keeps for the viewer: the panes' names in the order of their places, and where each bar stands. All three come
/// back as the viewer drags, so their rows change under the preview; a step from here moves the panes and the bars on the page.
/// </summary>
internal sealed partial class PaneContainerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Layout { get; set; }

    [RecursiveMember]
    public partial double? SidePosition { get; set; }

    [RecursiveMember]
    public partial double? ToolsPosition { get; set; }

    public PaneContainerGroupContext()
    {
        AddOption(nameof(Layout), CycleLayout, () => Layout);
        AddOption(nameof(SidePosition), CycleSidePosition, () => SidePosition);
        AddOption(nameof(ToolsPosition), CycleToolsPosition, () => ToolsPosition);
    }

    public void CycleLayout()
        => SetLastChange(nameof(Layout), Layout = CycleValue(Layout, "tasks,chat,tree", "chat,tree,tasks", "tree,tasks,chat", null));

    public void CycleSidePosition()
        => SetLastChange(nameof(SidePosition), SidePosition = CycleValue(SidePosition, 0.5, 0.75, null));

    public void CycleToolsPosition()
        => SetLastChange(nameof(ToolsPosition), ToolsPosition = CycleValue(ToolsPosition, 0.25, 0.75, null));
}

internal sealed partial class PaneContainerController() : DemoStandardController
{
    [RecursiveMember]
    public partial PaneContainerGroupContext PaneGroup { get; set; } = new();

    [UICommand]
    public void CyclePaneOption(string id)
        => PaneGroup.CycleOption(id);
}
