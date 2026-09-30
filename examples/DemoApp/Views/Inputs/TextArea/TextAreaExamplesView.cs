using System.Linq;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// The multi-line field: how tall it starts, whether the reader may pull it taller, what a limit looks like, and a chat's composer
/// that grows with its text and sends on Enter.
/// </summary>
internal sealed class TextAreaExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string ChatGroup = nameof(TextAreaExamplesController.ChatGroup);

    /// <summary>The form the composer's Enter submits: the Send button at its end names the same one.</summary>
    private const string ChatFormId = "text-area-examples-chat";

    private const string Incident = "The scheduler stopped acknowledging heartbeats at 09:14 UTC. Three regions failed over cleanly; eu-west held its lease for another ninety seconds and served stale reads for the duration.";

    private static readonly string[] Emoji = ["😀", "😂", "😍", "🤔", "😢", "👍", "👀", "🙏", "🎉", "🔥", "🚀", "✅"];

    public static string ViewKey => "demo.inputs.text-area.examples";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateFormGroup(), CreateChatGroup()], [CreateCommentGroup(), CreateGrowGroup()]));

        _ = container.AddChild(CreateActionSizesGroup());

        _ = container.AddChild(CreateHeightGroup());
    }

    /// <summary>The ordinary case: a labelled box of prose, and the same box with nothing in it yet.</summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(12)
                .AddChild(new TextAreaComponent()
                    .SetTitle("Incident summary")
                    .SetIcon(DemoIcons.FileText)
                    .SetValue(Incident)
                    .SetRows(4)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Follow-up actions")
                    .SetPlaceholder("One per line — owner, then what they are doing about it.")
                    .SetRows(3)
                )
        );
    }

    /// <summary>
    /// The other place it lives: a box that is sent rather than saved, kept small so the thread stays readable.
    /// </summary>
    private static ContainerComponent CreateCommentGroup()
    {
        return DemoUI.CreateExample("A box that is sent",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.MessageSquare)
                    .SetTitle("Add a comment")
                    .SetDescription("Everyone watching the incident is notified")
                )
                .SetContent(new TextAreaComponent()
                    .SetPlaceholder("What did you find?")
                    .SetRows(3)
                    .SetMaxLength(280)
                )
                .SetFooter(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTitle("Comment")
                    )
                    .AddChild(UIButtons.Ghost("Discard"))
                )
        );
    }

    /// <summary>
    /// A chat's composer: one row that grows to six with its text, Enter sends and Shift+Enter breaks the line, and its buttons stand
    /// at its ends — attach and emoji before the text, Send after it, the form's submit.
    /// </summary>
    /// <remarks>Send appends the draft to the channel, with the moment it was sent, and empties the box.</remarks>
    private static ContainerComponent CreateChatGroup()
    {
        return DemoUI.CreateExample("A chat composer",
            UILayout.Stack(12)
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(ChatGroupContext.Messages), UIBindingScope.Relative)
                    .SetSpacing(12)
                    .SetScrollAnchor(UIScrollAnchor.End)
                    .SetMaxHeight(UILayoutLength.Absolute(260))
                    .SetTemplate(UILayout.Split(
                        new TextComponent()
                            .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                            .SetIconColor(UIThemeColor.Muted)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative),
                        new TimestampComponent()
                            .SetFormat(UITimestampFormat.Time)
                            .BindValue(nameof(DemoChatMessage.At), UIBindingScope.Relative)
                            .SetTextType(UITextAppearance.Caption)
                            .SetColor(UIThemeColor.Muted)
                            .SetHorizontalAlignment(UIAlignment.End)
                            .SetVerticalAlignment(UIAlignment.Start),
                        sideSpan: 5,
                        spacing: 12
                        )
                    )
                )
                .AddChild(new TextAreaComponent(TextAreaExamplesController.ComposerId)
                    .SetFormId(ChatFormId)
                    .SetPlaceholder("Write to the on-call channel")
                    .SetRows(1)
                    .SetAutoGrow(6)
                    .SetSubmitOnEnter()
                    .BindValue(nameof(ChatGroupContext.Draft), UIBindingScope.Relative)
                    .AddLeadingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Attach))
                        .SetTooltip("Attach a file")
                    )
                    // A tile's press puts its key at the caret on the page itself: no round trip, and the draft's own undo takes it back.
                    .AddLeadingAction(new FlyoutComponent()
                        .SetFlyoutPlacement(UIPopupPlacement.TopStart)
                        .SetAnchor(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Emoji))
                            .SetTooltip("Emoji")
                        )
                        .SetContent(new ItemsViewComponent()
                            .SetItems(CreateEmoji())
                            .SetLayoutType(UIItemsLayoutType.Wrap)
                            .SetSpacing(2)
                            .SetWidth(UILayoutLength.Absolute(236))
                            .SetTemplate(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                                .InteractOn(EventNames.Click, InsertTextEffect.CurrentItemKey(TextAreaExamplesController.ComposerId))
                            )
                        )
                    )
                    // A quick reply is the controller's words, so its command answers with the text to insert rather than rewriting the draft.
                    .AddLeadingAction(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                        .SetTooltip("Quick replies")
                        .SetItems(TextAreaExamplesController.QuickReplies())
                        .OnItemClickWithItemKey(nameof(TextAreaExamplesController.InsertQuickReply))
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTooltip("Send")
                        .OnSubmit(ChatFormId, nameof(TextAreaExamplesController.Send))
                    )
                ),
            note: "Type past the edge and the box grows a row at a time, to six, then scrolls. Enter presses Send, the form's submit, with the text committed first; Shift+Enter breaks the line. "
                + "The emoji panel is a `FlyoutComponent` among the field's actions: a tile puts its emoji where the caret was, in place of a selection, on the page alone (`InsertTextEffect.CurrentItemKey`). "
                + "The bolt is a split button in `Menu` mode, as compact as its neighbours; a quick reply runs a command that answers `InsertTextEffect.Literal` with its words.",
            context: ChatGroup
        );
    }

    /// <summary>The panel's tiles, each keyed by its emoji, so the key is the text a press inserts.</summary>
    private static TextItem[] CreateEmoji()
        => [.. Emoji.Select(static emoji => new TextItem { Id = emoji, Title = emoji, IsContent = true })];

    /// <summary>
    /// A split button among a field's actions takes the others' compact height whatever its own size, so the row stays level with the text.
    /// </summary>
    private static ContainerComponent CreateActionSizesGroup()
    {
        return DemoUI.CreateExample("A split button among a field's actions",
            UILayout.Stack(12)
                .AddChild(new TextAreaComponent()
                    .SetPlaceholder("Normal field, a small split button")
                    .SetRows(1)
                    .AddLeadingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Attach))
                        .SetTooltip("Attach a file")
                    )
                    .AddLeadingAction(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                        .SetTooltip("Quick replies")
                        .SetItems(TextAreaExamplesController.QuickReplies())
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTooltip("Send")
                    )
                )
                .AddChild(new TextAreaComponent()
                    .SetSize(UIInputSize.Small)
                    .SetPlaceholder("Small field, a large split button")
                    .SetRows(1)
                    .AddLeadingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Attach))
                        .SetTooltip("Attach a file")
                    )
                    .AddLeadingAction(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Large)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                        .SetTooltip("Quick replies")
                        .SetItems(TextAreaExamplesController.QuickReplies())
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTooltip("Send")
                    )
                ),
            note: "Whatever `Size` the split button is given, among a field's actions it stands as tall as a plain action, so the leading group and Send sit level with the text."
        );
    }

    /// <summary>
    /// A growing box outside a chat: it starts at two rows, takes the height its text needs up to eight, and scrolls past that.
    /// </summary>
    private static ContainerComponent CreateGrowGroup()
    {
        return DemoUI.CreateExample("Grows with its text",
            new TextAreaComponent()
                .SetTitle("Follow-ups")
                .SetValue("Resize db-eu-west-2 to Dedicated.\nAlert on a disk at 80 per cent, not 95.\nMove the backups of eu-west off the database's own disk.")
                .SetRows(2)
                .SetAutoGrow(8),
            note: "`SetRows(2).SetAutoGrow(8)`: two rows empty, eight at most. While it grows the reader cannot drag its corner, whatever `Resize` says."
        );
    }

    /// <summary>
    /// The two decisions the author makes once: how tall the box starts, and whether the reader may change that.
    /// </summary>
    /// <remarks>Side by side, because the pair is a choice — stacked, three boxes of prose read as one long form.</remarks>
    private static ContainerComponent CreateHeightGroup()
    {
        return DemoUI.CreateExample("How tall it starts, and who may change it",
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("Two rows, fixed — a line in a dense form", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue("A note nobody should turn into an essay.")
                    .SetRows(2)
                    .SetResize(UITextAreaResizeMode.None)
                    )
                )
                .AddChild(UIPage.Labelled("Four rows, the reader may pull it taller", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue(Incident)
                    .SetRows(4)
                    .SetResize(UITextAreaResizeMode.Vertical)
                    )
                )
                .AddChild(UIPage.Labelled("Six rows — the writing is the page", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue(Incident)
                    .SetRows(6)
                    .SetResize(UITextAreaResizeMode.Vertical)
                    )
                ),
            columns: 24,
            note: "`Rows` is the height the box is drawn at, not where it stays; `Vertical` is the only resize a column survives, since the other two let the box push its neighbours out."
        );
    }
}
