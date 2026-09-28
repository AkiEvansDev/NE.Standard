using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// The field itself: what it will accept, how much of it, and what it looks like once something is chosen.
/// </summary>
/// <remarks>Nothing here uploads anything; that needs a controller and lives on the Main page.</remarks>
internal sealed class FileInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const long Megabyte = 1024 * 1024;

    public static string ViewKey => "demo.inputs.file-input.examples";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateUsesGroup()], [CreateFormGroup()]));

        _ = container.AddChild(CreateContractGroup());
    }

    /// <summary>
    /// The jobs it is given, and what a single file and a set of them look like in one row.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("Avatar")
                    .SetIcon(DemoIcons.UserRound)
                    .SetAccept("image/png,image/jpeg")
                    .SetPlaceholder("PNG or JPEG, up to 2 MB")
                    .SetMaxFileSize(2 * Megabyte)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("TLS certificate")
                    .SetIcon(DemoIcons.FileText)
                    .SetAccept(".pem,.crt")
                    .SetPlaceholder("One certificate for bramble.example")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetIcon(DemoIcons.Upload)
                    .SetMultiple(true)
                    .SetPlaceholder("Anything the reviewer should see")
                    .SetBadgeText("several at once")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
        );
    }

    /// <summary>
    /// The field among the others it is submitted with: one row of a form rather than a page of its own.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("In a form",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle("Attach to the review")
                    .SetDescription("Everything here is submitted together")
                )
                .SetContent(UILayout.Stack(12)
                    .AddChild(new TextInputComponent()
                        .SetTitle("What it is")
                        .SetValue("Rollback plan")
                    )
                    .AddChild(new FileInputComponent()
                        .SetTitle("The file")
                        .SetIcon(DemoIcons.File)
                        .SetAccept(".md,.pdf")
                        .SetPlaceholder("Markdown or PDF, up to 2 MB")
                        .SetMaxFileSize(2 * Megabyte)
                        .Required("A file is required.")
                    )
                )
                .SetFooter(UILayout.Row(8)
                    .AddChild(UIButtons.Primary("Attach"))
                    .AddChild(UIButtons.Ghost("Cancel"))
                )
        );
    }

    /// <summary>
    /// With nothing chosen the placeholder is the whole contract, so it is written rather than left to the filter.
    /// </summary>
    /// <remarks>Side by side, because the three contracts only read as a set of choices when they can be compared.</remarks>
    private static ContainerComponent CreateContractGroup()
    {
        return DemoUI.CreateExample("What the empty field promises",
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("One kind of file", new FileInputComponent()
                    .SetTitle("Deploy manifest")
                    .SetAccept(".yaml,.yml")
                    .SetPlaceholder("A single .yaml, up to 256 KB")
                    .SetMaxFileSize(256 * 1024)
                    .SetWidth(UILayoutLength.Absolute(320))
                    )
                )
                .AddChild(UIPage.Labelled("A whole family of them", new FileInputComponent()
                    .SetTitle("Screenshot")
                    .SetAccept("image/*")
                    .SetPlaceholder("Any image, up to 5 MB")
                    .SetMaxFileSize(5 * Megabyte)
                    .SetWidth(UILayoutLength.Absolute(320))
                    )
                )
                .AddChild(UIPage.Labelled("Several, each within the limit", new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetMultiple(true)
                    .SetMaxFileSize(5 * Megabyte)
                    .SetPlaceholder("Each of them at most 5 MB, not all of them together")
                    .SetWidth(UILayoutLength.Absolute(320))
                    )
                ),
            columns: 24,
            note: "The filter and the limit are a courtesy to the reader, **not a guarantee**: the transfer endpoint enforces its own, because nothing the client says about a file can be trusted — see [the transfer design](https://docs.orvane.example/files)."
        );
    }
}
