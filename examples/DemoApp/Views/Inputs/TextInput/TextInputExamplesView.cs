using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
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
            [CreateServiceGroup(), CreateClipboardGroup()],
            [CreateCredentialsGroup(), CreateGhostGroup()]
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
            )
        );
    }

    /// <summary>
    /// The one place a field is asked to stop looking like one: a name edited where it is read.
    /// </summary>
    /// <remarks>Ghost, not a label with a pencil beside it — the box appears under the pointer, so nothing has to be found first.</remarks>
    private static ContainerComponent CreateGhostGroup()
    {
        return DemoUI.CreateGroup(null, "Edited where it is read",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(DemoUI.CreateStack(8)
                    .AddChild(DemoUI.CreateCaption("The release's name"))
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Ghost)
                        .SetValue("Release 2.4")
                    )
                    .AddChild(DemoUI.CreateCaption("A line the reviewer reads")
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
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "The box appears under the pointer and on focus; empty, the placeholder is the only thing that says the line can be typed into."
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
            )
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
