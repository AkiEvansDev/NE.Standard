using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Files;

namespace DemoApp.Controllers.Inputs.ImageInput;

/// <summary>
/// The picture shown and the handle of the one uploaded: the first is the controller's, the second the client writes.
/// </summary>
internal sealed partial class ImageValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = DemoImages.Avatar;

    [RecursiveMember]
    public partial string? SelectionId { get; set; }

    public ImageValueGroupContext()
    {
        AddOption(nameof(Value), CycleValue, () => Value);
        AddOption(nameof(SelectionId), ClearSelectionId, () => SelectionId);
        AddReadOnlyOption();
    }

    public void CycleValue()
        => SetLastChange(nameof(Value), Value = CycleValue(Value, DemoImages.Avatar, DemoImages.HarbourSky, null));

    public void ClearSelectionId()
        => SetLastChange(nameof(SelectionId), SelectionId = null);

    /// <summary>The uploaded picture, taken over as the one shown, so the local preview gives way to the controller's copy.</summary>
    internal void Show(string source)
        => Value = source;
}

/// <summary>
/// What the control accepts and shows around the picture: the file types, the glyph without a picture, the row's text, the fit.
/// </summary>
internal sealed partial class ImagePictureGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Accept { get; set; }

    [RecursiveMember]
    public partial string? PlaceholderIcon { get; set; }

    [RecursiveMember]
    public partial string? Placeholder { get; set; } = "No picture yet";

    [RecursiveMember]
    public partial UIImageFit? Fit { get; set; }

    public ImagePictureGroupContext()
    {
        AddOption(nameof(Accept), CycleAccept, () => Accept);
        AddOption(nameof(PlaceholderIcon), CyclePlaceholderIcon, () => PlaceholderIcon);
        AddOption(nameof(Placeholder), CyclePlaceholder, () => Placeholder);
        AddOption(nameof(Fit), CycleFit, () => Fit);
    }

    public void CycleAccept()
        => SetLastChange(nameof(Accept), Accept = CycleValue(Accept, null, "image/png", ".jpg,.jpeg"));

    public void CyclePlaceholderIcon()
        => SetLastChange(nameof(PlaceholderIcon), PlaceholderIcon = CycleValue(PlaceholderIcon, null, DemoIcons.Outline(DemoIcons.Upload), DemoIcons.Outline(DemoIcons.Groups)));

    public void CyclePlaceholder()
        => SetLastChange(nameof(Placeholder), Placeholder = CycleValue(Placeholder, "No picture yet", "Drop a picture here", null));

    public void CycleFit()
        => SetLastChange(nameof(Fit), Fit = CycleEnum(Fit));
}

internal sealed partial class ImageInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial ImageValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial ImagePictureGroupContext ImageGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Profile picture");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    /// <summary>
    /// Runs on the control's change, once the upload's handle has landed: reads the file back and shows it as the picture —
    /// what an application would do with a stored copy's URL, done here with the bytes themselves.
    /// </summary>
    [UICommand]
    public async Task TakePictureAsync(CancellationToken cancellationToken)
    {
        var selectionId = ValueGroup.SelectionId;

        if (string.IsNullOrWhiteSpace(selectionId))
            return;

        UIUploadSelection selection = await Context.Uploads
            .GetSelectionAsync(Context.Handle, selectionId, cancellationToken)
            .ConfigureAwait(false);

        if (selection.Files.Length == 0)
            return;

        UIUploadedFile file = await Context.Uploads
            .OpenAsync(Context.Handle, selection.Files[0].FileId, cancellationToken: cancellationToken)
            .ConfigureAwait(false);

        await using (file.ConfigureAwait(false))
        {
            using MemoryStream buffer = new();
            await file.Content.CopyToAsync(buffer, cancellationToken).ConfigureAwait(false);

            ValueGroup.Show($"data:{file.Metadata.ContentType};base64,{Convert.ToBase64String(buffer.ToArray())}");
        }
    }

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleImageOption(string id)
        => ImageGroup.CycleOption(id);

    [UICommand]
    public void CycleContentOption(string id)
        => ContentGroup.CycleOption(id);

    [UICommand]
    public void CycleBadgeOption(string id)
        => BadgeGroup.CycleOption(id);

    [UICommand]
    public void CycleBorderOption(string id)
        => BorderGroup.CycleOption(id);
}
