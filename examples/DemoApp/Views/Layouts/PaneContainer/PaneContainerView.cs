using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.PaneContainer;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.PaneContainer;

/// <summary>
/// A workspace of three panes — a chat, and a column of two tool panes beside it — whose layout and bars are bound, so what the viewer
/// arranges is the controller's; then a board of four panes the browser keeps, a column that keeps its width, a wall of places of two
/// sizes, and an overview whose order the controller keeps and puts back.
/// </summary>
internal sealed class PaneContainerView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string PaneGroup = nameof(PaneContainerController.PaneGroup);
    private const string OverviewGroup = nameof(PaneContainerController.OverviewGroup);

    public static string ViewKey => "demo.layouts.pane-container";

    protected override string ComponentRoute => "/layouts/pane-container";
    protected override string Header => "demo.layouts.pane-container.header";
    protected override string HeaderDescription => "demo.layouts.pane-container.description";

    // Panes stand side by side or not at all: on a phone the preview keeps its width and scrolls sideways.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ScrollContainerComponent()
            .HorizontalScrollOnly()
            .AddChild(CreateWorkspace())
            .SetPlacement(1, 1, 24, 1)
        ), 380);

    /// <summary>
    /// The chat across three rows on the left; on the right the tasks over the tree, a bar between the two columns and one between the
    /// two tool panes. A pane carried onto another's place trades places with it; the bars size the places, whichever pane stands there.
    /// </summary>
    private static PaneContainerComponent CreateWorkspace()
        => new PaneContainerComponent()
            .SetWidth(UILayoutLength.Fill())
            .SetMinWidth(UILayoutLength.Absolute(560))
            .SetHeight(UILayoutLength.Absolute(360))
            .SetColumn(16, UIGridUnit.Auto())
            .SetRow(1, UIGridUnit.Star())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetOverflow(UIOverflow.Hidden)
            .AddPane("chat", UIGridPlacement.At(1, 1, 15, 3), Pane("Chat", "The main pane. Drag the bar at the top of any pane onto another pane: the two trade places.", toned: false))
            .AddPane("tasks", UIGridPlacement.At(17, 1, 8, 1), Pane("Background tasks", "Or press Tab to a grip, then Space, an arrow to choose the place, and Space again.", toned: true))
            .AddPane("tree", UIGridPlacement.At(17, 3, 8, 1), Pane("Working tree", "The bars size the places, not the panes: a pane takes the size of the place it lands in.", toned: true))
            .AddChild(new GridSplitterComponent()
                .BindPosition($"{PaneGroup}.{nameof(PaneContainerGroupContext.SidePosition)}")
                .SetPlacement(16, 1, 1, 3)
            )
            .AddChild(new GridSplitterComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .BindPosition($"{PaneGroup}.{nameof(PaneContainerGroupContext.ToolsPosition)}")
                .SetPlacement(17, 2, 8, 1)
            )
            .BindLayout($"{PaneGroup}.{nameof(PaneContainerGroupContext.Layout)}")
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// A pane's content: a title and what it is for, the tool panes a tone off the page as an editor's tool windows are, so a moved
    /// pane is seen to move. Every pane paints its ground: a pane sliding over another must hide it.
    /// </summary>
    private static SurfaceComponent Pane(string title, string description, bool toned)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetBackground(UIThemeColor.FromStyle(toned ? UIColorStyle.Surface : UIColorStyle.Background))
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetPadding(UIThickness.All(12, 16, 12, 12))
            .SetContent(new ParagraphComponent()
                .SetTitle(title)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(PaneGroup, "Panes", note: "Bound both ways: move a pane or a bar in the preview and its row here changes; step a row and the preview moves.")
        );

    // The board across the page; the wall beside the overview, both read at half of it.
    protected override IVisualComponent[] CreateExamples()
        => [CreateBoardGroup(), CreateKeptGroup(), .. DemoUI.CreateColumns([CreateWallGroup()], [CreateOverviewGroup()])];

    /// <summary>
    /// Four panes in a square and no bars: a pane trades places across, down or corner to corner, and the layout is the browser's.
    /// </summary>
    private static ContainerComponent CreateBoardGroup()
    {
        return DemoUI.CreateExample("A board the browser keeps",
            new PaneContainerComponent("demo-panes-board")
                .SetRow(1, UIGridUnit.Star())
                .AddRow(UIGridUnit.Star())
                .SetSpacing(8)
                .SetHeight(UILayoutLength.Absolute(260))
                .AddPane("deploys", UIGridPlacement.At(1, 1, 12, 1), BoardPane("Deploys", "3 running"))
                .AddPane("alerts", UIGridPlacement.At(13, 1, 12, 1), BoardPane("Alerts", "1 open"))
                .AddPane("costs", UIGridPlacement.At(1, 2, 12, 1), BoardPane("Costs", "Under budget"))
                .AddPane("on-call", UIGridPlacement.At(13, 2, 12, 1), BoardPane("On call", "Platform team")),
            columns: 24,
            note: "Unbound and named: the order you leave is kept in this browser for the next visit."
        );
    }

    private static SurfaceComponent BoardPane(string title, string status)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetPadding(UIThickness.All(12, 16, 12, 12))
            .SetContent(new ParagraphComponent()
                .SetTitle(title)
                .SetDescription(status)
                .SetDescriptionType(UITextAppearance.Body)
            );

    /// <summary>
    /// A document and a 240 px outline beside it that keeps its size: carried to the other side, the outline stays as narrow and the
    /// document as wide, where a pane without the option would take the size of the place it lands in. On a phone the outline stands
    /// under the document.
    /// </summary>
    private static ContainerComponent CreateKeptGroup()
    {
        return DemoUI.CreateExample("A column that keeps its width",
            new PaneContainerComponent("demo-panes-kept")
                .SetColumn(UIGridPlacement.GridColumns, UIGridUnit.Absolute(240))
                .AddRow(UIGridUnit.Auto())
                .SetSpacing(8)
                .SetHeight(UILayoutLength.Absolute(220))
                .AddPane("document", UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 1, 24, 1), md: UIGridPlacement.At(1, 1, 23, 2)), BoardPane("Release notes", "The page you write"))
                .AddPane("outline", UIResponsive<UIGridPlacement>.Create(UIGridPlacement.At(1, 2, 24, 1), md: UIGridPlacement.At(24, 1, 1, 2)), BoardPane("Outline", "240 px on either side"), keepsSize: true),
            columns: 24,
            note: "The outline is added to keep its size: drag it by its grip onto the document and it stays 240 px on the other side, the document as wide as before. It keeps it beside its own place, with no splitter between."
        );
    }

    /// <summary>
    /// Places of two sizes: a pane carried onto the large place takes its size, and the one standing there goes to the small place.
    /// </summary>
    private static ContainerComponent CreateWallGroup()
    {
        return DemoUI.CreateExample("The reading you watch, the large one",
            new PaneContainerComponent("demo-panes-wall")
                .SetRow(1, UIGridUnit.Star())
                .AddRow(UIGridUnit.Star())
                .SetSpacing(8)
                .SetHeight(UILayoutLength.Absolute(260))
                .AddPane("cpu", UIGridPlacement.At(1, 1, 16, 2), new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetPadding(UIThickness.All(12, 16, 12, 12))
                    .SetContent(new TextComponent()
                        .SetTitle("42%")
                        .SetTitleType(UITextAppearance.Display)
                        .SetDescription("CPU · api-eu-west-1")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddPane("memory", UIGridPlacement.At(17, 1, 8, 1), new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetPadding(UIThickness.All(12, 16, 12, 12))
                    .SetContent(new TextComponent()
                        .SetTitle("61%")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Memory · db-us-east-2")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddPane("requests", UIGridPlacement.At(17, 2, 8, 1), new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetPadding(UIThickness.All(12, 16, 12, 12))
                    .SetContent(new TextComponent()
                        .SetTitle("18.4k")
                        .SetTitleType(UITextAppearance.Title)
                        .SetDescription("Requests a minute · edge-router")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                ),
            note: "Drag a small pane by its grip onto the large one: it takes the large place's size, and the reading that stood there goes to the small place. The places keep their cells; only the panes move between them."
        );
    }

    /// <summary>
    /// A bound layout the viewer rearranges and the controller can put back: Restore writes the default, and the panes move to it.
    /// </summary>
    private static ContainerComponent CreateOverviewGroup()
    {
        return DemoUI.CreateExample("An order kept for the viewer",
            UILayout.Stack(12)
                .AddChild(UIPage.Heading("Overview", "Drag a pane by its grip to put it where you look first.", new ButtonComponent()
                        .OnClick(nameof(PaneContainerController.RestoreOverview))
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Undo))
                        .SetTitle("Restore")
                    )
                )
                .AddChild(new PaneContainerComponent()
                    .SetSpacing(8)
                    .SetHeight(UILayoutLength.Absolute(120))
                    .AddPane("alerts", UIGridPlacement.At(1, 1, 8, 1), new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetVerticalAlignment(UIAlignment.Stretch)
                        .SetPadding(UIThickness.All(12, 16, 12, 12))
                        .SetContent(new ParagraphComponent().SetTitle("Alerts").SetDescription("5 open").SetDescriptionType(UITextAppearance.Body))
                    )
                    .AddPane("deploys", UIGridPlacement.At(9, 1, 8, 1), new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetVerticalAlignment(UIAlignment.Stretch)
                        .SetPadding(UIThickness.All(12, 16, 12, 12))
                        .SetContent(new ParagraphComponent().SetTitle("Deploys").SetDescription("3 running").SetDescriptionType(UITextAppearance.Body))
                    )
                    .AddPane("on-call", UIGridPlacement.At(17, 1, 8, 1), new SurfaceComponent()
                        .SetSurface(UISurfaceStyle.Raised)
                        .SetVerticalAlignment(UIAlignment.Stretch)
                        .SetPadding(UIThickness.All(12, 16, 12, 12))
                        .SetContent(new ParagraphComponent().SetTitle("On call").SetDescription("Grace Kim").SetDescriptionType(UITextAppearance.Body))
                    )
                    .BindLayout(nameof(PaneOverviewGroupContext.Layout), UIBindingScope.Relative)
                )
                .AddChild(new TextComponent()
                    .SetTitle("Kept for you")
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Muted)
                    .BindDescription(nameof(PaneOverviewGroupContext.Layout), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Caption)
                ),
            note: "Layout bound two ways: each drag comes back to the controller, which would keep it with the viewer's settings, and the line under the panes reads it. Restore writes the default, and the panes move to it.",
            context: OverviewGroup
        );
    }
}
