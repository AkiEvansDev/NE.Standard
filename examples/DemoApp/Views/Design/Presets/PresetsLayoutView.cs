namespace DemoApp.Views.Design.Presets;

/// <summary>The arrangements: a stack, columns, a split, a sidebar, a board and panes.</summary>
internal sealed class PresetsLayoutView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.layout";

    protected override string CurrentTabUrl => "/design/presets/layout";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UILayout — the arrangements"))
            .AddChildren(DemoUI.CreateColumns([CreateStackGroup()], [CreateColumnsGroup()]))
            .AddChild(CreateSplitGroup())
            .AddChild(CreateSidebarGroup())
            .AddChildren(DemoUI.CreateColumns([CreateEndsGroup()], [CreateBoardGroup()]))
            .AddChild(CreatePanesGroup());
    }
}
