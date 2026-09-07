using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Files;

namespace DemoApp.Controllers.Inputs.FileInput;

/// <summary>
/// What the field holds: <c>Value</c> shows the file names, <c>SelectionId</c> is the handle the server takes
/// to the upload service.
/// </summary>
internal sealed partial class FileInputValueGroupContext : InputValueGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember]
    public partial string? SelectionId { get; set; }

    public FileInputValueGroupContext()
    {
        AddOption(nameof(Value), ClearValue, () => Value);
        AddOption(nameof(SelectionId), ClearSelectionId, () => SelectionId);
        AddReadOnlyOption();
    }

    /// <summary>
    /// Clears rather than cycles, showing that the field's text can be taken back by the server.
    /// </summary>
    public void ClearValue()
        => SetLastChange(nameof(Value), Value = null);

    public void ClearSelectionId()
        => SetLastChange(nameof(SelectionId), SelectionId = null);
}

/// <summary>
/// What the browser is allowed to offer: which types, how large, and how many.
/// </summary>
internal sealed partial class FileInputFileGroupContext : AffixedFieldGroupContext
{
    [RecursiveMember]
    public partial string? Accept { get; set; }

    [RecursiveMember]
    public partial long? MaxFileSize { get; set; }

    [RecursiveMember]
    public partial bool Multiple { get; set; }

    public FileInputFileGroupContext() : base("No file chosen", DemoIcons.File, DemoIcons.Upload)
    {
        AddPlaceholderOption();
        AddOption(nameof(Accept), CycleAccept, () => Accept);
        AddOption(nameof(MaxFileSize), CycleMaxFileSize, () => MaxFileSize);
        AddOption(nameof(Multiple), ToggleMultiple, () => Multiple);
        AddAppearanceOption();
        AddAffixIconOptions();
    }

    public void CycleAccept()
        => SetLastChange(nameof(Accept), Accept = CycleValue(Accept, null, "image/*", ".json,.yaml"));

    // 64 KB first: small enough that an ordinary screenshot is refused, so the limit is visible.
    public void CycleMaxFileSize()
        => SetLastChange(nameof(MaxFileSize), MaxFileSize = CycleValue(MaxFileSize, 64L * 1024, 8L * 1024 * 1024, null));

    public void ToggleMultiple()
        => SetLastChange(nameof(Multiple), Multiple = !Multiple);

}

/// <summary>
/// What the server can read once the client has sent the files.
/// </summary>
/// <remarks>The row's press is answered by the controller, since reading a selection is asynchronous.</remarks>
internal sealed partial class FileInputUploadGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Selection { get; set; }

    public FileInputUploadGroupContext()
    {
        AddOption("Read selection", ReadSelection, () => Selection);
    }

    /// <summary>
    /// Deliberately empty: the controller's command answers the press, this only registers the row.
    /// </summary>
    public void ReadSelection()
    {
    }

    internal void Report(string summary)
    {
        Selection = summary;
        SetLastChange("Read selection", summary);
        RefreshOptions();
    }
}

/// <summary>
/// One command per options section, plus the asynchronous one that reads what was uploaded.
/// </summary>
internal sealed partial class FileInputMainController() : DemoStandardController
{
    [RecursiveMember]
    public partial FileInputValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileInputFileGroupContext FileGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileInputUploadGroupContext UploadGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextContentGroupContext ContentGroup { get; set; } = new("Deployment bundle");

    [RecursiveMember]
    public partial TextBadgeGroupContext BadgeGroup { get; set; } = new();

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    [UICommand]
    public void CycleValueOption(string id)
        => ValueGroup.CycleOption(id);

    [UICommand]
    public void CycleFileOption(string id)
        => FileGroup.CycleOption(id);

    /// <summary>
    /// Asks the upload service what <c>SelectionId</c> stands for; with nothing chosen the row says so.
    /// </summary>
    [UICommand]
    public async Task CycleUploadOption(string id, CancellationToken cancellationToken)
    {
        UploadGroup.CycleOption(id);

        var selectionId = ValueGroup.SelectionId;

        if (string.IsNullOrWhiteSpace(selectionId))
        {
            UploadGroup.Report("(nothing uploaded)");
            return;
        }

        try
        {
            UIUploadSelection selection = await Context.Uploads
                .GetSelectionAsync(Context.Handle, selectionId, cancellationToken)
                .ConfigureAwait(false);

            UploadGroup.Report(selection.Files.Length == 0
                ? "(empty selection)"
                : string.Join(", ", selection.Files.Select(file => $"{file.FileName} · {file.Size} B")));
        }
        catch (InvalidOperationException error)
        {
            UploadGroup.Report(error.Message);
        }
    }

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
