using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// File input preview with live upload round-trip, followed by single/multiple inline file fields, <c>MaxFileSize</c> client validation,
/// card form integration, and the <c>UIFileInputVariant.Tiles</c> dropzone.
/// </summary>
internal sealed class FileInputView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(FileInputController.ValueGroup);
    private const string FileGroup = nameof(FileInputController.FileGroup);
    private const string UploadGroup = nameof(FileInputController.UploadGroup);
    private const string ContentGroup = nameof(FileInputController.ContentGroup);
    private const string BadgeGroup = nameof(FileInputController.BadgeGroup);
    private const string BorderGroup = nameof(FileInputController.BorderGroup);
    private const long Megabyte = 1024 * 1024;

    public static string ViewKey => "demo.inputs.file-input";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new FileInputComponent()
            .BindStandard()
            .BindValue<FileInputController>(static x => x.ValueGroup.Value)
            .BindIsReadOnly<FileInputController>(static x => x.ValueGroup.IsReadOnly)
            .BindSize<FileInputController>(static x => x.ValueGroup.Size)
            .BindSelectionId<FileInputController>(static x => x.ValueGroup.SelectionId)
            .BindAccept<FileInputController>(static x => x.FileGroup.Accept)
            .BindMaxFileSize<FileInputController>(static x => x.FileGroup.MaxFileSize)
            .BindMultiple<FileInputController>(static x => x.FileGroup.Multiple)
            .BindAppearance<FileInputController>(static x => x.FileGroup.Appearance)
            .BindPlaceholder<FileInputController>(static x => x.FileGroup.Placeholder)
            .BindPrefixIcon<FileInputController>(static x => x.FileGroup.PrefixIcon)
            .BindSuffixIcon<FileInputController>(static x => x.FileGroup.SuffixIcon)
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FileGroup, "File"),
            DemoUI.CreateOptionSection(UploadGroup, "Upload", "A server round trip, not a property: what the last upload reported."),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => [
            .. DemoUI.CreateColumns([CreateFieldsGroup(), CreateSizeLimitGroup()], [CreateFormGroup()]),
            CreateTilesGroup()
        ];

    /// <summary>
    /// Single-file MIME/extension filters (<c>SetAccept</c>) and multi-file selection (<c>SetMultiple(true)</c>) on inline fields.
    /// </summary>
    private static ContainerComponent CreateFieldsGroup()
    {
        return DemoUI.CreateExample("Single & multiple file fields",
            UILayout.Stack(14)
                .AddChild(new FileInputComponent()
                    .SetTitle("TLS certificate (.pem, .crt)")
                    .SetIcon(DemoIcons.FileText)
                    .SetAccept(".pem,.crt")
                    .SetPlaceholder("Choose a single certificate")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Deploy manifest (.yaml, up to 256 KB)")
                    .SetAccept(".yaml,.yml")
                    .SetPlaceholder("Single .yaml up to 256 KB")
                    .SetMaxFileSize(256 * 1024)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Review attachments")
                    .SetIcon(DemoIcons.Upload)
                    .SetMultiple(true)
                    .SetPlaceholder("Choose one or more files")
                    .SetBadgeTitle("Multiple")
                    .SetBadgeVariant(UIBadgeVariant.Info)
                ),
            note: "`SetAccept` filters the OS file dialog by MIME type or extension; `SetMultiple(true)` accepts a batch in one pick."
        );
    }

    /// <summary>
    /// Immediate client-side <c>MaxFileSize</c> refusal for single and multi-file picks, localized in the active UI culture.
    /// </summary>
    private static ContainerComponent CreateSizeLimitGroup()
    {
        return DemoUI.CreateExample("Size limit validation (MaxFileSize)",
            UILayout.Stack(14)
                .AddChild(new FileInputComponent()
                    .SetTitle("Signed contract (single file, max 1 MB)")
                    .SetAccept(".pdf")
                    .SetPlaceholder("Pick a file larger than 1 MB to test refusal")
                    .SetMaxFileSize(Megabyte)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Expense receipts (multiple, max 1 MB each)")
                    .SetMultiple(true)
                    .SetMaxFileSize(Megabyte)
                    .SetPlaceholder("Files within 1 MB stay; oversized files are listed below")
                ),
            note: "Files over `MaxFileSize` are rejected before upload and reported on the validation line; the server transfer endpoint still enforces its own limit."
        );
    }

    /// <summary>
    /// <c>Filled</c> file field with <c>Required</c> validation inside a <see cref="CardComponent"/> submission form.
    /// </summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Form submission",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.FileText)
                    .SetTitle("Attach to change review")
                    .SetDescription("Submitted together with the form fields")
                )
                .SetContent(UILayout.Stack(12)
                    .AddChild(new TextInputComponent()
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetTitle("Document title")
                        .SetValue("Rollback plan")
                    )
                    .AddChild(new FileInputComponent()
                        .SetAppearance(UIInputAppearance.Filled)
                        .SetTitle("Attachment")
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
    /// Multi-file square tile dropzone (<c>UIFileInputVariant.Tiles</c>) with thumbnails for images, file-type glyphs for documents,
    /// per-tile upload progress and soft hover remove buttons.
    /// </summary>
    private static ContainerComponent CreateTilesGroup()
    {
        return DemoUI.CreateExample("Tile dropzone (UIFileInputVariant.Tiles)",
            new FileInputComponent()
                .SetVariant(UIFileInputVariant.Tiles)
                .SetTitle("Incident attachments")
                .SetPlaceholder("Drop logs, captures or screenshots here, or click to browse"),
            columns: 24,
            note: "`UIFileInputVariant.Tiles` renders a multi-file dropzone whose uploaded handles bind to `SelectionIds`. `UIFileInputVariant.Shelf` renders the same tile strip without the drop frame for external triggers (`OpenPickerEffect`)."
        );
    }
}
