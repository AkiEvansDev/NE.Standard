using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.GridSplitter;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.GridSplitter;

/// <summary>
/// One splitter between two panes and every property that can be bound to it; then the three boundaries a desktop layout lets
/// the viewer move: a sidebar's edge, the lines between panes, and a log's top.
/// </summary>
/// <remarks>
/// Two panes in the preview because <c>Orientation</c> is not bindable, and their containers are unnamed, so a drag there is
/// forgotten on navigation. Every container in the examples is named, so the division chosen there is there on the next visit
/// — and painted before the first frame.
/// </remarks>
internal sealed class GridSplitterView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SplitterGroup = nameof(GridSplitterController.SplitterGroup);

    public static string ViewKey => "demo.layouts.grid-splitter";

    protected override string ComponentRoute => "/layouts/grid-splitter";
    protected override string Header => "demo.layouts.grid-splitter.header";
    protected override string HeaderDescription => "demo.layouts.grid-splitter.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(520,
            ("Vertical: the columns either side", frame => frame.AddChild(CreateColumnsPane())),
            ("Horizontal: the rows either side", frame => frame.AddChild(CreateRowsPane()))
        );

    /// <summary>
    /// Two star runs with the bar in a content-sized column of its own: a drag re-weights the stars.
    /// </summary>
    private static ContainerComponent CreateColumnsPane()
        => new ContainerComponent()
            .SetColumn(12, UIGridUnit.Auto())
            .SetOverflow(UIOverflow.Hidden)
            .AddChild(Pane("Left", "Drag the bar, or click it and press Left or Right: each press moves it by Step. A double-click puts the authored split back.").SetPlacement(1, 1, 11, 1))
            .AddChild(Bind(new GridSplitterComponent(), UIOrientation.Vertical).SetPlacement(12, 1, 1, 1))
            .AddChild(Pane("Right", "Both sides are star tracks, so the window can be resized and the proportion holds.").SetPlacement(13, 1, 12, 1))
            .SetPlacement(1, 1, 24, 1);

    /// <summary>
    /// The same bar across the rows, in a container tall enough for a star row to mean something.
    /// </summary>
    private static ContainerComponent CreateRowsPane()
        => new ContainerComponent()
            .SetRow(1, UIGridUnit.Star())
            .AddRow(UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .SetHeight(UILayoutLength.Absolute(200))
            .SetOverflow(UIOverflow.Hidden)
            .AddChild(Pane("Top", "The bar runs across and moves the rows.").SetPlacement(1, 1, 24, 1))
            .AddChild(Bind(new GridSplitterComponent(), UIOrientation.Horizontal).SetPlacement(1, 2, 24, 1))
            .AddChild(Pane("Bottom", "Up and Down move it by Step from the keyboard; Home and End take it to either end.").SetPlacement(1, 3, 24, 1))
            .SetPlacement(1, 1, 24, 1);

    private static GridSplitterComponent Bind(GridSplitterComponent splitter, UIOrientation orientation)
        => splitter
            .SetOrientation(orientation)
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindStep($"{SplitterGroup}.{nameof(GridSplitterGroupContext.Step)}")
            .BindColor($"{SplitterGroup}.{nameof(GridSplitterGroupContext.Color)}");

    /// <summary>On the page's own ground, with no edge of its own: the bar is the border between the two panes.</summary>
    private static SurfaceComponent Pane(string title, string description)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new ParagraphComponent()
                .SetTitle(title)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SplitterGroup, "Splitter", nameof(GridSplitterController.CycleSplitterOption), note: "Step is the keyboard's: focus a bar (Tab, or a click) and press the arrows — each press moves it by Step. A drag follows the pointer whatever Step says.")
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateSidebarGroup(), CreatePanesGroup(), CreateLogGroup()];

    /// <summary>
    /// A fixed sidebar beside the work: the drag writes the sidebar's pixels, between the floor and the ceiling its track carries.
    /// </summary>
    private static ContainerComponent CreateSidebarGroup()
    {
        // Panes stand side by side or not at all: on a phone the example keeps its width and scrolls sideways.
        return DemoUI.CreateExample("A sidebar you can widen",
            new ScrollContainerComponent().HorizontalScrollOnly().AddChild(new ContainerComponent("demo-split-sidebar")
                .SetWidth(UILayoutLength.Fill())
                .SetMinWidth(UILayoutLength.Absolute(560))
                .SetColumn(1, UIGridUnit.Absolute(220, min: 160, max: 420))
                .SetColumn(2, UIGridUnit.Auto())
                // The height is the group's subject here, so it is written on the pane itself rather than as a floor under the group.
                .SetHeight(UILayoutLength.Absolute(280))
                .SetOverflow(UIOverflow.Hidden)
                // The side panes are a tone off the page and square-edged, the way an editor's tool windows sit beside its document.
                .AddChild(new SurfaceComponent()
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetBorderRadius(UICornerRadius.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(UILayout.Stack(8)
                        .AddChild(UIText.Label("Filters"))
                        .AddChild(new SwitchComponent().SetTitle("Only failures").SetValue(true))
                        .AddChild(new SwitchComponent().SetTitle("Include retries"))
                        .AddChild(new SwitchComponent().SetTitle("Last 24 hours").SetValue(true))
                    )
                    .SetPlacement(1, 1, 1, 1)
                )
                .AddChild(new GridSplitterComponent().SetPlacement(2, 1, 1, 1))
                // A pane on the page's own ground: the bar beside it is its border, not a gap between two cards.
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Deploy #4821")
                        .SetDescription("The sidebar's column is 220px with a floor of 160 and a ceiling of 420; the bar stops at both. The work takes whatever is left.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(3, 1, 22, 1)
                )
            ),
            columns: 24,
            note: "Named, so the width you choose is kept for the next visit and painted before the page's first frame. Double-click the bar to put 220 back."
        );
    }

    /// <summary>
    /// Three star panes and two bars: each bar re-divides the two panes it stands between and leaves the third alone.
    /// </summary>
    private static ContainerComponent CreatePanesGroup()
    {
        return DemoUI.CreateExample("Three panes, two bars",
            new ScrollContainerComponent().HorizontalScrollOnly().AddChild(new ContainerComponent("demo-split-panes")
                .SetWidth(UILayoutLength.Fill())
                .SetMinWidth(UILayoutLength.Absolute(560))
                .SetColumn(8, UIGridUnit.Auto())
                .SetColumn(17, UIGridUnit.Auto())
                .SetHeight(UILayoutLength.Absolute(220))
                .SetOverflow(UIOverflow.Hidden)
                // A pane on the page's own ground: the bar beside it is its border, not a gap between two cards.
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Servers")
                        .SetDescription("Seven star columns.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(1, 1, 7, 1)
                )
                .AddChild(new GridSplitterComponent().SetPlacement(8, 1, 1, 1))
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Metrics")
                        .SetDescription("Eight star columns between the two bars: moving either one re-weights the stars on its own two sides, and the far pane keeps its share.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(9, 1, 8, 1)
                )
                .AddChild(new GridSplitterComponent().SetPlacement(17, 1, 1, 1))
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("Logs")
                        .SetDescription("Seven star columns.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(18, 1, 7, 1)
                )
            ),
            columns: 24
        );
    }

    /// <summary>
    /// A log along the bottom, in a fixed row the viewer pulls up: the row is written in pixels, the editor's star row takes the rest.
    /// </summary>
    private static ContainerComponent CreateLogGroup()
    {
        return DemoUI.CreateExample("A log pane pulled up",
            new ContainerComponent("demo-split-log")
                .SetRow(1, UIGridUnit.Star())
                .AddRow(UIGridUnit.Auto())
                .AddRow(UIGridUnit.Absolute(120, min: 56, max: 320))
                .SetHeight(UILayoutLength.Absolute(400))
                .SetOverflow(UIOverflow.Hidden)
                // A pane on the page's own ground: the bar beside it is its border, not a gap between two cards.
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Background)
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetContent(new ParagraphComponent()
                        .SetTitle("api-eu-west-1 / server.json")
                        .SetDescription("The editor takes what the log leaves. Pull the bar up for more log, down for more editor; the log's row has a floor of 56 and a ceiling of 320.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    )
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new GridSplitterComponent().SetOrientation(UIOrientation.Horizontal).SetPlacement(1, 2, 24, 1))
                // The side panes are a tone off the page and square-edged, the way an editor's tool windows sit beside its document.
                // A scroller, not a surface: pulled down towards its floor the pane still reads to its last line.
                .AddChild(new ScrollContainerComponent()
                    .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
                    .SetVerticalAlignment(UIAlignment.Stretch)
                    .SetPadding(UIThickness.Uniform(12))
                    .VerticalScrollOnly()
                    .AddChild(UILayout.Stack(4)
                        .AddChild(UIText.Label("Log"))
                        .AddChild(new TextComponent().SetTitle("12:04:10  pulled image billing:4821").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:04:31  migrations applied (3)").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:08:22  health check passed").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:08:40  traffic shifted to the new revision").SetTitleType(UITextAppearance.Caption))
                        .AddChild(new TextComponent().SetTitle("12:09:02  old revision drained").SetTitleType(UITextAppearance.Caption))
                    )
                    .SetPlacement(1, 3, 24, 1)
                ),
            columns: 24
        );
    }
}
