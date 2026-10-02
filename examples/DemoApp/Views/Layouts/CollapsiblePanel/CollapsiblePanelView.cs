using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.CollapsiblePanel;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.CollapsiblePanel;

/// <summary>
/// One panel and every property that can be bound to it; then the places a panel folds from: the three edges of a workspace,
/// and a band across the top of a screen.
/// </summary>
/// <remarks>
/// Four panes because <c>Side</c> is not bindable; the viewer's own switch and the <c>Expanded</c> row may disagree. Every
/// example panel sits in a <c>UIGridUnit.Auto</c> track, which is what lets the content beside it move when it folds.
/// </remarks>
internal sealed class CollapsiblePanelView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string PanelGroup = nameof(CollapsiblePanelController.PanelGroup);
    private const string BorderGroup = nameof(CollapsiblePanelController.BorderGroup);

    public static string ViewKey => "demo.layouts.collapsible-panel";

    protected override string ComponentRoute => "/layouts/collapsible-panel";
    protected override string Header => "demo.layouts.collapsible-panel.header";
    protected override string HeaderDescription => "demo.layouts.collapsible-panel.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(640,
            ("Left", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-left"), UISide.Left))),
            ("Right", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-right"), UISide.Right))),
            ("Top", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-top"), UISide.Top))),
            ("Bottom", frame => frame.AddChild(Bind(new CollapsiblePanelComponent("demo-panel-bottom"), UISide.Bottom)))
        );

    private static CollapsiblePanelComponent Bind(CollapsiblePanelComponent panel, UISide side)
        => panel
            .SetSide(side)
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindExpanded($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Expanded)}")
            .BindPadding($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Padding)}")
            .BindBackground($"{PanelGroup}.{nameof(CollapsiblePanelGroupContext.Background)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            // Set rather than bound: it is what the panel holds rather than something about the panel.
            .SetContent(new ParagraphComponent()
                .SetTitle("Filters")
                .SetDescription("What the panel holds goes away with it: press the switch and only the switch is left, on the edge the panel sits on.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            )
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(PanelGroup, "Panel", nameof(CollapsiblePanelController.CyclePanelOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(CollapsiblePanelController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateWorkspaceGroup(), CreateBandGroup()];

    /// <summary>
    /// A workspace with three panes, each folding toward the edge it sits on; the side panes wear their titles beside their switches.
    /// </summary>
    private static ContainerComponent CreateWorkspaceGroup()
    {
        return DemoUI.CreateExample("Three panes around a workspace",
            new ContainerComponent()
                .SetColumn(1, UIGridUnit.Auto())
                .SetColumn(24, UIGridUnit.Auto())
                .AddRow(UIGridUnit.Auto())
                .SetOverflow(UIOverflow.Hidden)
                .AddChild(new CollapsiblePanelComponent("demo-workspace-filters")
                    .SetSide(UISide.Left)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetPadding(UIThickness.Uniform(12))
                    // The whole line while the panes stand one under another, a side's width once they stand beside the work.
                    .SetWidth(UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: UILayoutLength.Absolute(220)))
                    // The pane's title beside its switch, gone with the content when the pane folds.
                    .SetToggleContent(UIText.Label("Filters"))
                    .SetContent(UILayout.Stack(8)
                        .AddChild(new SwitchComponent().SetTitle("Only failures").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("Include retries"))
                        .AddChild(new SwitchComponent().SetTitle("Last 24 hours").SetValue(true))
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 1, 1))
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Deploy #4821")
                        .SetDescription("The work sits between the panes and takes whatever room they give back. Fold the filters and it grows to the left; fold the detail and it grows to the right; fold the log and it grows down.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(2, 1, 22, 1))
                )
                .AddChild(new CollapsiblePanelComponent("demo-workspace-detail")
                    .SetSide(UISide.Right)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetWidth(UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: UILayoutLength.Absolute(240)))
                    // The pane's title beside its switch, gone with the content when the pane folds.
                    .SetToggleContent(UIText.Label("Detail"))
                    // A detail pane is read, not operated: the key-value list, as a summary anywhere else would be.
                    .SetContent(UIDetails.List(("Started by", "Release bot"), ("Region", "eu-west"), ("Duration", "4 min 12 s")))
                    .SetPlacement(1, 3, 24, 1, md: UIGridPlacement.At(24, 1, 1, 1))
                )
                .AddChild(new CollapsiblePanelComponent("demo-workspace-log")
                    .SetSide(UISide.Bottom)
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(UILayout.Stack(4)
                        .AddChild(UIText.Label("Log"))
                        .AddChild(new TextComponent().SetTitle("12:04:10  pulled image billing:4821").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:04:31  migrations applied (3)").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:08:22  health check passed").SetTitleType(UITextAppearance.Caption))
                    )
                    .SetPlacement(1, 4, 24, 1, md: UIGridPlacement.At(1, 2, 24, 1))
                ),
            columns: 24
        );
    }

    /// <summary>
    /// A band across the top that folds upward, with its switch under the band at its start.
    /// </summary>
    private static ContainerComponent CreateBandGroup()
    {
        return DemoUI.CreateExample("A band across the top",
            new ContainerComponent()
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
                        .AddChild(new TextComponent().SetIcon(DemoIcons.Outline(DemoIcons.Alert)).SetTitle("Maintenance window").SetDescription("Saturday 02:00–04:00 UTC — deploys are held while it runs.").SetWrapMode(UITextWrapMode.Wrap))
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
                ),
            columns: 24
        );
    }
}
