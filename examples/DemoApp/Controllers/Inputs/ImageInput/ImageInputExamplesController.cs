using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.ImageInput;

/// <summary>A picture kept on a shelf: the stored copy's address, here the bytes themselves.</summary>
internal sealed partial class DemoStickerItem : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; init; } = "";

    [RecursiveMember]
    public partial string Source { get; set; } = "";
}

/// <summary>
/// Adding a sticker: the input takes one picture, the controller stores it on the shelf and writes the handle back to null, which
/// empties the input for the next one.
/// </summary>
internal sealed partial class StickerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? PickedId { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<DemoStickerItem> Stickers { get; } = [];

    internal void Keep(string source)
    {
        Stickers.Add(new DemoStickerItem { Id = string.Create(CultureInfo.InvariantCulture, $"sticker-{Stickers.Count + 1}"), Source = source });
        LogEvent($"sticker {Stickers.Count} kept, the input emptied");
    }
}

/// <summary>
/// A messenger's composer: the files on the shelf above it and the draft; Send takes both and empties both.
/// </summary>
internal sealed partial class ComposerGroupContext : DemoGroupContext
{
    private int _sent;

    [RecursiveMember]
    public partial string? Draft { get; set; }

    [RecursiveMember]
    public partial IReadOnlyList<string>? AttachmentIds { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Messages { get; } = [];

    internal void Post(int files)
    {
        var text = Draft?.Trim();

        if (string.IsNullOrEmpty(text) && files == 0)
            return;

        _sent++;

        Messages.Add(new TextItem
        {
            Id = string.Create(CultureInfo.InvariantCulture, $"sent-{_sent}"),
            IsContent = true,
            Icon = DemoIcons.User,
            Title = string.IsNullOrEmpty(text) ? "(no text)" : text,
            Description = files switch
            {
                0 => null,
                1 => "1 file",
                _ => string.Create(CultureInfo.InvariantCulture, $"{files} files")
            }
        });

        Draft = null;
        // Empty, not null: an empty list is what clears the shelf.
        AttachmentIds = [];
        LogEvent($"message {_sent} sent with {files} file(s)");
    }
}

/// <summary>
/// The image input examples that read an upload back: the sticker the controller keeps and clears, and the composer's shelf.
/// </summary>
internal sealed partial class ImageInputExamplesController() : DemoController
{
    [RecursiveMember]
    public partial StickerGroupContext StickerGroup { get; set; } = new();

    [RecursiveMember]
    public partial ComposerGroupContext ComposerGroup { get; set; } = new();

    /// <summary>
    /// Runs on the input's change, once the upload's handle has landed: stores the picture and writes the handle back to null, so the
    /// input is empty for the next sticker.
    /// </summary>
    [UICommand]
    public async Task TakeStickerAsync(CancellationToken cancellationToken)
    {
        var selectionId = StickerGroup.PickedId;

        if (string.IsNullOrWhiteSpace(selectionId))
            return;

        UIUploadSelection selection = await Context.Uploads.GetSelectionAsync(Context.Handle, selectionId, cancellationToken).ConfigureAwait(false);

        if (selection.Files.Length == 0 || !DemoImages.IsInlinePicture(selection.Files[0].ContentType, selection.Files[0].Size))
        {
            StickerGroup.LogEvent("not kept: a PNG, JPEG, GIF or WebP picture of at most 2 MB");
            StickerGroup.PickedId = null;
            return;
        }

        UIUploadedFile file = await Context.Uploads.OpenAsync(Context.Handle, selection.Files[0].FileId, cancellationToken: cancellationToken).ConfigureAwait(false);

        await using (file.ConfigureAwait(false))
        {
            using MemoryStream buffer = new();
            await file.Content.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);

            StickerGroup.Keep($"data:{file.Metadata.ContentType};base64,{Convert.ToBase64String(buffer.ToArray())}");
        }

        StickerGroup.PickedId = null;
    }

    /// <summary>Counts the files on the shelf, one upload each, and posts them with the draft.</summary>
    [UICommand]
    public async Task SendAsync(CancellationToken cancellationToken)
    {
        var files = 0;

        foreach (var selectionId in ComposerGroup.AttachmentIds ?? [])
        {
            if (string.IsNullOrWhiteSpace(selectionId))
                continue;

            UIUploadSelection selection = await Context.Uploads.GetSelectionAsync(Context.Handle, selectionId, cancellationToken).ConfigureAwait(false);
            files += selection.Files.Length;
        }

        ComposerGroup.Post(files);
    }
}
