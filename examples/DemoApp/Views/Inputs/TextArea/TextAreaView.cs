using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// One multi-line field and every property that can be bound to it; then where it is used, a box that grows with its text, how tall it
/// starts, and a thread's comment box whose Enter posts and whose Escape takes an edit back.
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
    private const string Incident = "The scheduler stopped acknowledging heartbeats at 09:14 UTC. Three regions failed over cleanly; eu-west held its lease for another ninety seconds and served stale reads for the duration.";

    public static string ViewKey => "demo.inputs.text-area";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TextAreaComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(TextValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(TextValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(TextValueGroupContext.Size)}")
            .BindMaxLength($"{ValueGroup}.{nameof(TextValueGroupContext.MaxLength)}")
            .BindTrimInput($"{ValueGroup}.{nameof(TextValueGroupContext.TrimInput)}")
            .BindAppearance($"{FieldGroup}.{nameof(TextAreaFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(TextAreaFieldGroupContext.Placeholder)}")
            .BindRows($"{FieldGroup}.{nameof(TextAreaFieldGroupContext.Rows)}")
            .BindMaxRows($"{FieldGroup}.{nameof(TextAreaFieldGroupContext.MaxRows)}")
            .BindResize($"{FieldGroup}.{nameof(TextAreaFieldGroupContext.Resize)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeFill($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeFill)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(TextAreaController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(TextAreaController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(TextAreaController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(TextAreaController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TextAreaController.CycleBorderOption))
        );

    // Every group across the page: the two places side by side, then the growing box, then the three heights in thirds, then the thread
    // at a thread's width.
    protected override IVisualComponent[] CreateExamples()
        => [CreateFormGroup(), CreateGrowGroup(), CreateHeightGroup(), CreateCommentsGroup()];

    /// <summary>
    /// The two places it lives: a labelled box of prose that is saved with the page, and a small box that is sent, kept small so the
    /// thread above it stays readable.
    /// </summary>
    /// <remarks>The saved one outlined, as a record's fields are; the composer Tonal, as a field its card already frames is.</remarks>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Where it is used",
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
                        .SetAppearance(UIInputAppearance.Tonal)
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
        return DemoUI.CreateExample("Grows with its text",
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
        return DemoUI.CreateExample("How tall it starts, and who may change it",
            UILayout.Columns(24,
                DemoUI.CreateLabelled("Two rows, fixed — a line in a dense form", new TextAreaComponent()
                    .SetValue("A note nobody should turn into an essay.")
                    .SetRows(2)
                    .SetResize(UITextAreaResizeMode.None)
                ),
                DemoUI.CreateLabelled("Four rows, the reader may pull it taller", new TextAreaComponent()
                    .SetValue(Incident)
                    .SetRows(4)
                    .SetResize(UITextAreaResizeMode.Vertical)
                ),
                DemoUI.CreateLabelled("Six rows — the writing is the page", new TextAreaComponent()
                    .SetValue(Incident)
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
        return DemoUI.CreateExample("A thread's comment box",
            UILayout.Stack(12)
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(CommentsGroupContext.Comments), UIBindingScope.Relative)
                    .SetSpacing(8)
                    .SetTemplate(new ContainerComponent()
                        .SetColumn(24, UIGridUnit.Auto())
                        // A paragraph, not a text: a comment keeps the lines Shift+Enter broke it into.
                        .AddChild(new ParagraphComponent()
                            .SetIcon(DemoIcons.MessageSquare)
                            .SetIconColor(UIThemeColor.Muted)
                            .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .BindDescription(nameof(DemoCommentItem.Body), UIBindingScope.Relative)
                            .SetDescriptionType(UITextAppearance.Body)
                            .SetPlacement(1, 1, 23, 1)
                        )
                        .AddChild(UIIconButtons.Edit()
                            .SetSize(UIButtonSize.Small)
                            .SetMargin(UIThickness.All(8, 0, 0, 0))
                            .SetVerticalAlignment(UIAlignment.Start)
                            .BindVisibility(nameof(DemoCommentItem.EditVisibility), UIBindingScope.Relative)
                            .OnClick(nameof(TextAreaController.EditComment), UIAction.ArgCurrentItemKey("id"))
                            .SetPlacement(24, 1, 1, 1)
                        )
                    )
                )
                // Tonal, as a field its thread already frames is; one row until there is more to say.
                .AddChild(new TextAreaComponent()
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetPlaceholder("Add to the thread")
                    .SetRows(1)
                    .SetAutoGrow(6)
                    .BindValue(nameof(CommentsGroupContext.Draft), UIBindingScope.Relative)
                    .OnEnter(nameof(TextAreaController.PostComment))
                    .OnEscape(nameof(TextAreaController.DropCommentEdit))
                    .BindCancelOnEscape(nameof(CommentsGroupContext.Editing), UIBindingScope.Relative)
                )
                .SetMaxWidth(UILayoutLength.Absolute(560))
                .SetHorizontalAlignment(UIAlignment.Start),
            columns: 24,
            note: "`OnEnter`: Enter posts what the box holds, then runs the command, and Shift+Enter breaks the line. Press the pencil on your own comment: the box takes its words, and Enter saves the edit. Escape (`OnEscape`) puts the words back as they were, sends nothing, runs its command, and the box gets back what it held before. Escape is that cancel only while an edit is under way (`BindCancelOnEscape`): otherwise it leaves the box, and a comment half written stays.",
            context: CommentsGroup
        );
    }
}
