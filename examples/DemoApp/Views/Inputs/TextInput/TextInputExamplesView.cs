using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// A single-line field in the shapes a form writes it in: labelled, affixed, typed, in each state, and with a copy beside it.
/// </summary>
internal sealed class TextInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string SecretId = "demo-text-input-secret";

    public static string ViewKey => "demo.inputs.text-input.examples";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateServiceGroup(), CreateClipboardGroup()], [CreateCredentialsGroup(), CreateGhostGroup()]));

        _ = container.AddChildren(DemoUI.CreateColumns([CreateSizesGroup()], [CreateDenseGroup()]));
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
}
