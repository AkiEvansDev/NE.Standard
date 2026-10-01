using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What only a live keyboard shows: when a typed value reaches the server, what <c>TrimInput</c> sends, whether a failing rule
/// stops a submit, where a rule's words go — under the form, as a mark inside a row, beside a list — and a bound the server holds.
/// </summary>
internal sealed class ValuesView : DemoMechanismView, IUIViewDefinition
{
    /// <summary>The two rows of the note group name their own editor, since the two carry different kinds of message.</summary>
    private const string LimitTemplate = "limit";
    private const string OwnerTemplate = "owner";
    private const string ErrorsId = "values-elsewhere-errors";
    private const string BoundsGroup = nameof(ValuesController.BoundsGroup);

    private const string SubmitFormId = "deploy-form";
    private const string BlockFormId = "service-form";
    private const string BlockErrorsId = "service-form-errors";

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
            .AddChildren(CreateBlockGroup(), DemoUI.CreateHalf(CreateElsewhereGroup(), CreateBoundsGroup()));

    /// <summary>
    /// A two-way value syncs on the native <c>change</c> event — on blur or Enter, not per keystroke.
    /// </summary>
    private static ContainerComponent CreateChangeGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.ChangeGroup), "Commit on change",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name")
                .BindValue(nameof(TextInputChangeGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.RecordChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 120,
            note: "Type into the field and nothing is logged until focus leaves it: a two-way value syncs on commit, not per keystroke, and that gap is the behaviour rather than a delay."
        );
    }

    /// <summary>
    /// <c>DebounceMilliseconds</c> commits the value a moment after the viewer pauses, through the same two-way path.
    /// </summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.FilterGroup), "Filter as you type",
            content => content.AddChild(UILayout.Stack(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextInputComponent()
                    .SetTitle("Find a service")
                    .SetPlaceholder("Type a few letters")
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
            contentMinHeight: 260,
            note: "The value commits a quarter of a second after the last keystroke, and the controller answers with the list — nothing is filtered in the browser."
        );
    }

    /// <summary>
    /// Trimming happens client-side, before the value is sent; the clear button takes the same path.
    /// </summary>
    private static ContainerComponent CreateTrimGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.TrimGroup), "Trim and clear",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name (padded)")
                .SetTrimInput()
                .SetShowClearButton()
                .BindValue(nameof(TextInputTrimGroupContext.Value), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.RecordTrimmedChange))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 120,
            note: "The padding is trimmed in the browser before the value is sent, and the clear button writes an empty value through the same binding."
        );
    }

    /// <summary>
    /// The <c>Submit</c> rules run on the press, and any error that stands then — theirs, or a <c>Change</c>/<c>Blur</c> rule's that
    /// already failed — stops it; a warning or an info does not.
    /// </summary>
    /// <remarks>The second field is bound <c>OnSubmit</c>, so its value reaches the controller with the command.</remarks>
    private static ContainerComponent CreateSubmitGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.SubmitGroup), "Validated submit",
            content =>
            {
                _ = content.AddChild(UILayout.Stack(12)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(new TextInputComponent()
                        .SetTitle("Owner email")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Email), UIBindingScope.Relative)
                        .BindValidation(nameof(TextInputSubmitGroupContext.EmailValidation), UIBindingScope.Relative)
                        .Required("An owner email is required.", UIValidationTrigger.Submit)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur)
                        .Regex("@orvane\\.example$", "An outside address gets the weekly digest only.", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Notes (sent on submit only)")
                        .SetFormId(SubmitFormId)
                        .BindValue(nameof(TextInputSubmitGroupContext.Notes), UIBindingScope.Relative, UIBindingMode.OnSubmit)
                        .Required("A line for the reviewer helps.", UIValidationTrigger.Blur, UIValidationSeverity.Info)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnSubmit(SubmitFormId, nameof(ValuesController.Submit))
                        .SetTitle("Save owner")
                    )
                );
            },
            contentMinHeight: 200,
            note: "The Submit rules run on the press, and any error standing then stops it, a Change or Blur rule's that already failed included; a warning or an info says its piece and lets the command through. The server has its say too: owner@orvane.example is already taken, and the refusal comes back as a message on the field."
        );
    }

    /// <summary>
    /// Three fields send their words to one paragraph under the form (<c>ValidationInto</c>): each holds a line of it, and a field put
    /// right takes only its own line away. The fields keep the severity on their edge and nothing else.
    /// </summary>
    private static ContainerComponent CreateBlockGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.BlockGroup), "The words under the form",
            content =>
            {
                _ = content.AddChild(UILayout.Stack(12)
                    .SetPlacement(1, 1, 24, 1)
                    .AddChild(new TextInputComponent()
                        .SetTitle("Service name")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Name), UIBindingScope.Relative)
                        .Required("A service needs a name.", UIValidationTrigger.Submit)
                        .Regex("^[a-z0-9-]+$", "Lower-case letters, digits and dashes only.", UIValidationTrigger.Blur)
                        .ValidationInto(BlockErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Port")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Port), UIBindingScope.Relative)
                        .Required("A port is required.", UIValidationTrigger.Submit)
                        .Regex("^[0-9]{2,5}$", "A port is a number between 10 and 65535.", UIValidationTrigger.Blur)
                        .ValidationInto(BlockErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddChild(new TextInputComponent()
                        .SetTitle("Owner email")
                        .SetFormId(BlockFormId)
                        .BindValue(nameof(TextInputBlockGroupContext.Email), UIBindingScope.Relative)
                        .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "That does not look like an email address.", UIValidationTrigger.Blur)
                        .Regex("@orvane\\.example$", "An outside address gets the weekly digest only.", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
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
                        .SetTitle("Create service")
                    )
                );
            },
            contentMinHeight: 200,
            note: "Press Create with the form empty: two lines appear under it at once, one per field, and the fields only redden; a Submit rule speaks again at the next press. Leave the email field with a bad address and a third line joins them; put it right and only that line goes. A warning takes a line too."
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
        return DemoUI.CreateGroup(nameof(ValuesController.NoteGroup), "A message in a row is a mark",
            content => content.AddChild(new KeyValueActionComponent()
                .BindItems(nameof(KeyValueActionNoteGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate(LimitTemplate, new NumberInputComponent()
                    .SetShowStepper()
                    .SetStep(50)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "A limit of nothing switches the service off.", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 200, "Above the plan's 200; a change this size needs an owner's sign-off.", UIValidationSeverity.Warning)
                )
                .AddValueInputTemplate(OwnerTemplate, new TextInputComponent()
                    .BindValidation(nameof(NotedRowItem.Note), UIBindingScope.Relative)
                )
                .EnableEditing(nameof(ValuesController.SaveNotedRow))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 200,
            note: "The limit's two rules run on the `Change` trigger, so the mark answers each keystroke and only the graver of the two ever speaks: "
                + "type 0 for the error, 500 for the warning, 150 for neither. The owner's mark is the controller's, written on the draft when the save reads it, "
                + "and it stays beside the value after the row closes."
        );
    }

    /// <summary>
    /// Both fields send their words to the same text beside the list: the rows keep the severity on their edge alone, which is
    /// the shape a settings list wants when the errors belong beside it rather than inside its rows.
    /// </summary>
    private static ContainerComponent CreateElsewhereGroup()
    {
        return DemoUI.CreateGroup(nameof(ValuesController.ElsewhereGroup), "The words go to a text beside the list",
            content => content
                .AddChild(new KeyValueActionComponent()
                    .BindItems(nameof(KeyValueActionElsewhereGroupContext.Items), UIBindingScope.Relative)
                    .AddValueInputTemplate("limit", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "A limit of nothing switches the service off.", UIValidationSeverity.Error)
                        .ValidationInto(ErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddValueInputTemplate("retries", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 5, "More than five retries is a queue, not a retry.", UIValidationSeverity.Warning)
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
            contentMinHeight: 160,
            note: "Both rows name the same paragraph, and each keeps a line of it: type 0 in the limit and 9 in the retries, and both lines stand "
                + "under the list; put one right and only its line goes. The row itself only reddens."
        );
    }

    /// <summary>
    /// A bound the server holds as well as the page, on a number and on a day: the controller's copy, written under the group, never
    /// goes past either.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateExample("A bound the server holds",
            UILayout.Stack(16)
                .AddChild(new NumberInputComponent()
                    .SetTitle("Replicas")
                    .SetRange(1, 10)
                    .SetShowStepper()
                    .BindValue(nameof(ServerBoundsGroupContext.Replicas), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.ReplicasChanged))
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Keep the snapshot until")
                    .SetMax(ServerBoundsGroupContext.Latest)
                    .BindValue(nameof(ServerBoundsGroupContext.KeepUntil), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.KeepUntilChanged))
                ),
            note: "`Max` is 10 replicas, and 2026-09-30 for the snapshot. Type 15 and leave the field: a value past the bound never becomes the controller's — the server refuses one that reaches it and the field returns to what the controller holds. "
                + "A later day is pulled back to the bound by the page before it sends, once; one that reaches the server some other way is refused there. The line above is the controller's copy after every change.",
            context: BoundsGroup
        );
    }
}
