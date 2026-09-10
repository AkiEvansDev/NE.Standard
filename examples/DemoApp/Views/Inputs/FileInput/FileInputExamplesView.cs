using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup()],
            [CreateFormGroup()]
        ));

        _ = container.AddChild(CreateContractGroup());
    }

    /// <summary>
    /// The jobs it is given, and what a single file and a set of them look like in one row.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("Avatar")
                    .SetIcon(DemoIcons.UserRound)
                    .SetAccept("image/png,image/jpeg")
                    .SetPlaceholder("PNG or JPEG, up to 2 MB")
                    .SetMaxFileSize(2 * Megabyte)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Deploy manifest")
                    .SetIcon(DemoIcons.FileText)
                    .SetAccept(".yaml,.yml,.json")
                    .SetPlaceholder("One manifest")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetIcon(DemoIcons.Upload)
                    .SetMultiple(true)
                    .SetPlaceholder("Anything the reviewer should see")
                    .SetBadgeText("several at once")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
            )
        );
    }

    /// <summary>
    /// The field among the others it is submitted with: one row of a form rather than a page of its own.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateGroup(null, "In a form",
            content => content.AddChild(new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle("Attach to the review")
                    .SetDescription("Everything here is submitted together")
                )
                .SetContent(DemoUI.CreateStack()
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
                .SetFooter(DemoUI.CreateRow(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetTitle("Attach")
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Cancel")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// With nothing chosen the placeholder is the whole contract, so it is written rather than left to the filter.
    /// </summary>
    /// <remarks>Side by side, because the three contracts only read as a set of choices when they can be compared.</remarks>
    private static ContainerComponent CreateContractGroup()
    {
        return DemoUI.CreateGroup(null, "What the empty field promises",
            content => content.AddChild(DemoUI.CreateRow(24)
                .AddChild(CreateContract("One kind of file", new FileInputComponent()
                    .SetTitle("Deploy manifest")
                    .SetAccept(".yaml,.yml")
                    .SetPlaceholder("A single .yaml, up to 256 KB")
                    .SetMaxFileSize(256 * 1024)
                ))
                .AddChild(CreateContract("A whole family of them", new FileInputComponent()
                    .SetTitle("Screenshot")
                    .SetAccept("image/*")
                    .SetPlaceholder("Any image, up to 5 MB")
                    .SetMaxFileSize(5 * Megabyte)
                ))
                .AddChild(CreateContract("Several, each within the limit", new FileInputComponent()
                    .SetTitle("Attachments")
                    .SetMultiple(true)
                    .SetMaxFileSize(5 * Megabyte)
                    .SetPlaceholder("Each of them at most 5 MB, not all of them together")
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "The filter and the limit are a courtesy to the reader, **not a guarantee**: the transfer endpoint enforces its own, because nothing the client says about a file can be trusted — see [the transfer design](https://example.com/docs/files)."
        );
    }

    private static StackPanelComponent CreateContract(string caption, FileInputComponent field)
        => DemoUI.CreateCaptionedItem(caption, field.SetWidth(UILayoutLength.Absolute(320)));
}
