using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.GridSplitter;

/// <summary>
/// The three boundaries a desktop layout lets the viewer move: a sidebar's edge, the lines between panes, and a log's top.
/// </summary>
/// <remarks>Every container here is named, so the division you choose is there on the next visit — and painted before the first frame.</remarks>
internal sealed class GridSplitterExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.grid-splitter.examples";

    protected override string ComponentRoute => "/layouts/grid-splitter";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.grid-splitter.header";
    protected override string HeaderDescription => "demo.layouts.grid-splitter.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(CreateSidebarGroup(), CreatePanesGroup(), CreateLogGroup());

    /// <summary>
    /// A fixed sidebar beside the work: the drag writes the sidebar's pixels, between the floor and the ceiling its track carries.
    /// </summary>
    private static ContainerComponent CreateSidebarGroup()
    {
        return DemoUI.CreateGroup(null, "A sidebar you can widen",
            content => content.AddChild(new ContainerComponent("demo-split-sidebar")
                .SetColumn(1, UIGridUnit.Absolute(220, min: 160, max: 420))
                .SetColumn(2, UIGridUnit.Auto())
                // The height is the group's subject here, so it is written on the pane itself rather than as a floor under the group.
                .SetHeight(UILayoutLength.Absolute(280))
                .SetOverflow(UIOverflow.Hidden)
                .AddChild(CreateFilters().SetPlacement(1, 1, 1, 1))
                .AddChild(new GridSplitterComponent().SetPlacement(2, 1, 1, 1))
                .AddChild(CreateWork("Deploy #4821", "The sidebar's column is 220px with a floor of 160 and a ceiling of 420; the bar stops at both. The work takes whatever is left.").SetPlacement(3, 1, 22, 1))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "Named, so the width you choose is kept for the next visit and painted before the page's first frame. Double-click the bar to put 220 back."
        );
    }

    // The side panes are a tone off the page and square-edged, the way an editor's tool windows sit beside its document.
    private static SurfaceComponent CreateFilters()
        => new SurfaceComponent()
            .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(DemoUI.CreateCaption("Filters"))
                .AddChild(new SwitchComponent().SetTitle("Only failures").SetValue(true))
                .AddChild(new SwitchComponent().SetTitle("Include retries"))
                .AddChild(new SwitchComponent().SetTitle("Last 24 hours").SetValue(true))
            );

    /// <summary>A pane on the page's own ground: the bar beside it is its border, not a gap between two cards.</summary>
    private static SurfaceComponent CreateWork(string title, string description)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new ParagraphComponent()
                .SetTitle(title)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Body)
                .SetWrapMode(UITextWrapMode.Wrap)
            );

    /// <summary>
    /// Three star panes and two bars: each bar re-divides the two panes it stands between and leaves the third alone.
    /// </summary>
    private static ContainerComponent CreatePanesGroup()
    {
        return DemoUI.CreateGroup(null, "Three panes, two bars",
            content => content.AddChild(new ContainerComponent("demo-split-panes")
                .SetColumn(8, UIGridUnit.Auto())
                .SetColumn(17, UIGridUnit.Auto())
                .SetHeight(UILayoutLength.Absolute(220))
                .SetOverflow(UIOverflow.Hidden)
                .AddChild(CreateWork("Files", "Seven star columns.").SetPlacement(1, 1, 7, 1))
                .AddChild(new GridSplitterComponent().SetPlacement(8, 1, 1, 1))
                .AddChild(CreateWork("Editor", "Eight star columns between the two bars: moving either one re-weights the stars on its own two sides, and the far pane keeps its share.").SetPlacement(9, 1, 8, 1))
                .AddChild(new GridSplitterComponent().SetPlacement(17, 1, 1, 1))
                .AddChild(CreateWork("Preview", "Seven star columns.").SetPlacement(18, 1, 7, 1))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24
        );
    }

    /// <summary>
    /// A log along the bottom, in a fixed row the viewer pulls up: the row is written in pixels, the editor's star row takes the rest.
    /// </summary>
    private static ContainerComponent CreateLogGroup()
    {
        return DemoUI.CreateGroup(null, "A log pane pulled up",
            content => content.AddChild(new ContainerComponent("demo-split-log")
                .SetRow(1, UIGridUnit.Star())
                .AddRow(UIGridUnit.Auto())
                .AddRow(UIGridUnit.Absolute(120, min: 56, max: 320))
                .SetHeight(UILayoutLength.Absolute(400))
                .SetOverflow(UIOverflow.Hidden)
                .AddChild(CreateWork("payments-api / deploy.yml", "The editor takes what the log leaves. Pull the bar up for more log, down for more editor; the log's row has a floor of 56 and a ceiling of 320.").SetPlacement(1, 1, 24, 1))
                .AddChild(new GridSplitterComponent().SetOrientation(UIOrientation.Horizontal).SetPlacement(1, 2, 24, 1))
                .AddChild(CreateLog().SetPlacement(1, 3, 24, 1))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24
        );
    }

    private static SurfaceComponent CreateLog()
        => new SurfaceComponent()
            .SetBackground(UIThemeColor.FromStyle(UIColorStyle.Surface))
            .SetVerticalAlignment(UIAlignment.Stretch)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetBorderRadius(UICornerRadius.Uniform(0))
            .SetPadding(UIThickness.Uniform(12))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(4)
                .AddChild(DemoUI.CreateCaption("Log"))
                .AddChild(new TextComponent().SetTitle("12:04:10  pulled image payments-api:4821").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:04:31  migrations applied (3)").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:08:22  health check passed").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:08:40  traffic shifted to the new revision").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetTitle("12:09:02  old revision drained").SetTitleType(UITextAppearance.Caption))
            );
}
