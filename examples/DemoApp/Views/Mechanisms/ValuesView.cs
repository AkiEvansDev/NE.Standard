using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// What reaches the controller and when — on leaving a field, trimmed, after a pause, only with a submit, or never while it moves —, the
/// rules that judge a value and where their words stand, and the bounds of a number and a day: one behaviour to a section.
/// </summary>
/// <remarks>The page is words, not samples: every title, note, caption, rule's message and line is a key, in each of the demo's languages.</remarks>
internal sealed class ValuesView : DemoMechanismView, IUIViewDefinition
{
    private const string Words = "demo.mechanisms.values.";

    // Authored ids: a form is named by its fields and its button, a paragraph by the rules that write into it, a source by its copies.
    private const string OnSubmitFormId = "values-on-submit-form";
    private const string TriggersFormId = "values-triggers-form";
    private const string SubmitFormId = "values-submit-form";
    private const string ServerFormId = "values-server-form";
    private const string UnderFormId = "values-under-form";
    private const string UnderFormErrorsId = "values-under-form-errors";
    private const string BesideListErrorsId = "values-beside-list-errors";
    private const string PreviewLevelId = "values-preview-level";
    private const string PreviewNameId = "values-preview-name";

    public static string ViewKey => "demo.mechanisms.values";

    protected override string ComponentRoute => "/mechanisms/values";
    protected override string Header => "demo.mechanisms.values.header";
    protected override string HeaderDescription => "demo.mechanisms.values.description";

    // Read across, two to a row: when a value is sent, then the rules and their words, then bounds — the two short ones stacked beside
    // the list, as tall as they are together. The filter's long list stands beside the three severities, about as tall.
    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(
            CreateChangeGroup(),
            CreateTrimGroup(),
            CreatePreviewGroup(),
            CreateOnSubmitGroup(),
            CreateFilterGroup(),
            CreateSeverityGroup(),
            CreateTriggersGroup(),
            CreateSubmitGroup(),
            CreateServerGroup(),
            CreateUnderFormGroup(),
            CreateRowMarksGroup(),
            CreateRowRulesGroup(),
            CreateBesideListGroup(),
            DemoUI.CreateHalf(CreateNumberBoundsGroup(), CreateDayBoundsGroup())
        );

    private static ContainerComponent CreateChangeGroup()
        => DemoUI.CreateExample(Words + "change.title",
            new TextInputComponent()
                .SetTitle("demo.mechanisms.values.service-name")
                .BindValue(nameof(ChangeGroupContext.Name), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.NameChanged)),
            note: Words + "change.note",
            context: nameof(ValuesController.ChangeGroup),
            controller: [DemoCode.Of<ChangeGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.ChangeGroup), nameof(ValuesController.NameChanged))],
            words: true
        );

    private static ContainerComponent CreateTrimGroup()
        => DemoUI.CreateExample(Words + "trim.title",
            new TextInputComponent()
                .SetTitle("demo.mechanisms.values.trim.field")
                .SetTrimInput()
                .BindValue(nameof(TrimGroupContext.Name), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.TrimmedNameChanged)),
            note: Words + "trim.note",
            context: nameof(ValuesController.TrimGroup),
            controller: [DemoCode.Of<TrimGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.TrimGroup), nameof(ValuesController.TrimmedNameChanged))],
            words: true
        );

    private static ContainerComponent CreateFilterGroup()
        => DemoUI.CreateExample(Words + "filter.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Tonal)
                    .SetTitle("demo.mechanisms.values.filter.field")
                    .SetPlaceholder("demo.mechanisms.values.filter.placeholder")
                    .SetPrefixIcon(DemoIcons.Outline(DemoIcons.Search))
                    .SetShowClearButton()
                    .SetDebounceMilliseconds(250)
                    .BindValue(nameof(FilterGroupContext.Query), UIBindingScope.Relative)
                    .OnChange(nameof(ValuesController.Filter))
                )
                .AddChild(new ItemsViewComponent()
                    .SetSpacing(4)
                    .BindItems(nameof(FilterGroupContext.Services), UIBindingScope.Relative)
                ),
            note: Words + "filter.note",
            context: nameof(ValuesController.FilterGroup),
            controller: [DemoCode.Of<FilterGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.FilterGroup), nameof(ValuesController.Filter))],
            words: true
        );

    /// <summary>Nothing here is bound: the copies follow their sources on the page alone, and nothing goes to the server.</summary>
    private static ContainerComponent CreatePreviewGroup()
        => DemoUI.CreateExample(Words + "preview.title",
            UILayout.Stack(12)
                .AddChild(new SliderComponent(PreviewLevelId)
                    .SetTitle("demo.mechanisms.values.preview.level")
                    .SetRange(0, 100)
                    .SetShowValue()
                    .SetValue(40)
                )
                .AddChild(new ProgressComponent()
                    .SetValue(40)
                    .InteractCopyValue(PreviewLevelId, ProgressComponent.ValueProperty)
                )
                .AddChild(new TextInputComponent(PreviewNameId)
                    .SetTitle("demo.mechanisms.values.preview.release")
                    .SetPlaceholder("demo.mechanisms.values.preview.placeholder")
                )
                .AddChild(new TextComponent()
                    .SetTitle("demo.mechanisms.values.preview.untitled")
                    .SetTitleType(UITextAppearance.Subtitle)
                    .InteractCopyValue(PreviewNameId, ITextBaseComponent.TitleProperty)
                ),
            note: Words + "preview.note",
            words: true
        );

    private static ContainerComponent CreateOnSubmitGroup()
        => DemoUI.CreateExample(Words + "on-submit.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.on-submit.field")
                    .SetFormId(OnSubmitFormId)
                    .BindValue(nameof(OnSubmitGroupContext.Note), UIBindingScope.Relative, UIBindingMode.OnSubmit)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("demo.mechanisms.values.on-submit.send")
                    .OnSubmit(OnSubmitFormId, nameof(ValuesController.SendNote))
                ),
            note: Words + "on-submit.note",
            context: nameof(ValuesController.OnSubmitGroup),
            controller: [DemoCode.Of<OnSubmitGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.OnSubmitGroup), nameof(ValuesController.SendNote))],
            words: true
        );

    /// <summary>A rule of each severity, judged in the browser as the reader types or leaves a field; the controller hears nothing.</summary>
    private static ContainerComponent CreateSeverityGroup()
        => DemoUI.CreateExample(Words + "severity.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.service-name")
                    .SetValue("billing-worker")
                    .Regex("^[a-z0-9-]+$", "demo.mechanisms.values.name.pattern")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.owner-email")
                    .SetValue("sam@example.com")
                    .Regex("@orvane\\.example$", "demo.mechanisms.values.email.outside", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.notes")
                    .Required("demo.mechanisms.values.notes.info", UIValidationTrigger.Blur, UIValidationSeverity.Info)
                ),
            note: Words + "severity.note",
            words: true
        );

    private static ContainerComponent CreateTriggersGroup()
        => DemoUI.CreateExample(Words + "triggers.title",
            UILayout.Stack(12)
                .AddChild(new NumberInputComponent()
                    .SetTitle("demo.mechanisms.values.triggers.change")
                    .SetFormId(TriggersFormId)
                    .BindValue(nameof(TriggersGroupContext.Limit), UIBindingScope.Relative)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "demo.mechanisms.values.limit.zero")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.triggers.blur")
                    .SetFormId(TriggersFormId)
                    .BindValue(nameof(TriggersGroupContext.Email), UIBindingScope.Relative)
                    .Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "demo.mechanisms.values.email.invalid", UIValidationTrigger.Blur)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.triggers.submit")
                    .SetFormId(TriggersFormId)
                    .BindValue(nameof(TriggersGroupContext.Name), UIBindingScope.Relative)
                    .Required("demo.mechanisms.values.name.required", UIValidationTrigger.Submit)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("demo.mechanisms.values.triggers.check")
                    .OnSubmit(TriggersFormId, nameof(ValuesController.CheckTriggers))
                ),
            note: Words + "triggers.note",
            context: nameof(ValuesController.TriggersGroup),
            controller: [DemoCode.Of<TriggersGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.TriggersGroup), nameof(ValuesController.CheckTriggers))],
            words: true
        );

    private static ContainerComponent CreateSubmitGroup()
        => DemoUI.CreateExample(Words + "submit.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.owner-email")
                    .SetFormId(SubmitFormId)
                    .BindValue(nameof(SubmitGroupContext.Email), UIBindingScope.Relative)
                    .Required("demo.mechanisms.values.email.required", UIValidationTrigger.Submit)
                    .Regex("@orvane\\.example$", "demo.mechanisms.values.email.outside", UIValidationTrigger.Blur, UIValidationSeverity.Warning)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("demo.mechanisms.values.submit.save")
                    .OnSubmit(SubmitFormId, nameof(ValuesController.SaveOwner))
                ),
            note: Words + "submit.note",
            context: nameof(ValuesController.SubmitGroup),
            controller: [DemoCode.Of<SubmitGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.SubmitGroup), nameof(ValuesController.SaveOwner))],
            words: true
        );

    private static ContainerComponent CreateServerGroup()
        => DemoUI.CreateExample(Words + "server.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.owner-email")
                    .SetFormId(ServerFormId)
                    .BindValue(nameof(ServerGroupContext.Email), UIBindingScope.Relative)
                    .BindValidation(nameof(ServerGroupContext.EmailValidation), UIBindingScope.Relative)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("demo.mechanisms.values.server.claim")
                    .OnSubmit(ServerFormId, nameof(ValuesController.ClaimEmail))
                ),
            note: Words + "server.note",
            context: nameof(ValuesController.ServerGroup),
            controller: [DemoCode.Of<ServerGroupContext>(), DemoCode.Of<ValuesController>("TakenEmails", nameof(ValuesController.ServerGroup), nameof(ValuesController.ClaimEmail))],
            words: true
        );

    /// <summary>The fields keep the severity on their edge; their words go to one paragraph, a line each.</summary>
    private static ContainerComponent CreateUnderFormGroup()
        => DemoUI.CreateExample(Words + "under-form.title",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.service-name")
                    .SetFormId(UnderFormId)
                    .BindValue(nameof(UnderFormGroupContext.Name), UIBindingScope.Relative)
                    .Required("demo.mechanisms.values.name.required", UIValidationTrigger.Submit)
                    .Regex("^[a-z0-9-]+$", "demo.mechanisms.values.name.pattern", UIValidationTrigger.Blur)
                    .ValidationInto(UnderFormErrorsId, ITextComponent.DescriptionProperty)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("demo.mechanisms.values.port")
                    .SetFormId(UnderFormId)
                    .BindValue(nameof(UnderFormGroupContext.Port), UIBindingScope.Relative)
                    .Required("demo.mechanisms.values.port.required", UIValidationTrigger.Submit)
                    .Regex("^[0-9]{2,5}$", "demo.mechanisms.values.port.pattern", UIValidationTrigger.Blur)
                    .ValidationInto(UnderFormErrorsId, ITextComponent.DescriptionProperty)
                )
                // A paragraph, not a text: its description keeps the line breaks, so each field's words stand on a line of their own.
                .AddChild(new ParagraphComponent(UnderFormErrorsId)
                    .SetDescription(" ")
                    .SetDescriptionColor(UIThemeColor.Danger)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("demo.mechanisms.values.under-form.create")
                    .OnSubmit(UnderFormId, nameof(ValuesController.CreateService))
                ),
            note: Words + "under-form.note",
            context: nameof(ValuesController.UnderFormGroup),
            controller: [DemoCode.Of<UnderFormGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.UnderFormGroup), nameof(ValuesController.CreateService))],
            words: true
        );

    /// <summary>
    /// The limit and the owner are judged by their fields' rules as the reader types and on the value each row shows; the region's
    /// editor carries the controller's word.
    /// </summary>
    private static ContainerComponent CreateRowMarksGroup()
        => DemoUI.CreateExample(Words + "row-marks.title",
            new KeyValueActionComponent()
                .BindItems(nameof(RowMarksGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate("limit", new NumberInputComponent()
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "demo.mechanisms.values.limit.zero")
                )
                .AddValueInputTemplate("owner", new TextInputComponent()
                    .Regex("@", "demo.mechanisms.values.owner.team", UIValidationTrigger.Change, UIValidationSeverity.Warning)
                )
                .AddValueInputTemplate("region", new TextInputComponent()
                    .BindValidation(nameof(NotedRowItem.Note), UIBindingScope.Relative)
                )
                .EnableEditing(nameof(ValuesController.SaveMarkedRow)),
            note: Words + "row-marks.note",
            context: nameof(ValuesController.RowMarksGroup),
            controller: [DemoCode.Of<NotedRowItem>(), DemoCode.Of<RowMarksGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.RowMarksGroup), nameof(ValuesController.SaveMarkedRow), "SaveRow")],
            words: true
        );

    private static ContainerComponent CreateRowRulesGroup()
        => DemoUI.CreateExample(Words + "row-rules.title",
            new KeyValueActionComponent()
                .BindItems(nameof(RowRulesGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate("limit", new NumberInputComponent()
                    .SetShowStepper()
                    .SetStep(50)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "demo.mechanisms.values.limit.zero", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 200, "demo.mechanisms.values.limit.above", UIValidationSeverity.Warning)
                )
                .EnableEditing(nameof(ValuesController.SaveRuledRow)),
            note: Words + "row-rules.note",
            context: nameof(ValuesController.RowRulesGroup),
            controller: [DemoCode.Of<RowRulesGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.RowRulesGroup), nameof(ValuesController.SaveRuledRow))],
            words: true
        );

    /// <summary>Both rows name the same paragraph: the rows keep the severity on their edge, the words stand beside the list.</summary>
    private static ContainerComponent CreateBesideListGroup()
        => DemoUI.CreateExample(Words + "beside-list.title",
            UILayout.Stack(8)
                .AddChild(new KeyValueActionComponent()
                    .BindItems(nameof(BesideListGroupContext.Items), UIBindingScope.Relative)
                    .AddValueInputTemplate("limit", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "demo.mechanisms.values.limit.zero", UIValidationSeverity.Error)
                        .ValidationInto(BesideListErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .AddValueInputTemplate("retries", new NumberInputComponent()
                        .SetShowStepper()
                        .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 5, "demo.mechanisms.values.retries.above", UIValidationSeverity.Warning)
                        .ValidationInto(BesideListErrorsId, ITextComponent.DescriptionProperty)
                    )
                    .EnableEditing(nameof(ValuesController.SaveListedRow))
                )
                .AddChild(new ParagraphComponent(BesideListErrorsId)
                    .SetDescription(" ")
                    .SetDescriptionColor(UIThemeColor.Danger)
                ),
            note: Words + "beside-list.note",
            context: nameof(ValuesController.BesideListGroup),
            controller: [DemoCode.Of<BesideListGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.BesideListGroup), nameof(ValuesController.SaveListedRow))],
            words: true
        );

    private static ContainerComponent CreateNumberBoundsGroup()
        => DemoUI.CreateExample(Words + "number-bounds.title",
            new NumberInputComponent()
                .SetTitle("demo.mechanisms.values.replicas")
                .SetRange(1, 10)
                .SetShowStepper()
                .BindValue(nameof(NumberBoundsGroupContext.Replicas), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.ReplicasChanged)),
            note: Words + "number-bounds.note",
            context: nameof(ValuesController.NumberBoundsGroup),
            controller: [DemoCode.Of<NumberBoundsGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.NumberBoundsGroup), nameof(ValuesController.ReplicasChanged))],
            words: true
        );

    private static ContainerComponent CreateDayBoundsGroup()
        => DemoUI.CreateExample(Words + "day-bounds.title",
            new DateInputComponent()
                .SetTitle("demo.mechanisms.values.keep-until")
                .SetMax(DayBoundsGroupContext.Latest)
                .BindValue(nameof(DayBoundsGroupContext.KeepUntil), UIBindingScope.Relative)
                .OnChange(nameof(ValuesController.KeepUntilChanged)),
            note: Words + "day-bounds.note",
            context: nameof(ValuesController.DayBoundsGroup),
            controller: [DemoCode.Of<DayBoundsGroupContext>(), DemoCode.Of<ValuesController>(nameof(ValuesController.DayBoundsGroup), nameof(ValuesController.KeepUntilChanged))],
            words: true
        );
}
