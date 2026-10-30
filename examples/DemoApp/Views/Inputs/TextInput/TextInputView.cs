using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// One single-line text field and every property that can be bound to it; then input types and affixes, leading/trailing actions,
/// sizes and inline caption, Enter/Escape commands, numeric input mode, inline @mentions, and Ghost inline editing.
/// </summary>
internal sealed class TextInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(TextInputController.ValueGroup);
    private const string FieldGroup = nameof(TextInputController.FieldGroup);
    private const string ContentGroup = nameof(TextInputController.ContentGroup);
    private const string BadgeGroup = nameof(TextInputController.BadgeGroup);
    private const string BorderGroup = nameof(TextInputController.BorderGroup);
    private const string LabelsGroup = nameof(TextInputController.LabelsGroup);
    private const string TriggersGroup = nameof(TextInputController.TriggersGroup);
    private const string EndpointId = "demo-text-input-endpoint";
    private const string SubjectId = "demo-text-input-subject";
    private const string ReleaseFormId = "demo-text-input-release";
    // The token in a form of its own, so the browser takes no email or hostname beside it for its login.
    private const string TokenFormId = "demo-text-input-token";

    public static string ViewKey => "demo.inputs.text-input";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";
    protected override (string Route, string Title)? ComposedIn => ("/inputs", "demo.nav.inputs.overview");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TextInputComponent()
            .BindStandard()
            .BindValue<TextInputController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<TextInputController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<TextInputController>(static x => x.ValueGroup.Size)
            .BindMaxLength<TextInputController>(static x => x.ValueGroup.MaxLength)
            .BindTrimInput<TextInputController>(static x => x.ValueGroup.TrimInput)
            .BindShowClearButton<TextInputController>(static x => x.ValueGroup.ShowClearButton)
            .BindAppearance<TextInputController>(static x => x.FieldGroup.Appearance)
            .BindPlaceholder<TextInputController>(static x => x.FieldGroup.Placeholder)
            .BindType<TextInputController>(static x => x.FieldGroup.Type)
            .BindInputMode<TextInputController>(static x => x.FieldGroup.InputMode)
            .BindPrefixIcon<TextInputController>(static x => x.FieldGroup.PrefixIcon)
            .BindSuffixIcon<TextInputController>(static x => x.FieldGroup.SuffixIcon)
            .BindPrefixText<TextInputController>(static x => x.FieldGroup.PrefixText)
            .BindSuffixText<TextInputController>(static x => x.FieldGroup.SuffixText)
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

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateFormGroup(), CreateActionsGroup(), CreateCodeGroup()], [CreateSizesGroup(), CreateEnterGroup(), CreateTriggersGroup()]), CreateGhostGroup()];

    /// <summary>
    /// Native input types, prefix/suffix text, label icon/badge, and help tooltips in an outlined form.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Types, affixes & help",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Hostname")
                    .SetValue("api-eu-west-4")
                    .SetHelp("Lower-case letters, digits and dashes; it becomes part of the server's address.")
                    .SetShowClearButton()
                    .Required("A server needs a hostname.", UIValidationTrigger.Submit)
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Health endpoint")
                    .SetValue("/healthz")
                    .SetPrefixText("https://orvane.example")
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Request timeout")
                    .SetValue("30")
                    .SetSuffixText("seconds")
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Contact for incidents")
                    .SetType(UITextInputType.Email)
                    .SetIcon(DemoIcons.Send)
                    .SetValue("robin@orvane.example")
                    .SetHelp("Paged first when a server of this customer's stops answering.")
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Deploy token")
                    .SetType(UITextInputType.Password)
                    .SetIcon(DemoIcons.Lock)
                    .SetValue("orv_live_4c9e2a71")
                    .SetAutocomplete(UIAutocomplete.Off)
                    .SetFormId(TokenFormId)
                    .SetBadgeTitle("rotated 2 d ago")
                    .SetBadgeVariant(UIBadgeVariant.Success)
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Docs")
                    .SetType(UITextInputType.Url)
                    .SetIcon(DemoIcons.ExternalLink)
                    .SetValue("https://docs.orvane.example")
                ),
            note: "`SetType` configures browser masking and mobile keyboards; `SetPrefixText`/`SetSuffixText` attach inline affixes; `SetHelp` adds an accessible description tooltip."
        );
    }

    /// <summary>
    /// Leading and trailing field buttons, token-insertion menu button, and responsive <c>SetActionsBelow</c>.
    /// </summary>
    private static ContainerComponent CreateActionsGroup()
    {
        return DemoUI.CreateExample("Leading & trailing actions",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent(EndpointId)
                    .SetTitle("Health endpoint")
                    .SetValue("https://api-eu-west-1.orvane.example/healthz")
                    .AddLeadingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Run the health check")
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTooltip("Copy")
                        .InteractOn(EventNames.Click, CopyToClipboardEffect.ValueOf(EndpointId))
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTooltip("Open")
                    )
                )
                .AddChild(new TextInputComponent(SubjectId)
                    .SetTitle("Renewal reminder subject")
                    .SetValue("Your plan renews on ")
                    .SetTrailingAction(new SplitButtonComponent()
                        .SetMode(UISplitButtonMode.Menu)
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetShowChevron(false)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                        .SetTooltip("Insert a field")
                        .SetPopupPlacement(UIPopupPlacement.BottomEnd)
                        .SetItems([
                            new MenuItem { Id = "{customer}", Title = "Customer name", IsContent = true },
                            new MenuItem { Id = "{plan}", Title = "Plan", IsContent = true },
                            new MenuItem { Id = "{renewal}", Title = "Renewal date", IsContent = true }
                        ])
                        .OnItemClick(InsertTextEffect.CurrentItemKey(SubjectId))
                    )
                )
                // On a phone the words take the row: the clip and the emoji in a row under it, Post kept at its end.
                .AddChild(new TextInputComponent()
                    .SetPlaceholder("Comment on the release")
                    .AddLeadingAction(UIIconButtons.Attach())
                    .AddTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Emoji))
                        .SetTooltip("Emoji")
                    )
                    .AddTrailingAction(new ButtonComponent().SetVariant(UIButtonVariant.Ghost).SetTitle("Post"), inField: true)
                    .SetActionsBelow(UIResponsiveTier.Md)
                )
                .AddChild(new ButtonComponent()
                    .SetVariant(UIButtonVariant.Ghost)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                    .SetTitle("Copy the install command")
                    .InteractOn(EventNames.Click, CopyToClipboardEffect.Literal("curl -fsSL https://docs.orvane.example/install.sh | sh"))
                ),
            note: "`AddLeadingAction` and `AddTrailingAction` embed buttons inside the field chrome; `CopyToClipboardEffect` and `InsertTextEffect` run purely on the client. `SetActionsBelow(UIResponsiveTier.Md)` moves non-`inField` actions to a secondary bar on phones."
        );
    }

    /// <summary>
    /// A one-time code: text, not a number, so its leading zeros stay; the phone raises its digit keyboard and may offer the code from a
    /// message, and a rule takes six digits.
    /// </summary>
    private static ContainerComponent CreateCodeGroup()
    {
        return DemoUI.CreateExample("Numeric input mode & validation",
            new TextInputComponent()
                .SetAppearance(UIInputAppearance.Filled)
                .SetTitle("Code from the email")
                .SetPlaceholder("6 digits")
                .SetAutocomplete(UIAutocomplete.OneTimeCode)
                .SetInputMode(UIInputMode.Numeric)
                .SetMaxLength(6)
                .SetWidth(UILayoutLength.Absolute(220))
                .Regex(@"^\d{6}$", "The code is six digits.", UIValidationTrigger.Blur),
            note: "`SetInputMode(UIInputMode.Numeric)` opens a numeric keypad on touch devices while preserving leading zeros as text."
        );
    }

    /// <summary>
    /// The three sizes on <see cref="TextInputComponent"/> plus <see cref="UIInputTitlePlacement.Inside"/>; cross-component comparisons live on <c>/inputs</c>.
    /// </summary>
    private static ContainerComponent CreateSizesGroup()
    {
        return DemoUI.CreateExample("Sizes & inline caption",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Small")
                    .SetSize(UISize.Small)
                    .SetValue("billing")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Medium (default)")
                    .SetValue("billing")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Large")
                    .SetSize(UISize.Large)
                    .SetValue("billing")
                )
                .AddChild(new TextInputComponent()
                    .SetSize(UISize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetTitle("Inline caption")
                    .SetValue("db-us-east-2")
                ),
            note: "Height, horizontal padding and font size scale together across `Small`, `Medium` and `Large`. See Inputs -> Overview (`/inputs`) for the cross-component compact matrix."
        );
    }

    /// <summary>
    /// <c>OnEnter</c> commits the draft and runs a command without submitting the surrounding form; <c>OnEscape</c> cancels an active rename.
    /// </summary>
    private static ContainerComponent CreateEnterGroup()
    {
        return DemoUI.CreateExample("Enter & Escape commands",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Release")
                    .SetFormId(ReleaseFormId)
                    .BindValue<TextInputLabelsGroupContext>(static x => x.Name, UIBindingScope.Relative)
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems<TextInputLabelsGroupContext>(static x => x.Labels, UIBindingScope.Relative)
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(4)
                    .SetRowHoverable(true)
                    .OnItemClickWithItemKey(nameof(TextInputController.RenameLabel))
                    .SetTemplate(new TextComponent().BindBadgeTitle<TextItem>(static x => x.Title, UIBindingScope.Relative))
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Labels")
                    .SetPlaceholder("Type a label and press Enter")
                    .SetFormId(ReleaseFormId)
                    .BindValue<TextInputLabelsGroupContext>(static x => x.Draft, UIBindingScope.Relative)
                    .OnEnter(nameof(TextInputController.AddLabel))
                    .OnEscape(nameof(TextInputController.DropRename))
                    .BindCancelOnEscape<TextInputLabelsGroupContext>(static x => x.Renaming, UIBindingScope.Relative)
                    .SetTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                        .SetTooltip("Add the label")
                        .OnClick(nameof(TextInputController.AddLabel))
                    )
                )
                .AddChild(new ButtonComponent()
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetTitle("Save the release")
                    .OnSubmit(ReleaseFormId, nameof(TextInputController.SaveRelease))
                ),
            note: "`OnEnter` adds a label and keeps focus in the field without submitting the form. Click an existing badge to rename it; `BindCancelOnEscape` enables `Escape` to abort the rename without clearing new drafts.",
            context: LabelsGroup
        );
    }

    /// <summary>
    /// Inline trigger suggestions (<c>@</c>) in a single-line field: completed tokens wear a pill, step up on hover, delete whole on
    /// <c>Backspace</c>, and fire <c>OnTriggerClick</c> when clicked.
    /// </summary>
    private static ContainerComponent CreateTriggersGroup()
    {
        return DemoUI.CreateExample("Inline mentions (@)",
            new TextInputComponent()
                .SetAppearance(UIInputAppearance.Outline)
                .SetTitle("Assignee note")
                .SetPlaceholder("Type @ to mention an owner or service")
                .SetValue("Route alerts for @db-eu-west-2 to @Sam Ortega")
                .AddTrigger("@")
                .SetTriggerItems(
                    new UITextTriggerItem("grace", "Grace Kim", "Databases", DemoIcons.Outline(DemoIcons.User), insertText: "@Grace Kim ") { Trigger = "@" },
                    new UITextTriggerItem("sam", "Sam Ortega", "On call", DemoIcons.Outline(DemoIcons.User), insertText: "@Sam Ortega ") { Trigger = "@" },
                    new UITextTriggerItem("db-eu-west-2", "db-eu-west-2", "Primary · Amsterdam", DemoIcons.Outline(DemoIcons.Server), insertText: "@db-eu-west-2 ") { Trigger = "@" }
                )
                .OnTriggerClick(nameof(TextInputController.ClickTriggerToken)),
            note: "`AddTrigger(\"@\")`, `SetTriggerItems(...)` and `OnTriggerClick(...)`: completed `@` tokens wear an inline pill, delete as a single unit on `Backspace`/`Delete`, and fire `OnTriggerClick` when clicked.",
            context: TriggersGroup
        );
    }

    /// <summary>
    /// <c>UIInputAppearance.Ghost</c>: borderless inline text that reveals field chrome only on hover and focus.
    /// </summary>
    private static ContainerComponent CreateGhostGroup()
    {
        return DemoUI.CreateExample("Ghost inline editing",
            new SurfaceComponent()
                .SetContent(UILayout.Columns(24,
                        DemoUI.CreateLabelled("Release title", new TextInputComponent()
                            .SetAppearance(UIInputAppearance.Ghost)
                            .SetValue("Release 2.4")
                        ),
                        DemoUI.CreateLabelled("Reviewer notes", UILayout.Stack(8,
                                new TextInputComponent()
                                    .SetAppearance(UIInputAppearance.Ghost)
                                    .SetValue("Rolling, five per cent a minute")
                                    .SetPlaceholder("Add a note"),
                                new TextInputComponent()
                                    .SetAppearance(UIInputAppearance.Ghost)
                                    .SetPlaceholder("Nothing written down yet")
                            )
                        )
                    )
                ),
            columns: 24,
            note: "`Ghost` hides border and fill at rest, revealing field chrome on hover and focus for edit-in-place titles."
        );
    }
}
