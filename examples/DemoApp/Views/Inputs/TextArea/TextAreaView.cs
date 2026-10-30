using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// One multi-line field and every property that can be bound to it; then where it is used, a box that grows with its text, how tall it
/// starts, a thread's comment box whose Enter posts and whose Escape takes an edit back, and a composer's own buttons.
/// </summary>
/// <remarks>A text area has no affixes, no input type and no clear button; <c>Rows</c> is only where it starts. <c>SubmitOnEnter</c> and the field's actions have no row: Enter needs a form to submit, and the actions are components; the Chat screen's composer has both.</remarks>
internal sealed class TextAreaView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(TextAreaController.ValueGroup);
    private const string FieldGroup = nameof(TextAreaController.FieldGroup);
    private const string ContentGroup = nameof(TextAreaController.ContentGroup);
    private const string BadgeGroup = nameof(TextAreaController.BadgeGroup);
    private const string BorderGroup = nameof(TextAreaController.BorderGroup);
    private const string CommentsGroup = nameof(TextAreaController.CommentsGroup);
    private const string TriggersGroup = nameof(TextAreaController.TriggersGroup);
    private const string Incident = "The scheduler stopped acknowledging heartbeats at 09:14 UTC. Three regions failed over cleanly; eu-west held its lease for another ninety seconds and served stale reads for the duration.";

    public static string ViewKey => "demo.inputs.text-area";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TextAreaComponent()
            .BindStandard()
            .BindValue<TextAreaController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<TextAreaController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<TextAreaController>(static x => x.ValueGroup.Size)
            .BindMaxLength<TextAreaController>(static x => x.ValueGroup.MaxLength)
            .BindTrimInput<TextAreaController>(static x => x.ValueGroup.TrimInput)
            .BindAppearance<TextAreaController>(static x => x.FieldGroup.Appearance)
            .BindPlaceholder<TextAreaController>(static x => x.FieldGroup.Placeholder)
            .BindRows<TextAreaController>(static x => x.FieldGroup.Rows)
            .BindMaxRows<TextAreaController>(static x => x.FieldGroup.MaxRows)
            .BindResize<TextAreaController>(static x => x.FieldGroup.Resize)
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    // Every group across the page: the two places side by side, then the growing box, then the three heights in thirds, then the thread
    // at a thread's width, then the actions at a composer's.
    protected override IVisualComponent[] CreateExamples()
        => [CreateFormGroup(), CreateGrowGroup(), CreateHeightGroup(), CreateCommentsGroup(), CreateActionsGroup(), CreateTriggersGroup()];

    /// <summary>
    /// The two places it lives: a labelled box of prose that is saved with the page, and a small box that is sent, kept small so the
    /// thread above it stays readable.
    /// </summary>
    /// <remarks>The saved one outlined, as a record's fields are; the composer Filled, as a field its card already frames is.</remarks>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Form field & card composer",
            UILayout.Columns(24,
                new TextAreaComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Incident summary")
                    .SetIcon(DemoIcons.FileText)
                    .SetValue(Incident)
                    .SetRows(4)
                    // As tall as its prose at any width: four rows held a tablet's lines with the fifth showing through the padding.
                    .SetAutoGrow(12),
                new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.MessageSquare)
                        .SetTitle("Add a comment")
                        .SetDescription("Everyone watching the incident is notified")
                    )
                    .SetContent(new TextAreaComponent()
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetPlaceholder("What did you find?")
                        .SetRows(3)
                        .SetMaxLength(280)
                    )
                    .SetFooter(UILayout.Row(8)
                        .AddChild(new ButtonComponent()
                            .SetVariant(UIButtonVariant.Primary)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                            .SetTitle("Comment")
                        )
                        .AddChild(UIButtons.Ghost("Discard"))
                    )
            ),
            columns: 24,
            note: "Saved, the box is labelled and as tall as its prose; sent, it has no label of its own, a limit, and its buttons under it."
        );
    }

    /// <summary>
    /// A growing box outside a chat: it starts at two rows, takes the height its text needs up to eight, and scrolls past that.
    /// </summary>
    private static ContainerComponent CreateGrowGroup()
    {
        return DemoUI.CreateExample("Auto-grow rows",
            new TextAreaComponent()
                .SetTitle("Follow-ups")
                .SetValue("Resize db-eu-west-2 to Dedicated.\nAlert on a disk at 80 per cent, not 95.\nMove the backups of eu-west off the database's own disk.")
                .SetRows(2)
                .SetAutoGrow(8),
            columns: 24,
            note: "`SetRows(2).SetAutoGrow(8)`: two rows empty, eight at most. While it grows the reader cannot drag its corner, whatever `Resize` says."
        );
    }

    /// <summary>
    /// The two decisions the author makes once: how tall the box starts, and whether the reader may change that.
    /// </summary>
    /// <remarks>Side by side in thirds, because the pair is a choice — stacked, three boxes of prose read as one long form.</remarks>
    private static ContainerComponent CreateHeightGroup()
    {
        return DemoUI.CreateExample("Initial rows & resize modes",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("Two rows, fixed — a line in a dense form", new TextAreaComponent()
                    .SetValue("A note nobody should turn into an essay.")
                    .SetAccessibleName("Two rows, fixed")
                    .SetRows(2)
                    .SetResize(UITextAreaResizeMode.None)
                ),
                DemoUI.CreateLabelled("Four rows, the reader may pull it taller", new TextAreaComponent()
                    .SetValue(Incident)
                    .SetAccessibleName("Four rows")
                    .SetRows(4)
                    .SetResize(UITextAreaResizeMode.Vertical)
                ),
                DemoUI.CreateLabelled("Six rows — the writing is the page", new TextAreaComponent()
                    .SetValue(Incident)
                    .SetAccessibleName("Six rows")
                    .SetRows(6)
                    .SetResize(UITextAreaResizeMode.Vertical)
                )
            ),
            columns: 24,
            note: "`Rows` is the height the box is drawn at, not where it stays; `Vertical` is the only resize a column survives, since the other two let the box push its neighbours out."
        );
    }

    /// <summary>
    /// A thread's comment box: Enter posts and Shift+Enter breaks the line; the pencil on the reader's own comment puts it in the box,
    /// Enter saves the edit and Escape takes it back. Escape is the box's cancel only while an edit is under way.
    /// </summary>
    private static ContainerComponent CreateCommentsGroup()
    {
        return DemoUI.CreateExample("Enter to post & Escape to cancel edit",
            UILayout.Stack(12)
                .AddChild(new ItemsViewComponent()
                    .BindItems<CommentsGroupContext>(static x => x.Comments, UIBindingScope.Relative)
                    .SetSpacing(8)
                    .SetTemplate(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        // A paragraph, not a text: a comment keeps the lines Shift+Enter broke it into.
                        .AddChild(new ParagraphComponent()
                            .SetIcon(DemoIcons.MessageSquare)
                            .SetIconColor(UIThemeColor.Muted)
                            .BindTitle<TextItem>(static x => x.Title, UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .BindDescription<DemoCommentItem>(static x => x.Body, UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(UIIconButtons.Edit()
                            .SetSize(UISize.Small)
                            .SetMargin(UIThickness.All(8, 0, 0, 0))
                            .SetVerticalAlignment(UIAlignment.Start)
                            .BindVisibility<DemoCommentItem>(static x => x.EditVisibility, UIBindingScope.Relative)
                            .OnClick(nameof(TextAreaController.EditComment), UIAction.ArgCurrentItemKey("id"))
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                )
                // Filled, as a field its thread already frames is; one row until there is more to say.
                .AddChild(new TextAreaComponent()
                    .SetAppearance(UIInputAppearance.Filled)
                    .SetPlaceholder("Add to the thread")
                    .SetRows(1)
                    .SetAutoGrow(6)
                    .BindValue<CommentsGroupContext>(static x => x.Draft, UIBindingScope.Relative)
                    .OnEnter(nameof(TextAreaController.PostComment))
                    .OnEscape(nameof(TextAreaController.DropCommentEdit))
                    .BindCancelOnEscape<CommentsGroupContext>(static x => x.Editing, UIBindingScope.Relative)
                )
                .SetMaxWidth(UILayoutLength.Absolute(560))
                .SetHorizontalAlignment(UIAlignment.Start),
            columns: 24,
            note: "`OnEnter`: Enter posts what the box holds, then runs the command, and Shift+Enter breaks the line. Press the pencil on your own comment: the box takes its words, and Enter saves the edit. Escape (`OnEscape`) puts the words back as they were, sends nothing, runs its command, and the box gets back what it held before. Escape is that cancel only while an edit is under way (`BindCancelOnEscape`): otherwise it leaves the box, and a comment half written stays.",
            context: CommentsGroup
        );
    }

    /// <summary>
    /// A composer's own buttons beside its text, and on a phone in a row under it — the tools at its two ends, the emoji and Send kept
    /// at the text's.
    /// </summary>
    private static ContainerComponent CreateActionsGroup()
    {
        ButtonComponent emoji = new ButtonComponent()
            .SetVariant(UIButtonVariant.Ghost)
            .SetIcon(DemoIcons.Outline(DemoIcons.Emoji))
            .SetTooltip("Emoji");

        return DemoUI.CreateExample("Leading/trailing actions & responsive bar",
            new TextAreaComponent()
                .SetAppearance(UIInputAppearance.Filled)
                .SetPlaceholder("Reply to the incident")
                .SetRows(1)
                .SetAutoGrow(6)
                .AddLeadingAction(UIIconButtons.Attach())
                .AddLeadingAction(emoji, inField: true)
                .AddTrailingAction(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Bolt))
                    .SetTooltip("Quick replies")
                )
                .AddTrailingAction(UIIconButtons.Send(), inField: true)
                .SetActionsBelow(UIResponsiveTier.Md)
                .SetMaxWidth(UILayoutLength.Absolute(560))
                .SetHorizontalAlignment(UIAlignment.Start),
            columns: 24,
            note: "`AddLeadingAction(emoji, inField: true)`, `AddTrailingAction(send, inField: true)` and `SetActionsBelow(UIResponsiveTier.Md)`: below the medium width the text takes the row between the emoji and Send, and the other buttons stand in a row under it, the leading ones at its start and the trailing ones at its end, each end under the field's own button; `belowAt: UIAlignment.End` stands a leading one at the end there, as the chat screen's quick replies. The same buttons move, so a flyout among them keeps its one panel."
        );
    }

    /// <summary>
    /// Inline trigger suggestions (<c>@</c> and <c>/</c>): a category with child <c>Items</c> steps into a second-level list on the
    /// page, while the Chat screen's <c>Files</c> category queries the server through <c>OnTriggerSearch</c>.
    /// </summary>
    private static ContainerComponent CreateTriggersGroup()
    {
        return DemoUI.CreateExample("Inline trigger suggestions (@ and /)",
            new TextAreaComponent()
                .SetAppearance(UIInputAppearance.Filled)
                .SetPlaceholder("Type @ to mention or / at the start of a line")
                .SetValue("Ask @Sam Ortega to check @db-eu-west-2 before the window.")
                .SetRows(2)
                .SetAutoGrow(6)
                .AddTrigger("@")
                .AddTrigger("/", startOfLineOnly: true)
                .SetTriggerItems(
                    new UITextTriggerItem("people", "People", "Members on call", DemoIcons.Outline(DemoIcons.Groups))
                    {
                        Trigger = "@",
                        Items =
                        [
                            new UITextTriggerItem("grace", "Grace Kim", "Databases", DemoIcons.Outline(DemoIcons.User), insertText: "@Grace Kim "),
                            new UITextTriggerItem("priya", "Priya Nair", "Reviews", DemoIcons.Outline(DemoIcons.User), insertText: "@Priya Nair "),
                            new UITextTriggerItem("sam", "Sam Ortega", "On call", DemoIcons.Outline(DemoIcons.User), insertText: "@Sam Ortega ")
                        ]
                    },
                    new UITextTriggerItem("services", "Services", "Regions and clusters", DemoIcons.Outline(DemoIcons.Server))
                    {
                        Trigger = "@",
                        Items =
                        [
                            new UITextTriggerItem("db-eu-west-2", "db-eu-west-2", "Primary · Amsterdam", DemoIcons.Outline(DemoIcons.Server), insertText: "@db-eu-west-2 "),
                            new UITextTriggerItem("api-eu-north-1", "api-eu-north-1", "Edge · Stockholm", DemoIcons.Outline(DemoIcons.Server), insertText: "@api-eu-north-1 ")
                        ]
                    },
                    new UITextTriggerItem("summary", "/summary", "Insert an incident summary template", DemoIcons.Outline(DemoIcons.FileText), insertText: "Summary: ")
                    {
                        Trigger = "/"
                    },
                    new UITextTriggerItem("runbook", "/runbook", "Insert the failover runbook link", DemoIcons.Outline(DemoIcons.Bolt), insertText: "Runbook: https://docs.orvane.example/runbooks/failover ")
                    {
                        Trigger = "/"
                    }
                )
                .OnTriggerClick(nameof(TextAreaController.ClickTriggerToken))
                .SetMaxWidth(UILayoutLength.Absolute(560))
                .SetHorizontalAlignment(UIAlignment.Start),
            columns: 24,
            note: "`AddTrigger(\"@\")`, `AddTrigger(\"/\", startOfLineOnly: true)` and `SetTriggerItems(...)`: typing a trigger opens a suggestion popup while the caret stays in the field. Choosing a category with child `Items` steps into its second-level list on the client (`Backspace` on an empty query steps back); setting `LoadsFromServer = true` on a trigger or category calls `OnTriggerSearch` so the server can populate `TriggerItems`, as the Chat screen's `Files` category does. Completed trigger tokens render as inline pills that delete as one unit on `Backspace`/`Delete` and run `OnTriggerClick` when clicked.",
            context: TriggersGroup
        );
    }
}
