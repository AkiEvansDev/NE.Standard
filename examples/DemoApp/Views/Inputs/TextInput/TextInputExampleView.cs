using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TextInput;

internal sealed class TextInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.text-input.example";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateServiceGroup())
            .AddChild(CreateCredentialsGroup())
            .AddChild(CreateAppearanceGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary form case: a label per field, one of them with a unit suffix.</summary>
    private static ContainerComponent CreateServiceGroup()
    {
        // The last field carries both icon surfaces at once: PrefixIcon/SuffixIcon are the field's own
        // furniture, sized and toned by it, while Icon belongs to the label and keeps its own size and
        // colour. A suffix icon stands before whatever control the input already keeps at that end — here
        // the clear button.
        return DemoUI.CreateGroup(null, "Service settings",
            content => content.AddChild(CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Service name")
                    .SetValue("nova-api")
                    .SetShowClearButton()
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Health endpoint")
                    .SetValue("/healthz")
                    .SetPrefixText("https://nova.dev")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Request timeout")
                    .SetValue("30")
                    .SetSuffixText("seconds")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Search")
                    .SetIcon(LucideIcons.Filter)
                    .SetPrefixIcon(LucideIcons.Search)
                    .SetSuffixIcon(LucideIcons.ArrowRight)
                    .SetValue("deploy")
                    .SetShowClearButton()
                )
            ),
            static _ => { },
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>Appearance</c> decides whether the field is a filled box or a single rule under the text. The
    /// underlined form is what an edit-in-place field wants, and it is shared by every input that draws a
    /// field of its own — the toggles and the slider have none, and do not carry the property.
    /// </summary>
    private static ContainerComponent CreateAppearanceGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance",
            content => content.AddChild(CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Filled")
                    .SetValue("nova-api")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue("nova-api")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline with a labelled icon")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetIcon(LucideIcons.Search)
                    .SetValue("deploy")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Underline with a field icon")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetPrefixIcon(LucideIcons.Search)
                    .SetValue("deploy")
                )
            ),
            static _ => { },
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>Type</c> only changes the native input's own behavior (masking, keyboard, browser validation) —
    /// worth its own group because nothing about the field's look says which type it is.
    /// </summary>
    private static ContainerComponent CreateCredentialsGroup()
    {
        return DemoUI.CreateGroup(null, "Typed fields",
            content => content.AddChild(CreateStack()
                .AddChild(new TextInputComponent()
                    .SetTitle("Owner email")
                    .SetType(UITextInputType.Email)
                    .SetIcon(LucideIcons.Send)
                    .SetValue("platform@nova.dev")
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Deploy token")
                    .SetType(UITextInputType.Password)
                    .SetIcon(LucideIcons.Lock)
                    .SetValue("s3cr3t-token")
                    .SetBadgeText("rotated 2 d ago")
                    .SetBadgeStyle(UIBadgeType.Success)
                )
                .AddChild(new TextInputComponent()
                    .SetTitle("Docs")
                    .SetType(UITextInputType.Url)
                    .SetIcon(LucideIcons.ExternalLink)
                    .SetValue("https://nova.dev/docs")
                )
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
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
                    .SetValue("nova-api")
                    .SetMaxLength(8)
                )
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
