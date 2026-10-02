using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What only a live keyboard shows: when a typed value reaches the server, what <c>TrimInput</c> sends, whether a failing rule
/// stops a submit, where a rule's words go — under the form, as a mark inside a row, beside a list —, a bound the server holds, and a
/// value another component previews while it moves.
/// </summary>
/// <remarks>The page is words, not samples: every title, note, caption, rule's message and line is a key, in each of the demo's languages.</remarks>
internal sealed class ValuesView : DemoMechanismView, IUIViewDefinition
{
    /// <summary>The two rows of the note group name their own editor, since the two carry different kinds of message.</summary>
    private const string LimitTemplate = "limit";
    private const string OwnerTemplate = "owner";
    private const string ErrorsId = "values-elsewhere-errors";
    private const string BoundsGroup = nameof(ValuesController.BoundsGroup);
    private const string Words = "demo.mechanisms.values.";

    private const string SubmitFormId = "deploy-form";
    private const string BlockFormId = "service-form";
    private const string BlockErrorsId = "service-form-errors";

    // The two sources the preview group's copies name.
    private const string PreviewLevelId = "values-preview-level";
    private const string PreviewNameId = "values-preview-name";

    public static string ViewKey => "demo.mechanisms.values";

    protected override string ComponentRoute => "/mechanisms/values";
    protected override string Header => "demo.mechanisms.values.header";
    protected override string HeaderDescription => "demo.mechanisms.values.description";

    protected override void DrawContent(WrapPanelComponent container)
        // Paired by height, two short groups stacked beside a tall one: three to the left and five to the right left holes and two
        // groups alone in their rows.
        => _ = container
            .AddChildren(DemoUI.CreateColumns([CreateChangeGroup()], [CreateTrimGroup()]))
            .AddChildren(DemoUI.CreateHalf(CreateSubmitGroup(), CreateNoteGroup()), CreateFilterGroup())
            .AddChildren(CreateBlockGroup(), DemoUI.CreateHalf(CreateElsewhereGroup(), CreateBoundsGroup()))
            .AddChild(CreatePreviewGroup());

    /// <summary>
    /// A two-way value syncs on the native <c>change</c> event — on blur or Enter, not per keystroke.
    /// </summary>
    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.ChangeGroup), Words + "change.title",
            content => content.AddChild(new TextInputComponent()
                .SetTitle(Words + "service-name")
                .BindValue(nameof(TextInputChangeGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "change.note",
            words: true
        );
    }

    /// <summary>
    /// <c>DebounceMilliseconds</c> commits the value a moment after the viewer pauses, through the same two-way path.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.FilterGroup), Words + "filter.title",
            content => content.AddChild(UILayout.Stack(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextInputComponent()
                    .SetTitle(Words + "filter.field")
                    .SetPlaceholder(Words + "filter.placeholder")
                    .SetPrefixIcon(DemoIcons.Outline(DemoIcons.Search))
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(250)
                    .BindValue(nameof(TextInputFilterGroupContext.Query), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.Filter))
                )
                .AddChild(new ItemsViewComponent()
                    .SetSpacing(4)
                    .BindItems(nameof(TextInputFilterGroupContext.Services), UIBindingScope.Relative)
                )
            ),
            note: Words + "filter.note",
            words: true
        );
    }

    /// <summary>
    /// Trimming happens client-side, before the value is sent; the clear button takes the same path.
    /// </summary>
    private static ContainerComponent CreateTrimGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.TrimGroup), Words + "trim.title",
            content => content.AddChild(new TextInputComponent()
                .SetTitle(Words + "trim.field")
                .SetTrimInput()
                .SetShowClearButton()
                .BindValue(nameof(TextInputTrimGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.RecordTrimmedChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "trim.note",
            words: true
        );
    }

    /// <summary>
    /// The <c>Submit</c> rules run on the press, and any error that stands then — theirs, or a <c>Change</c>/<c>Blur</c> rule's that
    /// already failed — stops it; a warning or an info does not.
    /// </summary>
    /// <remarks>The second field is bound <c>OnSubmit</c>, so its value reaches the controller with the command.</remarks>
    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.SubmitGroup), Words + "submit.title",
            content =>
            {
                _ = content.AddChild(UILayout.Stack(12)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(new TextInputComponent()
                        .SetTitle(Words + "owner-email")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Email), UIBindingScope.Relative)
                        .BindValidation(nameof(TextInputSubmitGroupContext.EmailValidation), UIBindingScope.Relative)
                        .Required(Words + "submit.email.required", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", Words + "email.invalid", UIValidationTrigger.Blur)
                        .Regex("@orvane\\.example$", Words + "email.outside", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle(Words + "submit.notes")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Notes), UIBindingScope.Relative, UIBindingMode.OnSubmit)
                        .Required(Words + "submit.notes.info", UIValidationTrigger.Blur, UIValidationSeverity.Info)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnSubmit(SubmitFormId, nameof(ValuesController.Submit))
                        .SetTitle(Words + "submit.save")
                    )
                );
            },
            note: Words + "submit.note",
            words: true
        );
    }

    /// <summary>
    /// Three fields send their words to one paragraph under the form (<c>ValidationInto</c>): each holds a line of it, and a field put
    /// right takes only its own line away. The fields keep the severity on their edge and nothing else.
    /// </summary>
    private static ContainerComponent CreateBlockGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.BlockGroup), Words + "block.title",
            content =>
            {
                _ = content.AddChild(UILayout.Stack(12)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(new TextInputComponent()
                        .SetTitle(Words + "service-name")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Name), UIBindingScope.Relative)
                        .Required(Words + "block.name.required", UIValidationTrigger.Submit)
                        .Regex("^[a-z0-9-]+$", Words + "block.name.pattern", UIValidationTrigger.Blur)
                        .ValidationInto(BlockErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle(Words + "block.port")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Port), UIBindingScope.Relative)
                        .Required(Words + "block.port.required", UIValidationTrigger.Submit)
                        .Regex("^[0-9]{2,5}$", Words + "block.port.pattern", UIValidationTrigger.Blur)
                        .ValidationInto(BlockErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle(Words + "owner-email")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Email), UIBindingScope.Relative)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", Words + "email.invalid", UIValidationTrigger.Blur)
                        .Regex("@orvane\\.example$", Words + "email.outside", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                        .ValidationInto(BlockErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddChild(new ParagraphComponent(BlockErrorsId)
                        .SetDescription(" ")
                        .SetDescriptionColor(UIThemeColor.Danger)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnSubmit(BlockFormId, nameof(ValuesController.SubmitBlock))
                        .SetTitle(Words + "block.create")
                    )
                );
            },
            note: Words + "block.note",
            words: true
        );
    }

    /// <summary>
    /// The two ways a row comes to have something to say, in the two rows of one list: the field's own rules, answered on every
    /// keystroke, and a message the controller put on the draft, which arrives with the save's answer. Inside a row there is no
    /// line for either, so both are a mark that speaks in a tooltip — at the field's corner while the row is open, and beside the
    /// value once it closes.
    /// </summary>
    private static ContainerComponent CreateNoteGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.NoteGroup), Words + "note.title",
            content => content.AddChild(new KeyValueActionComponent()
                .BindItems(nameof(KeyValueActionNoteGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate(LimitTemplate, new NumberInputComponent()
                    .SetShowStepper()
                    .SetStep(50)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, Words + "limit.zero", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 200, Words + "note.limit.above", UIValidationSeverity.Warning)
                )
                .AddValueInputTemplate(OwnerTemplate, new TextInputComponent()
                    .BindValidation(nameof(NotedRowItem.Note), UIBindingScope.Relative)
                )
                .EnableEditing(nameof(ValuesController.SaveNotedRow))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: Words + "note.note",
            words: true
        );
    }

    /// <summary>
    /// Both fields send their words to the same text beside the list: the rows keep the severity on their edge alone, which is
    /// the shape a settings list wants when the errors belong beside it rather than inside its rows.
    /// </summary>
    private static ContainerComponent CreateElsewhereGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.ElsewhereGroup), Words + "elsewhere.title",
            content => content
                .AddChild(new KeyValueActionComponent()
                    .BindItems(nameof(KeyValueActionElsewhereGroupContext.Items), UIBindingScope.Relative)
                    .AddValueInputTemplate("limit", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, Words + "limit.zero", UIValidationSeverity.Error)
                        .ValidationInto(ErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddValueInputTemplate("retries", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 5, Words + "elsewhere.retries.above", UIValidationSeverity.Warning)
                        .ValidationInto(ErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .EnableEditing(nameof(ValuesController.SaveElsewhereRow))
                    .SetPlacement(1, 1, 24, 1)
                )
                // A paragraph, not a text: its description keeps the line breaks, so each field's words stand on a line of their own.
                .AddChild(new ParagraphComponent(ErrorsId)
                    .SetDescription(" ")
                    .SetDescriptionColor(UIThemeColor.Danger)
                    .SetPlacement(1, 2, 24, 1)
                ),
            note: Words + "elsewhere.note",
            words: true
        );
    }

    /// <summary>
    /// A bound the server holds as well as the page, on a number and on a day: the controller's copy, written under the group, never
    /// goes past either.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample(Words + "bounds.title",
            UILayout.Stack(16)
                .AddChild(new NumberInputComponent()
                    .SetTitle("demo.mechanisms.values.bounds.replicas")
                    .SetRange(1, 10)
                    .SetShowStepper()
                    .BindValue(nameof(ServerBoundsGroupContext.Replicas), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.ReplicasChanged))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("demo.mechanisms.values.bounds.keep-until")
                    .SetMax(ServerBoundsGroupContext.Latest)
                    .BindValue(nameof(ServerBoundsGroupContext.KeepUntil), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.KeepUntilChanged))
                ),
            note: Words + "bounds.note",
            context: BoundsGroup,
            words: true
        );
    }

    /// <summary>
    /// <c>InteractCopyValue</c>: a slider's every step reaches a bar and the typed words a heading while the reader moves them, on the
    /// page alone — nothing here is bound, so nothing goes to the server at all.
    /// </summary>
    private static ContainerComponent CreatePreviewGroup()
    {
        return DemoUI.CreateExample(Words + "preview.title",
            UILayout.Columns(24,
                UILayout.Stack(12)
                    .AddChild(new SliderComponent(PreviewLevelId)
                        .SetTitle("demo.mechanisms.values.preview.level")
                        .SetRange(0, 100)
                        .SetStep(1)
                        .SetShowValue()
                        .SetValue(40)
                    )
                    .AddChild(new ProgressComponent()
                        .SetValue(40)
                        .InteractCopyValue(PreviewLevelId, ProgressComponent.ValueProperty)
                    ),
                UILayout.Stack(12)
                    .AddChild(new TextInputComponent(PreviewNameId)
                        .SetTitle("demo.mechanisms.values.preview.release")
                        .SetPlaceholder("demo.mechanisms.values.preview.placeholder")
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("demo.mechanisms.values.preview.untitled")
                        .SetTitleType(UITextAppearance.Title)
                        .InteractCopyValue(PreviewNameId, ITextBaseComponent.TitleProperty)
                    )
            ),
            note: Words + "preview.note",
            columns: 24,
            words: true
        );
    }
}
