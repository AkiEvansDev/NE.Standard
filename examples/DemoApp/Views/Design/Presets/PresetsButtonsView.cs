namespace DemoApp.Views.Design.Presets;

/// <summary>A button in its type, the rows buttons go in, and the standard actions.</summary>
internal sealed class PresetsButtonsView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.buttons";

    protected override string CurrentTabUrl => "/design/presets/buttons";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIButtons — a button in its type, and the rows buttons go in"))
            .AddChildren(DemoUI.CreateColumns([CreateButtonTypesGroup()], [CreateToolbarGroup()]))
            .AddChild(CreatePairGroup());

        _ = container
            .AddChild(CreateHeading("UIIconButtons and UIMenuItems — the standard actions"))
            .AddChildren(DemoUI.CreateColumns([CreateIconButtonsGroup()], [CreateMenuItemsGroup()]));
    }
}
