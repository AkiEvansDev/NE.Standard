namespace DemoApp.Views.Design.Presets;

/// <summary>A line in its role: a title, a paragraph, a quote, a person.</summary>
internal sealed class PresetsTextView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets.text";

    protected override string CurrentTabUrl => "/design/presets/text";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIText — a line in its role"))
            .AddChildren(DemoUI.CreateColumns([CreateRolesGroup(), CreateBadgesGroup()], [CreateProseGroup(), CreateRoleExtensionsGroup()]))
            .AddChild(CreateQuoteGroup())
            .AddChild(CreatePersonGroup());
    }
}
