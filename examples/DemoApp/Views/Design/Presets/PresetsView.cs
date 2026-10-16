namespace DemoApp.Views.Design.Presets;

/// <summary>The page's regions and a card: what a screen is cut into.</summary>
internal sealed class PresetsView : PresetsViewBase, IUIViewDefinition
{
    public static string ViewKey => "demo.design.presets";

    protected override string CurrentTabUrl => "/design/presets";

    protected override void DrawPresetsContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateHeading("UIPage — the regions of a page"))
            .AddChildren(DemoUI.CreateColumns([CreateSectionGroup(), CreateLabelledGroup()], [CreateBannerGroup(), CreateBandGroup()]))
            .AddChildren(DemoUI.CreateColumns([CreateEmptyGroup()], [CreateOutcomeGroup()]))
            .AddChild(CreateStatusGroup())
            .AddChild(CreateColumnGroup());

        _ = container
            .AddChild(CreateHeading("UICard — a card, and one alone on a page"))
            .AddChildren(DemoUI.CreateColumns([CreateCardGroup()], [CreateCenteredGroup()]));
    }
}
