using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;

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
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateServiceGroup(), CreateAppearanceGroup(), CreateStateGroup()],
            [CreateCredentialsGroup(), CreateClipboardGroup()]
        ));
    }

    /// <summary>The ordinary form case: a label per field, one of them with a unit suffix.</summary>
    private static ContainerComponent CreateServiceGroup()
    {
        // The last field carries both icon surfaces: the affixes are the field's, Icon belongs to the label.
        return DemoUI.CreateGroup(null, "Service settings",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("Payments API")
                    .SetShowClearButton()
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Health endpoint")
                    .SetValue("/healthz")
                    .SetPrefixText("https://example.com")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Request timeout")
                    .SetValue("30")
                    .SetSuffixText("seconds")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Search")
                    .SetIcon(DemoIcons.Filter)
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetSuffixIcon(DemoIcons.ArrowRight)
                    .SetValue("deploy")
                    .SetShowClearButton()
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>Appearance</c> decides whether the field is a filled box or a single rule under the text.
    /// </summary>
    private static ContainerComponent CreateAppearanceGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Filled")
                    .SetValue("Payments API")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue("Payments API")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline with a labelled icon")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetIcon(DemoIcons.Search)
                    .SetValue("deploy")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline with a field icon")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetPrefixIcon(DemoIcons.Search)
                    .SetValue("deploy")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Ghost")
                    .SetAppearance(UIInputAppearance.Ghost)
                    .SetValue("Payments API")
                    .SetPlaceholder("No box until the pointer or the focus finds it")
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>Type</c> changes only the native input's behaviour — masking, keyboard, browser validation.
    /// </summary>
    private static ContainerComponent CreateCredentialsGroup()
    {
        return DemoUI.CreateGroup(null, "Typed fields",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Owner email")
                    .SetType(UITextInputType.Email)
                    .SetIcon(DemoIcons.Send)
                    .SetValue("platform@example.com")
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
                    .SetValue("https://example.com/docs")
                )
            ),
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Read-only")
                    .SetValue("eu-west-1")
                    .SetIsReadOnly(true)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Disabled")
                    .SetValue("locked")
                    .SetEnabled(false)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Required")
                    .Required("A service name is required.")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Limited to 8 characters")
                    .SetValue("Payments")
                    .SetMaxLength(8)
                )
            ),
            contentMinHeight: 260
        );
    }

    /// <summary>A copy at the field's end needs no round trip: the effect reads the field as it is when the button is pressed.</summary>
    private static ContainerComponent CreateClipboardGroup()
    {
        return DemoUI.CreateGroup(null, "Copied to the clipboard",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextInputComponent(SecretId)
                    .SetTitle("Webhook secret")
                    .SetValue("whsec_9f3c1b7a4e2d")
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
                    .InteractOn(EventNames.Click, CopyToClipboardEffect.Literal("dotnet add package NE.Standard.UI"))
                )
            ),
            note: "The first takes what the field holds when pressed, the second a fixed line; neither makes a round trip."
        );
    }
}
