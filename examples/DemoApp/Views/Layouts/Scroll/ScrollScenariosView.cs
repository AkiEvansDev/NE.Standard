using System.Collections.Generic;
using DemoApp.Controllers.Layouts.Scroll;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Scroll;

/// <summary>
/// What a viewport does that no property row can show: where it is looking after the content has grown.
/// </summary>
/// <remarks><c>ScrollAnchor</c> is visible only in the difference between two viewports after content arrives in both.</remarks>
internal sealed class ScrollScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string ChatGroup = nameof(ScrollScenariosController.ChatGroup);
    private const string LogGroup = nameof(ScrollScenariosController.LogGroup);

    public static string ViewKey => "demo.layouts.scroll.scenarios";

    protected override string ComponentRoute => "/layouts/scroll";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.scroll.header";
    protected override string HeaderDescription => "demo.layouts.scroll.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateChatGroup()],
            [CreateBuildLogGroup()]
        ));
    }

    /// <summary>
    /// The same message arriving in two viewports: one follows it, the other stays where it was left.
    /// </summary>
    private static ContainerComponent CreateChatGroup()
    {
        return DemoUI.CreateGroup(ChatGroup, "The same message arriving in two viewports",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(DemoUI.CreateCaption("End — follows what arrives"))
                .AddChild(CreateChat(anchored: true))
                .AddChild(DemoUI.CreateCaption("None — stays where it was"))
                .AddChild(CreateChat(anchored: false))
                .AddChild(new ParagraphComponent()
                    .SetDescription("Scroll the anchored one up and send again: it stays where you left it, and takes the pin back when you return to the bottom.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Send a message"] = nameof(ScrollScenariosController.SendMessage)
            }),
            note: "Send a message: one viewport is showing what just arrived, the other is still where it was left. The only difference between them is ScrollAnchor."
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

        return viewport.AddChild(new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(10)
            .AddChild(ScrollDemo.CreateMessage("Robin", "The staging deploy is stuck on the health check again.", false, 280))
            .AddChild(ScrollDemo.CreateMessage("You", "Which replica?", true, 280))
            .AddChild(ScrollDemo.CreateMessage("Robin", "Two of eight, both in eu-west-1.", false, 280))
            .AddChild(ScrollDemo.CreateMessage("You", "Same pair as Tuesday. Rolling back to 480 while I look.", true, 280))
            .AddChild(ScrollDemo.CreateMessage("Robin", "Rollback is green, traffic is on the old revision.", false, 280))
            .AddChild(CreateReply("Alex", "I have the logs — the gate times out on the migration, not the app.", nameof(ChatGroupContext.Reply1)))
            .AddChild(CreateReply("You", "Then it is the index rebuild. That ran long on Tuesday too.", nameof(ChatGroupContext.Reply2)))
            .AddChild(CreateReply("Alex", "Raising the gate to ten minutes and queueing 481 again.", nameof(ChatGroupContext.Reply3)))
            .AddChild(CreateReply("Robin", "481 is green. Eight of eight, four minutes twelve.", nameof(ChatGroupContext.Reply4)))
        );
    }

    // Already in the tree and hidden: Visible is display:none, so revealing one grows the content.
    private static SurfaceComponent CreateReply(string author, string text, string flag)
        => ScrollDemo.CreateMessage(author, text, author == "You")
            .BindVisibility($"{ChatGroup}.{flag}");

    /// <summary>
    /// Output from a job that has not finished, where the anchor alone keeps the newest line in sight.
    /// </summary>
    private static ContainerComponent CreateBuildLogGroup()
    {
        return DemoUI.CreateGroup(LogGroup, "A job that is still running",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new ScrollContainerComponent()
                    .VerticalScrollOnly()
                    .AnchorToEnd()
                    .SetHeight(UILayoutLength.Absolute(200))
                    .SetPadding(UIThickness.Uniform(12))
                    .SetBorderThickness(UIThickness.Uniform(1))
                    .SetBorderColor(UIThemeColor.Border)
                    .AddChild(new ParagraphComponent()
                        .BindDescription($"{LogGroup}.{nameof(BuildLogGroupContext.Output)}")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The newest line stays in sight without the reader chasing it down the pane.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Append output"] = nameof(ScrollScenariosController.AppendOutput)
            }),
            note: "The other shape the property was invented for — output nobody is scrolling through, where the newest line has to stay in sight on its own."
        );
    }
}
