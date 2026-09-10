using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Scroll;

/// <summary>
/// Four things that are actually bigger than the box holding them, because that is the only state in which a
/// viewport is a viewport at all.
/// </summary>
/// <remarks>Each group's scroll properties are read off what the screen is for rather than chosen to show a value.</remarks>
internal sealed class ScrollExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.scroll.examples";

    protected override string ComponentRoute => "/layouts/scroll";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.scroll.header";
    protected override string HeaderDescription => "demo.layouts.scroll.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateListGroup(), CreateConversationGroup()],
            [CreatePictureGroup(), CreateTableGroup()]
        ));
    }

    /// <summary>
    /// Down only, and already at the bottom when the page paints, where the newest line is.
    /// </summary>
    private static ContainerComponent CreateConversationGroup()
    {
        return DemoUI.CreateGroup(null, "A conversation",
            content => content.AddChild(CreateViewport(280)
                .VerticalScrollOnly()
                .AnchorToEnd()
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .AddChild(ScrollDemo.CreateMessage("Robin", "The staging deploy is stuck on the health check again.", false))
                    .AddChild(ScrollDemo.CreateMessage("You", "Which replica?", true))
                    .AddChild(ScrollDemo.CreateMessage("Robin", "Two of eight, both in eu-west-1.", false))
                    .AddChild(ScrollDemo.CreateMessage("You", "Same pair as Tuesday. Rolling back to 480 while I look.", true))
                    .AddChild(ScrollDemo.CreateMessage("Robin", "Rollback is green, traffic is on the old revision.", false))
                    .AddChild(ScrollDemo.CreateMessage("Alex", "I have the logs — the gate times out on the migration, not the app.", false))
                    .AddChild(ScrollDemo.CreateMessage("You", "Then it is the index rebuild. That ran long on Tuesday too.", true))
                    .AddChild(ScrollDemo.CreateMessage("Alex", "Raising the gate to ten minutes and queueing 481 again.", false))
                )
            )
        );
    }

    /// <summary>
    /// More rows than room, down only: sideways would take each row's trailing state out of sight.
    /// </summary>
    private static ContainerComponent CreateListGroup()
    {
        return DemoUI.CreateGroup(null, "More rows than room",
            content => content.AddChild(CreateViewport(280)
                .VerticalScrollOnly()
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(2)
                    .AddChild(CreateDeploy("payments-api", "481", "Deployed 4 minutes ago", DemoIcons.Check, UIColorStyle.Success))
                    .AddChild(CreateDeploy("search-index", "127", "Rolled back", DemoIcons.Undo, UIColorStyle.Danger))
                    .AddChild(CreateDeploy("web-portal", "902", "Waiting on review", DemoIcons.Clock, UIColorStyle.Warning))
                    .AddChild(CreateDeploy("billing-worker", "58", "Deployed 20 minutes ago", DemoIcons.Check, UIColorStyle.Success))
                    .AddChild(CreateDeploy("notifications", "311", "Deployed an hour ago", DemoIcons.Check, UIColorStyle.Success))
                    .AddChild(CreateDeploy("identity", "76", "Waiting on review", DemoIcons.Clock, UIColorStyle.Warning))
                    .AddChild(CreateDeploy("edge-router", "1204", "Deployed two hours ago", DemoIcons.Check, UIColorStyle.Success))
                    .AddChild(CreateDeploy("asset-pipeline", "44", "Rolled back", DemoIcons.Undo, UIColorStyle.Danger))
                    .AddChild(CreateDeploy("reporting", "19", "Deployed yesterday", DemoIcons.Check, UIColorStyle.Success))
                    .AddChild(CreateDeploy("scheduler", "615", "Deployed yesterday", DemoIcons.Check, UIColorStyle.Success))
                )
            )
        );
    }

    private static ActionComponent CreateDeploy(string service, string build, string state, string icon, UIColorStyle tone)
        => new ActionComponent()
            .SetType(UIButtonType.Ghost)
            .SetIcon(DemoIcons.Outline(icon))
            .SetIconColor(UIThemeColor.FromStyle(tone))
            .SetTitle($"{service} · #{build}")
            .SetDescription(state)
            .SetShowChevron(false)
            .SetTrailingText("Details");

    /// <summary>
    /// Sideways only: the rows are as tall as they need to be and the page carries them.
    /// </summary>
    private static ContainerComponent CreateTableGroup()
    {
        return DemoUI.CreateGroup(null, "More columns than room",
            content => content.AddChild(new ScrollContainerComponent()
                .HorizontalScrollOnly()
                .SetPadding(UIThickness.Uniform(12))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(0)
                    .AddChild(CreateTableRow("Service", "Build", "Environment", "Replicas", "Started", "Duration", "Result", header: true))
                    .AddChild(CreateTableRow("payments-api", "#481", "production", "8 of 8", "17:04", "4 m 12 s", "Passed", header: false))
                    .AddChild(CreateTableRow("search-index", "#127", "staging", "2 of 4", "16:51", "11 m 03 s", "Rolled back", header: false))
                    .AddChild(CreateTableRow("web-portal", "#902", "staging", "4 of 4", "16:40", "2 m 55 s", "Waiting", header: false))
                    .AddChild(CreateTableRow("billing-worker", "#58", "production", "3 of 3", "16:22", "1 m 47 s", "Passed", header: false))
                    .AddChild(CreateTableRow("edge-router", "#1204", "production", "12 of 12", "15:58", "6 m 30 s", "Passed", header: false))
                )
            )
        );
    }

    private static ContainerComponent CreateTableRow(string service, string build, string environment, string replicas, string started, string duration, string result, bool header)
    {
        StackPanelComponent row = new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(0)
            .AddChild(CreateCell(service, 160, header))
            .AddChild(CreateCell(build, 90, header))
            .AddChild(CreateCell(environment, 130, header))
            .AddChild(CreateCell(replicas, 110, header))
            .AddChild(CreateCell(started, 90, header))
            .AddChild(CreateCell(duration, 110, header))
            .AddChild(CreateCell(result, 130, header));

        // A rule under the head only: a box round every cell would read as a spreadsheet.
        return header
            ? new ContainerComponent()
                .SetBorderThickness(UIThickness.All(0, 0, 0, 1))
                .SetBorderColor(UIThemeColor.Border)
                .SetPadding(UIThickness.All(0, 0, 0, 6))
                .AddChild(row)
            : new ContainerComponent()
                .SetPadding(UIThickness.All(0, 6, 0, 6))
                .AddChild(row);
    }

    private static TextComponent CreateCell(string value, double width, bool header)
        => new TextComponent()
            .SetTitle(value)
            .SetTitleType(header ? UITextAppearance.Overline : UITextAppearance.Body)
            .SetTitleColor(header ? UIThemeColor.Muted : null)
            .SetWidth(UILayoutLength.Absolute(width));

    /// <summary>
    /// Both axes at once: the picture keeps its size and the box moves over it.
    /// </summary>
    private static ContainerComponent CreatePictureGroup()
    {
        return DemoUI.CreateGroup(null, "A picture larger than its box",
            content => content.AddChild(CreateViewport(240)
                .SetScroll(UIScrollMode.Auto, UIScrollMode.Auto)
                .AddChild(new ImageComponent()
                    .SetSource(DemoImages.HarbourSky)
                    .SetFit(UIImageFit.Cover)
                    .SetWidth(UILayoutLength.Absolute(900))
                    .SetHeight(UILayoutLength.Absolute(560))
                )
            )
        );
    }

    private static ScrollContainerComponent CreateViewport(double height)
        => new ScrollContainerComponent()
            .SetHeight(UILayoutLength.Absolute(height))
            .SetPadding(UIThickness.Uniform(12))
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderColor(UIThemeColor.Border);
}
