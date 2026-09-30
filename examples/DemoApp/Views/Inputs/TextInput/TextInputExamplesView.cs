using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// A single-line field in the shapes a form writes it in: labelled, affixed, typed, in each state, with buttons at its ends, and with
/// a help badge on its caption.
/// </summary>
internal sealed class TextInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string SecretId = "demo-text-input-secret";
    private const string EndpointId = "demo-text-input-endpoint";
    private const string ServerId = "demo-text-input-server";
    private const string SubjectId = "demo-text-input-subject";

    public static string ViewKey => "demo.inputs.text-input.examples";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateServiceGroup(), CreateClipboardGroup()], [CreateCredentialsGroup(), CreateGhostGroup()]));

        _ = container.AddChildren(DemoUI.CreateColumns([CreateSizesGroup(), CreateActionsGroup()], [CreateDenseGroup(), CreateHelpGroup()]));

        _ = container.AddChildren(DemoUI.CreateColumns([CreateInsertGroup()], [CreatePhraseGroup()]));
    }

    /// <summary>
    /// A field's own buttons at both ends: one before the text, two after it, each dressed as the field's and not as a form's.
    /// </summary>
    /// <remarks>The second field has its caption inside the box and still carries a button at its end.</remarks>
    private static ContainerComponent CreateActionsGroup()
    {
        return DemoUI.CreateExample("Buttons at both ends",
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
                .AddChild(new TextInputComponent(ServerId)
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Server")
                    .SetValue("db-us-east-2")
                    .AddTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTooltip("Copy")
                        .InteractOn(EventNames.Click, CopyToClipboardEffect.ValueOf(ServerId))
                    )
                ),
            note: "`AddLeadingAction` and `AddTrailingAction` stand the buttons in the order they were added; they follow the text in the tab order whichever end they stand at. The copies take what the field holds when pressed."
        );
    }

    /// <summary>
    /// The caption's badge as a help mark, whose tooltip says what the field is for; the caption stays one line with it, a long one ending
    /// in an ellipsis before its star and badge.
    /// </summary>
    private static ContainerComponent CreateHelpGroup()
    {
        return DemoUI.CreateExample("A help badge on the caption",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Hostname")
                    .SetValue("api-eu-west-4")
                    .SetHelp("Lower-case letters, digits and dashes; it becomes part of the server's address.")
                    .Required("A server needs a hostname.", UIValidationTrigger.Submit)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Deploy token")
                    .SetType(UITextInputType.Password)
                    .SetValue("orv_live_4c9e2a71")
                    .SetHelp("Scripts send it with every call to the API; rotating it signs them out.")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Contact for incidents, a long caption that runs out of room before its badge")
                    .SetValue("robin@orvane.example")
                    .SetHelp("Paged first when a server of this customer's stops answering.")
                    .Required("Someone has to be paged.", UIValidationTrigger.Submit)
                ),
            note: "Hover, press or tab to the badge: it is a stop of its own, named by its words. A caption inside the box makes it no stop, since the box is one control."
        );
    }

    /// <summary>The three sizes a field says outright: the height, the side padding and the text step together.</summary>
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
        );
    }

    /// <summary>
    /// A dense panel: small fields with the caption inside the box and the value at the far edge, one line each, as a node on a
    /// canvas draws its values.
    /// </summary>
    private static ContainerComponent CreateDenseGroup()
    {
        return DemoUI.CreateExample("Caption inside the field",
            UILayout.Stack(4)
                .AddChild(new TextInputComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Server")
                    .SetValue("db-us-east-2")
                )
                .AddChild(new NumberInputComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Disk")
                    .SetSuffixText("GB")
                    .SetValue(240)
                )
                .AddChild(new SelectComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Role")
                    .SetOptions([new OptionItem { Id = "api", Title = "api" }, new OptionItem { Id = "db", Title = "db" }])
                    .SetValue("db")
                )
                .AddChild(new DateInputComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Due")
                )
                .AddChild(new TimeInputComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("At")
                )
                .AddChild(new SearchComponent()
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Region")
                    .SetPlaceholder("Search regions")
                )
                .AddChild(new ImageInputComponent()
                    .SetShape(UIImageInputShape.Inline)
                    .SetSize(UIInputSize.Small)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetTitle("Icon")
                    .SetPlaceholder("None chosen")
                )
        );
    }

    /// <summary>The ordinary form case: a label per field, one of them with a unit suffix.</summary>
    private static ContainerComponent CreateServiceGroup()
    {
        return DemoUI.CreateExample("Service settings",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("Billing")
                    .SetShowClearButton()
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Health endpoint")
                    .SetValue("/healthz")
                    .SetPrefixText("https://orvane.example")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Request timeout")
                    .SetValue("30")
                    .SetSuffixText("seconds")
                )
                // The last field carries both icon surfaces: the affixes are the field's, Icon belongs to the label.
                .AddChild(new TextInputComponent()
                    .SetTitle("Search")
                    .SetIcon(DemoIcons.Filter)
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetSuffixIcon(DemoIcons.ArrowRight)
                    .SetValue("deploy")
                    .SetShowClearButton()
                )
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
                .SetContent(UILayout.Stack(8)
                    .AddChild(UIText.Label("The release's name"))
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetValue("Release 2.4")
                    )
                    .AddChild(UIText.Label("A line the reviewer reads")
                        .SetMargin(UIThickness.All(0, 8, 0, 0))
                    )
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetValue("Rolling, five per cent a minute")
                        .SetPlaceholder("Add a note")
                    )
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetPlaceholder("Nothing written down yet")
                    )
                ),
            note: "The box appears under the pointer and on focus; empty, the placeholder is the only thing that says the line can be typed into."
        );
    }

    /// <summary>
    /// <c>Type</c> changes only the native input's behaviour — masking, keyboard, browser validation.
    /// </summary>
    private static ContainerComponent CreateCredentialsGroup()
    {
        return DemoUI.CreateExample("Typed fields",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent()
                    .SetTitle("Owner email")
                    .SetType(UITextInputType.Email)
                    .SetIcon(DemoIcons.Send)
                    .SetValue("robin@orvane.example")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Deploy token")
                    .SetType(UITextInputType.Password)
                    .SetIcon(DemoIcons.Lock)
                    .SetValue("s3cr3t-token")
                    .SetBadgeText("rotated 2 d ago")
                    .SetBadgeStyle(UIBadgeType.Success)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Docs")
                    .SetType(UITextInputType.Url)
                    .SetIcon(DemoIcons.ExternalLink)
                    .SetValue("https://docs.orvane.example")
                )
        );
    }

    /// <summary>A copy at the field's end needs no round trip: the effect reads the field as it is when the button is pressed.</summary>
    private static ContainerComponent CreateClipboardGroup()
    {
        return DemoUI.CreateExample("Copied to the clipboard",
            UILayout.Stack(12)
                .AddChild(new TextInputComponent(SecretId)
                    .SetTitle("Webhook secret")
                    .SetValue("orv_whsec_9f3c1b7a4e2d")
                    // The field's own slot, so the button sits in the row rather than in a column beside it.
                    .SetTrailingAction(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                        .SetTooltip("Copy")
                        .InteractOn(EventNames.Click, CopyToClipboardEffect.ValueOf(SecretId))
                    )
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Copy))
                    .SetTitle("Copy the install command")
                    .InteractOn(EventNames.Click, CopyToClipboardEffect.Literal("curl -fsSL https://docs.orvane.example/install.sh | sh"))
                ),
            note: "The first takes what the field holds when pressed, the second a fixed line; neither makes a round trip."
        );
    }

    /// <summary>
    /// A panel at the field's end: a flyout in the action's slot, whose entries put a placeholder where the caret is.
    /// </summary>
    private static ContainerComponent CreateInsertGroup()
    {
        return DemoUI.CreateExample("A panel at the field's end",
            new TextInputComponent(SubjectId)
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
                ),
            note: "`SetTrailingAction(FlyoutComponent)`: the flyout's anchor stands in the field's slot, dressed as its button. An entry inserts its key (`{plan}`) at the caret, or over the selection, on the page alone; the field keeps its caret while the panel has the focus."
        );
    }

    /// <summary>
    /// Every word of the field a phrase: the caption, the placeholder and the help badge's words are keys the page translates, the help
    /// with a number in its slot.
    /// </summary>
    private static ContainerComponent CreatePhraseGroup()
    {
        return DemoUI.CreateExample("Its words in the page's language",
            new TextInputComponent()
                .SetTitle(UIPhrase.Of("demo.inputs.text-input.name.title"))
                .SetPlaceholder(UIPhrase.Of("demo.inputs.text-input.name.placeholder"))
                .SetHelp(UIPhrase.Of("demo.inputs.text-input.name.help", ("max", 32)))
                .SetMaxLength(32),
            note: "Switch the language in the header: the caption, the placeholder and the help badge's tooltip are drawn again in its words. A sample's plain strings are shown as written; a phrase is always a key."
        );
    }
}
