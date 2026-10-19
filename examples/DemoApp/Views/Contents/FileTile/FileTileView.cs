using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.FileTile;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.FileTile;

/// <summary>
/// One file tile and every property that can be bound to it; then the files a message carries, a list of downloads, a file the server
/// is still writing, and what an upload sent.
/// </summary>
/// <remarks>The tile is a file's look, not its transfer: a press runs the page's own command, and the upload is the File Input's.</remarks>
internal sealed class FileTileView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string FileGroup = nameof(FileTileController.FileGroup);
    private const string AttachmentsGroup = nameof(FileTileController.AttachmentsGroup);
    private const string DownloadsGroup = nameof(FileTileController.DownloadsGroup);
    private const string ExportGroup = nameof(FileTileController.ExportGroup);
    private const string UploadGroup = nameof(FileTileController.UploadGroup);

    public static string ViewKey => "demo.contents.file-tile";

    protected override string ComponentRoute => "/contents/file-tile";
    protected override string Header => "demo.contents.file-tile.header";
    protected override string HeaderDescription => "demo.contents.file-tile.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    // The size in words under the tile, as a file's dialog heads it: a UIFileSize, which the page writes as the tile writes its own.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame
            .AddChild(new FileTileComponent()
                .BindStandard()
                .BindFileName($"{FileGroup}.{nameof(FileTileGroupContext.FileName)}")
                .BindFileSize($"{FileGroup}.{nameof(FileTileGroupContext.FileSize)}")
                .BindContentType($"{FileGroup}.{nameof(FileTileGroupContext.ContentType)}")
                .BindIcon($"{FileGroup}.{nameof(FileTileGroupContext.Icon)}")
                .BindClickable($"{FileGroup}.{nameof(FileTileGroupContext.Clickable)}")
                .SetPlacement(1, 1, 24, 1)
            )
            .AddChild(new TextComponent()
                .BindTitle($"{FileGroup}.{nameof(FileTileGroupContext.SizeWords)}")
                .SetTitleType(UITextAppearance.Caption)
                .SetPlacement(1, 2, 24, 1)
            )
        );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(FileGroup, "File")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateAttachmentsGroup(), CreateExportGroup()], [CreateDownloadsGroup(), CreateUploadGroup()]);

    /// <summary>The files sent with a message, under its words: a press on one opens it.</summary>
    private static ContainerComponent CreateAttachmentsGroup()
    {
        return DemoUI.CreateExample("A message's attachments",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Tinted)
                .SetPadding(UIThickness.Uniform(10))
                .SetMaxWidth(UILayoutLength.Absolute(420))
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(6,
                    new TextComponent()
                        .SetTitle("Grace Kim")
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.Primary)
                        .SetDescription("Last night's report, the disk graph and the script I ran to free it.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetWrapMode(UITextWrapMode.Wrap),
                    UILayout.Row(4)
                        .SetWrap(true)
                        .AddChild(new FileTileComponent()
                            .SetFileName("incident-report.md")
                            .SetFileSize(14_336)
                            .OnClick(nameof(FileTileController.OpenAttachment), UIAction.Arg("name", "incident-report.md"))
                        )
                        .AddChild(new FileTileComponent()
                            .SetFileName("db-eu-west-2-disk.png")
                            .SetFileSize(286_720)
                            .SetContentType("image/png")
                            .OnClick(nameof(FileTileController.OpenAttachment), UIAction.Arg("name", "db-eu-west-2-disk.png"))
                        )
                        .AddChild(new FileTileComponent()
                            .SetFileName("free-disk.sh")
                            .SetFileSize(2_150)
                            .OnClick(nameof(FileTileController.OpenAttachment), UIAction.Arg("name", "free-disk.sh"))
                        )
                    )
                ),
            note: "OnClick makes the whole tile pressable, a Tab stop Enter and Space press, and says what a press does. The name's extension picks the glyph, the whole name is the tile's tooltip, and the size is written in the reader's language.",
            context: AttachmentsGroup
        );
    }

    /// <summary>Files the panel has ready for its reader, each a press away, under the card's heading.</summary>
    private static ContainerComponent CreateDownloadsGroup()
    {
        return DemoUI.CreateExample("A list of downloads",
            UICard.Create("Downloads", "Kept for a week, then deleted.", UILayout.Row(8)
                .SetWrap(true)
                .AddChild(new FileTileComponent()
                    .SetFileName("invoices-2026-09.zip")
                    .SetFileSize(4_404_019)
                    .OnClick(nameof(FileTileController.Download), UIAction.Arg("name", "invoices-2026-09.zip"))
                )
                .AddChild(new FileTileComponent()
                    .SetFileName("subscriptions-2026-09.csv")
                    .SetFileSize(186_368)
                    .OnClick(nameof(FileTileController.Download), UIAction.Arg("name", "subscriptions-2026-09.csv"))
                )
                .AddChild(new FileTileComponent()
                    .SetFileName("audit-log-2026-09.json")
                    .SetFileSize(1_153_434)
                    .OnClick(nameof(FileTileController.Download), UIAction.Arg("name", "audit-log-2026-09.json"))
                )
                .AddChild(new FileTileComponent()
                    .SetFileName("SUB-000003")
                    .SetContentType("application/pdf")
                    .SetFileSize(61_440)
                    .OnClick(nameof(FileTileController.Download), UIAction.Arg("name", "SUB-000003"))
                ), DemoIcons.Outline(DemoIcons.Download)
            ),
            note: "A name with no extension says nothing of its kind, so ContentType picks the glyph: the last is a PDF named by its subscription.",
            context: DownloadsGroup
        );
    }

    /// <summary>
    /// <c>Loading</c>: a ring turns in the glyph's place while the server writes the file, and the size comes with the file.
    /// </summary>
    private static ContainerComponent CreateExportGroup()
    {
        return DemoUI.CreateExample("While the server writes it",
            UILayout.Row(16)
                .AddChild(new FileTileComponent()
                    .SetFileName("subscriptions-2026-10.csv")
                    .BindFileSize(nameof(FileTileExportGroupContext.Size), UIBindingScope.Relative)
                    .BindLoading(nameof(FileTileExportGroupContext.Busy), UIBindingScope.Relative)
                )
                .AddChild(UIButtons.Outline("Export again", DemoIcons.Outline(DemoIcons.Refresh))
                    .SetVerticalAlignment(UIAlignment.Center)
                    .OnClick(nameof(FileTileController.ExportAsync))
                ),
            note: "Loading stands a ring where the glyph was and keeps the name, so the tile is in its place before the file is; the size is unset until there is one.",
            context: ExportGroup
        );
    }

    /// <summary>
    /// What an upload sent: the field sends the files and writes its selection's handle, Upload reads it on the server, and each file it
    /// holds joins the tiles under the field.
    /// </summary>
    private static ContainerComponent CreateUploadGroup()
    {
        return DemoUI.CreateExample("What an upload sent",
            UILayout.Stack(12)
                .AddChild(UILayout.Row(8)
                    .AddChild(new FileInputComponent()
                        .SetTitle("Attach to db-eu-west-2")
                        .SetMultiple(true)
                        .SetMaxFileSize(5 * 1024 * 1024)
                        .SetPlaceholder("Up to 5 MB each")
                        .BindValue(nameof(FileTileUploadGroupContext.Value), UIBindingScope.Relative)
                        .BindSelectionId(nameof(FileTileUploadGroupContext.SelectionId), UIBindingScope.Relative)
                        .SetWidth(UILayoutLength.Absolute(280))
                    )
                    .AddChild(UIButtons.Primary("Upload")
                        .SetVerticalAlignment(UIAlignment.End)
                        .OnClick(nameof(FileTileController.UploadAsync))
                    )
                )
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(FileTileUploadGroupContext.Files), UIBindingScope.Relative)
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetLayoutType(UIItemsLayoutType.Wrap)
                    .SetSpacing(4)
                    .SetTemplate(new DefaultFileTemplate())
                ),
            note: "Upload reads the selection on the server (Context.Uploads.GetSelectionAsync): each file comes back with the name, size and type the transfer measured, and a FileItem per file is a tile, drawn by DefaultFileTemplate in a list.",
            context: UploadGroup
        );
    }
}
