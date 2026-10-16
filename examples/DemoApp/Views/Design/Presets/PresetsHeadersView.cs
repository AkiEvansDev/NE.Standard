namespace DemoApp.Views.Design.Presets;

/// <summary>A page's, a pane's and a strip's header, and a heading in the page.</summary>
internal sealed class PresetsHeadersView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.headers";

    protected override string CurrentTabUrl => "/design/presets/headers";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIPage — a page's, a pane's and a strip's header"))
            .AddChild(CreateHeaderGroup())
            .AddChild(CreateLeadingHeaderGroup())
            .AddChild(CreatePaneHeaderGroup())
            .AddChildren(DemoUI.CreateColumns([CreateFoldGroup(), CreateStripGroup()], [CreateBoundHeaderGroup(), CreateHeadingGroup()]));
    }
}
