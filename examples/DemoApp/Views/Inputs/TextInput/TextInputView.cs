using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// One field and every property that can be bound to it; then a form, the three sizes, the field's own buttons, a name edited where
/// it is read, and Enter running a command.
/// </summary>
/// <remarks>
/// The preview binds by full path while each section binds its own context relatively; <c>FormId</c> is shown on the Values page
/// (<c>/mechanisms/values</c>). The help badge on a caption is every input's, and shown here once.
/// </remarks>
internal sealed class TextInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(TextInputController.ValueGroup);
    private const string FieldGroup = nameof(TextInputController.FieldGroup);
    private const string ContentGroup = nameof(TextInputController.ContentGroup);
    private const string BadgeGroup = nameof(TextInputController.BadgeGroup);
    private const string BorderGroup = nameof(TextInputController.BorderGroup);
    private const string LabelsGroup = nameof(TextInputController.LabelsGroup);
    private const string EndpointId = "demo-text-input-endpoint";
    private const string SubjectId = "demo-text-input-subject";
    private const string ReleaseFormId = "demo-text-input-release";
    // The token in a form of its own, so the browser takes no email or hostname beside it for its login.
    private const string TokenFormId = "demo-text-input-token";

    public static string ViewKey => "demo.inputs.text-input";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";
    protected override (string Route, string Label)? ComposedIn => ("/mechanisms/values", "demo.nav.mechanisms.values");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TextInputComponent()
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
            .BindShowClearButton($"{ValueGroup}.{nameof(TextInputValueGroupContext.ShowClearButton)}")
            .BindAppearance($"{FieldGroup}.{nameof(TextInputFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(TextInputFieldGroupContext.Placeholder)}")
            .BindType($"{FieldGroup}.{nameof(TextInputFieldGroupContext.Type)}")
            .BindInputMode($"{FieldGroup}.{nameof(TextInputFieldGroupContext.InputMode)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(TextInputFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(TextInputFieldGroupContext.SuffixIcon)}")
            .BindPrefixText($"{FieldGroup}.{nameof(TextInputFieldGroupContext.PrefixText)}")
            .BindSuffixText($"{FieldGroup}.{nameof(TextInputFieldGroupContext.SuffixText)}")
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
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(TextInputController.CycleValueOption)),
            DemoUI.CreateOptionSection(FieldGroup, "Field", nameof(TextInputController.CycleFieldOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(TextInputController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(TextInputController.CycleBadgeOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(TextInputController.CycleBorderOption))
        );

    // Each field wears the look its place would: a settings form outlined, a field with its own buttons and an entry form filled, a dense
    // panel underlined, a name edited where it is read ghosted. The read-in-place group goes across the page, its two lines side by side.
    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreateFormGroup(), CreateActionsGroup()], [CreateSizesGroup(), CreateEnterGroup(), CreateCodeGroup()]), CreateGhostGroup()];

    /// <summary>
    /// The ordinary case: a label per field, a scheme or a unit beside the value, the native type a field asks the browser for, and a
    /// help badge where the caption cannot say what the field is for — a server's settings, outlined throughout.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("A form",
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
                    .SetBadgeText("rotated 2 d ago")
                    .SetBadgeStyle(UIBadgeType.Success)
                )
                .AddChild(new TextInputComponent()
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitle("Docs")
                    .SetType(UITextInputType.Url)
                    .SetIcon(DemoIcons.ExternalLink)
                    .SetValue("https://docs.orvane.example")
                ),
            note: "`Type` changes only the native input's behaviour — masking, keyboard, browser validation. The icon before a caption is the label's; the affixes are the field's. A help badge (`SetHelp`) is a stop of its own, named by its words: hover, press or tab to it."
        );
    }

    /// <summary>
    /// A field's own buttons, dressed as the field's and not as a form's: at both ends, a copy that reads the field as it is when pressed,
    /// and a panel in the action's slot whose entries put a placeholder where the caret is.
    /// </summary>
    private static ContainerComponent CreateActionsGroup()
    {
        return DemoUI.CreateExample("Its own buttons",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent(EndpointId)
                    .SetTitle("Health endpoint")
                    .SetValue("https://api-eu-west-1.orvane.example/healthz")
                    .AddLeadingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Run the health check")
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTooltip("Copy")
                        .InteractOn(EventNames.Click, CopyToClipboardEffect.ValueOf(EndpointId))
                    )
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTooltip("Open")
                    )
                )
                .AddChild(new TextInputComponent(SubjectId)
                    .SetTitle("Renewal reminder subject")
                    .SetValue("Your plan renews on ")
                    .SetTrailingAction(new FlyoutComponent()
                        .SetFlyoutPlacement(UIPopupPlacement.BottomEnd)
                        .SetAnchor(new ButtonComponent()
                            .SetType(UIButtonType.Ghost)
                            .SetIcon(DemoIcons.Outline(DemoIcons.Add))
                            .SetTooltip("Insert a field")
                        )
                        .SetContent(new ItemsViewComponent()
                            .SetItems(
                            [
                                new TextItem { Id = "{customer}", Title = "Customer name", IsContent = true },
                                new TextItem { Id = "{plan}", Title = "Plan", IsContent = true },
                                new TextItem { Id = "{renewal}", Title = "Renewal date", IsContent = true }
                            ])
                            .SetSpacing(2)
                            .SetTemplate(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .SetHorizontalAlignment(UIAlignment.Stretch)
                                .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                                .InteractOn(EventNames.Click, InsertTextEffect.CurrentItemKey(SubjectId))
                            )
                        )
                    )
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                    .SetTitle("Copy the install command")
                    .InteractOn(EventNames.Click, CopyToClipboardEffect.Literal("curl -fsSL https://docs.orvane.example/install.sh | sh"))
                ),
            note: "`AddLeadingAction` and `AddTrailingAction` stand the buttons in the order they were added; they follow the text in the tab order whichever end they stand at. "
                + "The copy takes what the field holds when pressed, the button under the fields a fixed line; neither makes a round trip. "
                + "The + is a flyout in the action's slot (`SetTrailingAction(FlyoutComponent)`): an entry inserts its key (`{plan}`) at the caret, or over the selection, on the page alone, and the field keeps its caret while the panel has the focus."
        );
    }

    /// <summary>
    /// An entry field in a form: Enter adds what was typed as a label, and the caret stays for the next one; Enter in the name leaves
    /// it and presses the form's button, as any field's Enter does.
    /// </summary>
    /// <remarks>The + at the field's end runs the same command for a pointer.</remarks>
    private static ContainerComponent CreateEnterGroup()
    {
        return DemoUI.CreateExample("Enter runs a command",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Release")
                    .SetFormId(ReleaseFormId)
                    .BindValue(nameof(TextInputLabelsGroupContext.Name), UIBindingScope.Relative)
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(TextInputLabelsGroupContext.Labels), UIBindingScope.Relative)
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(4)
                    .SetTemplate(new TextComponent().BindBadgeText(nameof(TextItem.Title), UIBindingScope.Relative))
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Labels")
                    .SetPlaceholder("Type a label and press Enter")
                    .SetFormId(ReleaseFormId)
                    .BindValue(nameof(TextInputLabelsGroupContext.Draft), UIBindingScope.Relative)
                    .OnEnter(nameof(TextInputController.AddLabel))
                    .SetTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
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
            note: "`OnEnter`: Enter commits what was typed, then runs the command; the controller adds the label and empties the field, and the caret stays for the next one. It presses no form's button: Enter in Release does, Shift+Enter in Labels too. An empty field adds nothing.",
            context: LabelsGroup
        );
    }

    /// <summary>
    /// The three sizes a field says outright — the height, the side padding and the text step together — and the small one with its
    /// caption inside the box and the value at the far edge, one line each, as a dense panel or a node on a canvas draws its values.
    /// </summary>
    private static ContainerComponent CreateSizesGroup()
    {
        return DemoUI.CreateExample("Sizes",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Small — a node, a status bar, a cell")
                    .SetSize(UIInputSize.Small)
                    .SetValue("billing")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Medium — a form")
                    .SetValue("billing")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Large — the field the page is about")
                    .SetSize(UIInputSize.Large)
                    .SetValue("billing")
                )
                .AddChild(DemoUI.CreateLabelled("Small, the caption inside, underlined — a dense panel", UILayout.Stack(4)
                    .AddChild(new TextInputComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Server")
                        .SetValue("db-us-east-2")
                    )
                    .AddChild(new NumberInputComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Disk")
                        .SetSuffixText("GB")
                        .SetValue(240)
                    )
                    .AddChild(new SelectComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Role")
                        .SetOptions([new OptionItem { Id = "api", Title = "api" }, new OptionItem { Id = "db", Title = "db" }])
                        .SetValue("db")
                    )
                    .AddChild(new DateInputComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Due")
                    )
                    .AddChild(new TimeInputComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("At")
                    )
                    .AddChild(new SearchComponent()
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Region")
                        .SetPlaceholder("Search regions")
                    )
                    .AddChild(new ImageInputComponent()
                        .SetShape(UIImageInputShape.Inline)
                        .SetSize(UIInputSize.Small)
                        .SetTitlePlacement(UIInputTitlePlacement.Inside)
                        .SetAppearance(UIInputAppearance.Underline)
                        .SetTitle("Icon")
                        .SetPlaceholder("None chosen")
                    )
                    )
                ),
            note: "Every input that takes a `Size` takes `TitlePlacement` too. With the caption inside, a help badge is no stop of its own: the box is one control."
        );
    }

    /// <summary>
    /// A one-time code: text, not a number, so its leading zeros stay; the phone raises its digit keyboard and may offer the code from a
    /// message, and a rule takes six digits.
    /// </summary>
    private static ContainerComponent CreateCodeGroup()
    {
        return DemoUI.CreateExample("A one-time code",
            new TextInputComponent()
                .SetAppearance(UIInputAppearance.Tonal)
                .SetTitle("Code from the email")
                .SetPlaceholder("6 digits")
                .SetAutocomplete(UIAutocomplete.OneTimeCode)
                .SetInputMode(UIInputMode.Numeric)
                .SetMaxLength(6)
                .SetWidth(UILayoutLength.Absolute(220))
                .Regex(@"^\d{6}$", "The code is six digits.", UIValidationTrigger.Blur),
            note: "`SetInputMode(UIInputMode.Numeric)` asks a phone for its digit keyboard while the value stays text, its leading zeros kept; `SetAutocomplete(UIAutocomplete.OneTimeCode)` lets it offer the code from a message."
        );
    }

    /// <summary>
    /// The one place a field is asked to stop looking like one: a name edited where it is read.
    /// </summary>
    /// <remarks>Ghost, not a label with a pencil beside it — the box appears under the pointer, so nothing has to be found first.</remarks>
    private static ContainerComponent CreateGhostGroup()
    {
        return DemoUI.CreateExample("Edited where it is read",
            new SurfaceComponent()
                .SetContent(UILayout.Columns(24,
                        DemoUI.CreateLabelled("The release's name", new TextInputComponent()
                            .SetAppearance(UIInputAppearance.Ghost)
                            .SetValue("Release 2.4")
                        ),
                        DemoUI.CreateLabelled("A line the reviewer reads", UILayout.Stack(8,
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
            note: "The box appears under the pointer and on focus; empty, the placeholder is the only thing that says the line can be typed into."
        );
    }
}
