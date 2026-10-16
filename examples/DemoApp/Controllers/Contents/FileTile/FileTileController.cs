using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Contents.FileTile;

/// <summary>
/// The file a tile shows — its name, its size, its type — the glyph that may stand for its kind's, and whether the tile is pressable.
/// </summary>
internal sealed partial class FileTileGroupContext : DemoGroupContext
{
    private const string LongName = "db-eu-west-2-disk-usage-before-the-cleanup.png";

    [RecursiveMember]
    public partial string? FileName { get; set; } = "incident-report.md";

    [RecursiveMember]
    public partial long? FileSize { get; set; } = 14_336;

    [RecursiveMember]
    public partial string? ContentType { get; set; }

    [RecursiveMember]
    public partial string? Icon { get; set; }

    [RecursiveMember]
    public partial bool Clickable { get; set; }

    public FileTileGroupContext()
    {
        AddOption(nameof(FileName), CycleFileName, () => FileName);
        AddOption(nameof(FileSize), CycleFileSize, () => FileSize);
        AddOption(nameof(ContentType), CycleContentType, () => ContentType);
        AddOption(nameof(Icon), CycleIcon, () => Icon);
        AddOption(nameof(Clickable), ToggleClickable, () => Clickable);
    }

    // A name with no extension says nothing of its kind, so the ContentType row decides the glyph then.
    public void CycleFileName()
        => SetLastChange(nameof(FileName), FileName = CycleValue(FileName, "incident-report.md", "invoice-2026-09.pdf", LongName, "provision", null));

    public void CycleFileSize()
        => SetLastChange(nameof(FileSize), FileSize = CycleValue(FileSize, 14_336, 1_572_864, 2_147_483_648, null));

    public void CycleContentType()
        => SetLastChange(nameof(ContentType), ContentType = CycleValue(ContentType, null, "application/pdf", "image/png"));

    public void CycleIcon()
        => SetLastChange(nameof(Icon), Icon = CycleIconValue(Icon, DemoIcons.Lock));

    public void ToggleClickable()
        => SetLastChange(nameof(Clickable), Clickable = !Clickable);
}

/// <summary>
/// An export the server writes at a press: the tile turns while it is written, then stands with the size it came to.
/// </summary>
internal sealed partial class FileTileExportGroupContext : DemoGroupContext
{
    private int _runs;

    [RecursiveMember]
    public partial bool Busy { get; set; }

    [RecursiveMember]
    public partial long? Size { get; set; } = 186_368;

    internal void Start()
    {
        Busy = true;
        Size = null;
        LogEvent("writing the export");
    }

    internal void Finish()
    {
        _runs++;
        Size = 186_368 + (_runs * 2_048);
        Busy = false;
        LogEvent("the export is ready");
    }
}

/// <summary>
/// What the last upload sent: the field writes the selection's handle, Upload reads it on the server and lists each file as a tile.
/// </summary>
internal sealed partial class FileTileUploadGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? SelectionId { get; set; }

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<FileItem> Files { get; } =
    [
        new FileItem { Id = "server-json", FileName = "server.json", FileSize = 1_843, ContentType = "application/json" }
    ];

    internal void Add(UIUploadSelection selection)
    {
        foreach (UIUploadFile file in selection.Files)
            Files.Add(new FileItem { Id = file.FileId, FileName = file.FileName, FileSize = file.Size, ContentType = file.ContentType });

        // Empty for the next pick: the field shows its placeholder again, and the handle is spent.
        SelectionId = null;
        Value = null;
        LogEvent(selection.Files.Length == 1 ? "1 file uploaded" : string.Create(CultureInfo.InvariantCulture, $"{selection.Files.Length} files uploaded"));
    }
}

/// <summary>
/// One file tile and every property that can be bound to it; a press on an example's tile, an export written, and an upload read.
/// </summary>
internal sealed partial class FileTileController() : DemoStandardController
{
    [RecursiveMember]
    public partial FileTileGroupContext FileGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext AttachmentsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext DownloadsGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileTileExportGroupContext ExportGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileTileUploadGroupContext UploadGroup { get; set; } = new();

    [UICommand]
    public void CycleFileOption(string id)
        => FileGroup.CycleOption(id);

    [UICommand]
    public void OpenAttachment(string name)
        => AttachmentsGroup.LogEvent($"opening {name}");

    [UICommand]
    public void Download(string name)
        => DownloadsGroup.LogEvent($"downloading {name}");

    [UICommand]
    public async Task ExportAsync(CancellationToken cancellationToken)
    {
        ExportGroup.Start();

        await Task.Delay(1500, cancellationToken).ConfigureAwait(false);

        ExportGroup.Finish();
    }

    /// <summary>
    /// Reads what the field sent; with nothing chosen the line says so.
    /// </summary>
    [UICommand]
    public async Task UploadAsync(CancellationToken cancellationToken)
    {
        var selectionId = UploadGroup.SelectionId;

        if (string.IsNullOrWhiteSpace(selectionId))
        {
            UploadGroup.LogEvent("pick a file first");
            return;
        }

        try
        {
            UIUploadSelection selection = await Context.Uploads
                .GetSelectionAsync(Context.Handle, selectionId, cancellationToken)
                .ConfigureAwait(false);

            UploadGroup.Add(selection);
        }
        catch (InvalidOperationException error)
        {
            UploadGroup.LogEvent(error.Message);
        }
    }
}
