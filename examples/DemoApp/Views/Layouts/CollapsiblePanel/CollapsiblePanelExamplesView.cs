using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.CollapsiblePanel;

/// <summary>
/// The places a panel folds from: the three edges of a workspace, and a band across the top of a screen.
/// </summary>
/// <remarks>Every panel sits in a <c>UIGridUnit.Auto</c> track, which is what lets the content beside it move when it folds.</remarks>
internal sealed class CollapsiblePanelExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.collapsible-panel.examples";

    protected override string ComponentRoute => "/layouts/collapsible-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.collapsible-panel.header";
    protected override string HeaderDescription => "demo.layouts.collapsible-panel.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(CreateWorkspaceGroup(), CreateBandGroup());

    /// <summary>
    /// A workspace with three panes, each folding toward the edge it sits on.
    /// </summary>
    private static ContainerComponent CreateWorkspaceGroup()
    {
        return DemoUI.CreateGroup(null, "Three panes around a workspace",
            content => content.AddChild(new ContainerComponent()
                .SetColumn(1, UIGridUnit.Auto())
                .SetColumn(24, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .SetOverflow(UIOverflow.Hidden)
                .AddChild(CreateFilters().SetPlacement(1, 1, 1, 1))
                .AddChild(CreateWork().SetPlacement(2, 1, 22, 1))
                .AddChild(CreateDetail().SetPlacement(24, 1, 1, 1))
                .AddChild(CreateLog().SetPlacement(1, 2, 24, 1))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24
        );
    }

    private static CollapsiblePanelComponent CreateFilters()
        => new CollapsiblePanelComponent("demo-workspace-filters")
            .SetSide(UISide.Left)
            .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
            .SetPadding(UIThickness.Uniform(12))
            .SetWidth(UILayoutLength.Absolute(220))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new TextComponent().SetTitle("Filters").SetTitleType(UITextAppearance.Overline).SetTitleColor(UIThemeColor.Muted))
                .AddChild(new SwitchComponent().SetTitle("Only failures").SetValue(true))
                .AddChild(new SwitchComponent().SetTitle("Include retries"))
                .AddChild(new SwitchComponent().SetTitle("Last 24 hours").SetValue(true))
            );

    private static SurfaceComponent CreateWork()
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetContent(new ParagraphComponent()
                .SetTitle("Deploy #4821")
                .SetDescription("The work sits between the panes and takes whatever room they give back. Fold the filters and it grows to the left; fold the detail and it grows to the right; fold the log and it grows down.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    private static CollapsiblePanelComponent CreateDetail()
        => new CollapsiblePanelComponent("demo-workspace-detail")
            .SetSide(UISide.Right)
            .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
            .SetPadding(UIThickness.Uniform(12))
            .SetWidth(UILayoutLength.Absolute(240))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new TextComponent().SetTitle("Detail").SetTitleType(UITextAppearance.Overline).SetTitleColor(UIThemeColor.Muted))
                .AddChild(new TextComponent().SetTitle("Started by").SetDescription("Release bot"))
                .AddChild(new TextComponent().SetTitle("Region").SetDescription("eu-west-1"))
                .AddChild(new TextComponent().SetTitle("Duration").SetDescription("4 min 12 s"))
            );

    private static CollapsiblePanelComponent CreateLog()
        => new CollapsiblePanelComponent("demo-workspace-log")
            .SetSide(UISide.Bottom)
            .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(4)
                .AddChild(new TextComponent().SetTitle("Log").SetTitleType(UITextAppearance.Overline).SetTitleColor(UIThemeColor.Muted))
                .AddChild(new TextComponent().SetTitle("12:04:10  pulled image payments-api:4821").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:04:31  migrations applied (3)").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:08:22  health check passed").SetTitleType(UITextAppearance.Caption))
            );

    /// <summary>
    /// A band across the top that folds upward, with its switch under the band at its start.
    /// </summary>
    private static ContainerComponent CreateBandGroup()
    {
        return DemoUI.CreateGroup(null, "A band across the top",
            content => content.AddChild(new ContainerComponent()
                .AddRow(UIGridUnit.Auto())
                .SetRow(1, UIGridUnit.Auto())
                .SetRow(2, UIGridUnit.Star())
                .AddChild(new CollapsiblePanelComponent("demo-band")
                    .SetSide(UISide.Top)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(16)
                        .SetVerticalAlignment(UIAlignment.Center)
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetTitle("Maintenance window").SetDescription("Saturday 02:00–04:00 UTC — deploys are held while it runs."))
                    )
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new ParagraphComponent()
                    .SetTitle("Deploys")
                    .SetDescription("What stays on screen when the band above it is folded away.")
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetWrapMode(UITextWrapMode.Wrap)
                    .SetMargin(UIThickness.All(0, 16, 0, 0))
                    .SetPlacement(1, 2, 24, 1)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24
        );
    }
}
