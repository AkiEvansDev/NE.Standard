using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Scroll;
using DemoApp.Views.Base;

namespace DemoApp.Views.Layouts.Scroll;

/// <summary>
/// One viewport and every property that can be bound to it; then things actually bigger than the box holding them, and where a
/// viewport is looking after its content has grown.
/// </summary>
/// <remarks>
/// The preview holds a grid bigger than its box, since a viewport is only one once its content overflows. <c>Disabled</c> cuts
/// the content rather than shrinking it. Each example's scroll properties are read off what the screen is for rather than chosen
/// to show a value.
/// </remarks>
internal sealed class ScrollView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ScrollGroup = nameof(ScrollController.ScrollGroup);
    private const string AnchorGroup = nameof(ScrollController.AnchorGroup);

    public static string ViewKey => "demo.layouts.scroll";

    protected override string ComponentRoute => "/layouts/scroll";
    protected override string Header => "demo.layouts.scroll.header";
    protected override string HeaderDescription => "demo.layouts.scroll.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ScrollContainerComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindHorizontalScroll($"{ScrollGroup}.{nameof(ScrollGroupContext.HorizontalScroll)}")
            .BindVerticalScroll($"{ScrollGroup}.{nameof(ScrollGroupContext.VerticalScroll)}")
            .BindScrollSnap($"{ScrollGroup}.{nameof(ScrollGroupContext.ScrollSnap)}")
            // MaxHeight rather than Height: the bound Height row would render its unset state as `auto`.
            .SetMaxHeight(UILayoutLength.Absolute(200))
            // Bigger than the box on both axes, or neither scroll row would say anything.
            .AddChildren(CreateTileRows(rows: 6, columns: 12))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>
    /// The rows as children of the viewport itself: a scroll comes to rest on a child, so a wrapper would leave one stop.
    /// </summary>
    private static IVisualComponent[] CreateTileRows(int rows, int columns)
    {
        IVisualComponent[] tiles = DemoUI.CreateTiles(rows * columns);
        IVisualComponent[] result = new IVisualComponent[rows];

        for (var row = 0; row < rows; row++)
        {
            result[row] = new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetMargin(UIThickness.All(0, 0, 0, 8))
                .AddChildren(tiles[(row * columns)..((row + 1) * columns)]);
        }

        return result;
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ScrollGroup, "Scroll", nameof(ScrollController.CycleScrollGroupOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [CreateDirectionGroup(), CreateAnchorGroup()];

    /// <summary>
    /// Three things bigger than their box, each scrolled only the way its content needs.
    /// </summary>
    private static ContainerComponent CreateDirectionGroup()
    {
        // The two lists side by side, the picture across under them: a box as wide as the group still has a picture wider than it.
        return DemoUI.CreateExample("Which way it scrolls",
            UILayout.Stack(16,
                UILayout.Columns(16,
                    // Down only: sideways would take each row's trailing state out of sight.
                    DemoUI.CreateLabelled("Down only — more rows than room", new ScrollContainerComponent()
                        .SetHeight(UILayoutLength.Absolute(280))
                        .SetPadding(UIThickness.Uniform(12))
                        .SetBorderThickness(UIThickness.Uniform(1))
                        .SetBorderColor(UIThemeColor.Border)
                        .VerticalScrollOnly()
                        .AddChild(CreateDeployRows())
                    ),
                    // Sideways only: the rows are as tall as they need to be and the page carries them.
                    DemoUI.CreateLabelled("Sideways only — more columns than room", new ScrollContainerComponent()
                        .HorizontalScrollOnly()
                        .SetPadding(UIThickness.Uniform(12))
                        .SetBorderThickness(UIThickness.Uniform(1))
                        .SetBorderColor(UIThemeColor.Border)
                        .AddChild(CreateReleaseTable())
                    )
                ),
                // Both axes at once: the picture keeps its size and the box moves over it.
                DemoUI.CreateLabelled("Both ways — a picture larger than its box", new ScrollContainerComponent()
                    .SetHeight(UILayoutLength.Absolute(240))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetBorderThickness(UIThickness.Uniform(1))
                    .SetBorderColor(UIThemeColor.Border)
                    .SetScroll(UIScrollMode.Auto, UIScrollMode.Auto)
                    .AddChild(new ImageComponent()
                        .SetSource(DemoImages.HarbourSky)
                        .SetFit(UIImageFit.Cover)
                        .SetWidth(UILayoutLength.Absolute(1400))
                        .SetHeight(UILayoutLength.Absolute(560))
                    )
                )
            ),
            columns: 24
        );
    }

    /// <summary>The deploys the first viewport lists, ten of them, so the list is longer than its box.</summary>
    private static StackPanelComponent CreateDeployRows()
    {
        (string Icon, UIColorStyle Color, string Title, string Description)[] deploys =
        [
            (DemoIcons.Check, UIColorStyle.Success, "billing · #481", "Deployed 4 minutes ago"),
            (DemoIcons.Undo, UIColorStyle.Danger, "dns · #127", "Rolled back"),
            (DemoIcons.Clock, UIColorStyle.Warning, "panel · #902", "Waiting on approval"),
            (DemoIcons.Check, UIColorStyle.Success, "billing-worker · #58", "Deployed 20 min ago"),
            (DemoIcons.Check, UIColorStyle.Success, "status-page · #311", "Deployed an hour ago"),
            (DemoIcons.Clock, UIColorStyle.Warning, "identity · #76", "Waiting on approval"),
            (DemoIcons.Check, UIColorStyle.Success, "edge-router · #1204", "Deployed two hours ago"),
            (DemoIcons.Undo, UIColorStyle.Danger, "object-storage · #44", "Rolled back"),
            (DemoIcons.Check, UIColorStyle.Success, "metrics · #19", "Deployed yesterday"),
            (DemoIcons.Check, UIColorStyle.Success, "scheduler · #615", "Deployed yesterday")
        ];

        StackPanelComponent rows = UILayout.Stack(2);

        foreach ((var icon, UIColorStyle color, var title, var description) in deploys)
        {
            _ = rows.AddChild(new ActionComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(DemoIcons.Outline(icon))
                .SetIconColor(UIThemeColor.FromStyle(color))
                .SetTitle(title)
                .SetDescription(description)
                .SetShowChevron(false)
                .SetTrailingText("Details")
            );
        }

        return rows;
    }

    /// <summary>The releases the second viewport tabulates: seven fixed columns, wider together than the box.</summary>
    private static StackPanelComponent CreateReleaseTable()
    {
        double[] widths = [160, 90, 130, 110, 90, 110, 130];
        string[][] rows =
        [
            ["billing", "#481", "production", "8 of 8", "17:04", "4 m 12 s", "Passed"],
            ["dns", "#127", "staging", "2 of 4", "16:51", "11 m 03 s", "Rolled back"],
            ["panel", "#902", "staging", "4 of 4", "16:40", "2 m 55 s", "Waiting"],
            ["billing-worker", "#58", "production", "3 of 3", "16:22", "1 m 47 s", "Passed"],
            ["edge-router", "#1204", "production", "12 of 12", "15:58", "6 m 30 s", "Passed"]
        ];

        // A rule under the head only: a box round every cell would read as a spreadsheet.
        StackPanelComponent table = UILayout.Stack(0)
            .AddChild(new ContainerComponent()
                .SetBorderThickness(UIThickness.All(0, 0, 0, 1))
                .SetBorderColor(UIThemeColor.Border)
                .SetPadding(UIThickness.All(0, 0, 0, 6))
                .AddChild(CreateReleaseRow(["Service", "Release", "Environment", "Replicas", "Started", "Duration", "Result"], widths, head: true))
            );

        foreach (var row in rows)
        {
            _ = table.AddChild(new ContainerComponent()
                .SetPadding(UIThickness.All(0, 6, 0, 6))
                .AddChild(CreateReleaseRow(row, widths, head: false))
            );
        }

        return table;
    }

    private static StackPanelComponent CreateReleaseRow(string[] cells, double[] widths, bool head)
    {
        StackPanelComponent line = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(0);

        for (var i = 0; i < cells.Length; i++)
        {
            TextComponent cell = new TextComponent()
                .SetTitle(cells[i])
                .SetTitleType(head ? UITextAppearance.Overline : UITextAppearance.Body)
                .SetWidth(UILayoutLength.Absolute(widths[i]));

            _ = line.AddChild(head ? cell.SetTitleColor(UIThemeColor.Muted) : cell);
        }

        return line;
    }

    /// <summary>
    /// <c>ScrollAnchor</c>, visible only in the difference between two viewports after content arrives in both; and the other shape
    /// it was invented for, output nobody is scrolling through.
    /// </summary>
    private static ContainerComponent CreateAnchorGroup()
    {
        return DemoUI.CreateExample("Stays at the end",
            UILayout.Stack(16,
                UILayout.Columns(16,
                    DemoUI.CreateLabelled("End — follows what arrives", CreateChat(anchored: true)),
                    DemoUI.CreateLabelled("None — stays where it was", CreateChat(anchored: false))
                ),
                // A job that has not finished: the anchor alone keeps the newest line in sight.
                DemoUI.CreateLabelled("End — a job that is still running", new ScrollContainerComponent()
                    .VerticalScrollOnly()
                    .AnchorToEnd()
                    .SetHeight(UILayoutLength.Absolute(200))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetBorderThickness(UIThickness.Uniform(1))
                    .SetBorderColor(UIThemeColor.Border)
                    .AddChild(new ParagraphComponent()
                        .BindDescription(nameof(ScrollAnchorGroupContext.Output), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
            ),
            note: "Send a message: one viewport is showing what just arrived, the other is still where it was left — the only difference between them is ScrollAnchor. Scroll the anchored one up and send again: it stays where you left it, and takes the pin back when you return to the bottom. Append output: the newest line stays in sight without the reader chasing it down the pane.",
            columns: 24,
            context: AnchorGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Send a message"] = nameof(ScrollController.SendMessage),
                ["Append output"] = nameof(ScrollController.AppendOutput)
            })
        );
    }

    private static ScrollContainerComponent CreateChat(bool anchored)
    {
        ScrollContainerComponent viewport = new ScrollContainerComponent()
            .VerticalScrollOnly()
            .SetScrollAnchor(anchored ? UIScrollAnchor.End : UIScrollAnchor.None)
            .SetHeight(UILayoutLength.Absolute(220))
            .SetPadding(UIThickness.Uniform(12))
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderColor(UIThemeColor.Border);

        return viewport.AddChild(UILayout.Stack(10)
            .AddChild(CreateMessage("Robin", "The staging deploy is stuck on the health check again.", false))
            .AddChild(CreateMessage("You", "Which replica?", true))
            .AddChild(CreateMessage("Robin", "Two of eight, both in eu-west.", false))
            .AddChild(CreateMessage("You", "Same pair as Tuesday. Rolling back to 480 while I look.", true))
            .AddChild(CreateMessage("Robin", "Rollback is green, traffic is on the old revision.", false))
            .AddChild(CreateReply("Alex", "I have the logs — the gate times out on the migration, not the app.", nameof(ScrollAnchorGroupContext.Reply1)))
            .AddChild(CreateReply("You", "Then it is the index rebuild. That ran long on Tuesday too.", nameof(ScrollAnchorGroupContext.Reply2)))
            .AddChild(CreateReply("Alex", "Raising the gate to ten minutes and queueing 481 again.", nameof(ScrollAnchorGroupContext.Reply3)))
            .AddChild(CreateReply("Robin", "481 is green. Eight of eight, four minutes twelve.", nameof(ScrollAnchorGroupContext.Reply4)))
        );
    }

    private static SurfaceComponent CreateMessage(string author, string text, bool mine)
        => new SurfaceComponent()
            .SetSurface(mine ? UISurfaceStyle.Tinted : UISurfaceStyle.Raised)
            .SetBackground(mine ? UIThemeColor.Primary : null)
            .SetMaxWidth(UILayoutLength.Absolute(280))
            .SetHorizontalAlignment(mine ? UIAlignment.End : UIAlignment.Start)
            .SetPadding(UIThickness.All(10, 8, 10, 8))
            .SetContent(UILayout.Stack(2)
                .AddChild(new TextComponent()
                    .SetTitle(author)
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Muted)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription(text)
                    .SetDescriptionType(UITextAppearance.Body)
                )
            );

    // Already in the tree and hidden: Visible is display:none, so revealing one grows the content.
    private static SurfaceComponent CreateReply(string author, string text, string flag)
        => CreateMessage(author, text, author == "You")
            .BindVisibility(flag, UIBindingScope.Relative);
}
