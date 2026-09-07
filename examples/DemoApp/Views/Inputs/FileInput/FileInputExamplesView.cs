using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
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
            [CreateUsesGroup(), CreateLimitGroup()],
            [CreateAcceptGroup(), CreateStateGroup()]
        ));
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
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// <c>Accept</c> filters the browser's file dialog and nothing else; a file dragged past it is still refused server-side.
    /// </summary>
    private static ContainerComponent CreateAcceptGroup()
    {
        return DemoUI.CreateGroup(null, "What it will accept",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("Anything")
                    .SetPlaceholder("No filter at all")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("By extension")
                    .SetAccept(".csv,.tsv")
                    .SetPlaceholder(".csv or .tsv")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("By type")
                    .SetAccept("application/pdf")
                    .SetPlaceholder("PDF")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("By family")
                    .SetAccept("image/*")
                    .SetPlaceholder("Any image")
                )
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// <c>MaxFileSize</c> is checked per file rather than over the whole set.
    /// </summary>
    private static ContainerComponent CreateLimitGroup()
    {
        return DemoUI.CreateGroup(null, "How much of it",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("One file, at most 512 KB")
                    .SetMaxFileSize(512 * 1024)
                    .SetPlaceholder("A small one")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Several files, each at most 5 MB")
                    .SetMultiple(true)
                    .SetMaxFileSize(5 * Megabyte)
                    .SetPlaceholder("Each of them, not all of them")
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The limit is a courtesy to the reader, **not a guarantee**: the transfer endpoint enforces its own, because nothing the client says about a file can be trusted — see [the transfer design](https://example.com/docs/files).")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>The field's own surface, its affixes, and the states.</summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance and states",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new FileInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetPlaceholder("An edit-in-place attachment")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("With an affix glyph")
                    .SetPrefixIcon(DemoIcons.File)
                    .SetPlaceholder("The glyph belongs to the field, the label has its own")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Read-only")
                    .SetPlaceholder("Nothing can be picked")
                    .SetIsReadOnly(true)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Disabled")
                    .SetPlaceholder("Locked while the release is in flight")
                    .SetEnabled(false)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Required")
                    .SetPlaceholder("A manifest has to be attached")
                    .Required("A manifest is required.")
                )
            ),
            contentMinHeight: 400
        );
    }
}
