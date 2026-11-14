using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.FileInput;

/// <summary>
/// What the field holds: <c>Value</c> shows the file names, <c>SelectionId</c> is the handle the server takes
/// to the upload service.
/// </summary>
internal sealed partial class FileInputValueGroupContext : InputValueGroupContext
{
    internal const string ReadSelectionOptionId = "Read selection";

    [RecursiveMember]
    public partial string? Value { get; set; }

    [RecursiveMember]
    public partial string? SelectionId { get; set; }

    [RecursiveMember]
    public partial string? Selection { get; set; }

    public FileInputValueGroupContext()
    {
        AddOption(nameof(Value), ClearValue, () => Value);
        AddOption(nameof(SelectionId), ClearSelectionId, () => SelectionId);
        AddOption(ReadSelectionOptionId, ReadSelection, () => Selection);
        AddReadOnlyOption();
    }

    /// <summary>
    /// Clears rather than cycles, showing that the field's text can be taken back by the server.
    /// </summary>
    public void ClearValue()
        => SetLastChange(nameof(Value), Value = null);

    public void ClearSelectionId()
        => SetLastChange(nameof(SelectionId), SelectionId = null);

    /// <summary>
    /// Deliberately empty: the controller's command answers the press, since reading an upload selection is asynchronous.
    /// </summary>
    public void ReadSelection()
    {
    }

    internal void Report(string summary)
    {
        Selection = summary;
        SetLastChange(ReadSelectionOptionId, summary);
        RefreshOptions();
    }
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
        AddAppearanceOption();
        AddSizeOption();
        AddPlaceholderOption();
        AddOption(nameof(Accept), CycleAccept, () => Accept);
        AddOption(nameof(MaxFileSize), CycleMaxFileSize, () => MaxFileSize);
        AddOption(nameof(Multiple), ToggleMultiple, () => Multiple);
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
/// One command per options section, plus the asynchronous one that reads what was uploaded.
/// </summary>
internal sealed partial class FileInputController() : DemoStandardController
{
    [RecursiveMember]
    public partial FileInputValueGroupContext ValueGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileInputFileGroupContext FileGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextLabelGroupContext LabelGroup { get; set; } = new("Deployment bundle");

    [RecursiveMember]
    public partial BorderGroupContext BorderGroup { get; set; } = new();

    /// <summary>
    /// Asks the upload service what <c>SelectionId</c> stands for; with nothing chosen the row says so.
    /// </summary>
    protected override async Task OnOptionCycledAsync(string group, string id, CancellationToken cancellationToken)
    {
        if (group != nameof(ValueGroup) || id != FileInputValueGroupContext.ReadSelectionOptionId)
            return;

        var selectionId = ValueGroup.SelectionId;

        if (string.IsNullOrWhiteSpace(selectionId))
        {
            ValueGroup.Report("(nothing uploaded)");
            return;
        }

        try
        {
            UIUploadSelection selection = await Context.Uploads
                .GetSelectionAsync(Context.Handle, selectionId, cancellationToken)
                .ConfigureAwait(false);

            ValueGroup.Report(selection.Files.Length == 0 ? "(empty selection)" : string.Join(", ", selection.Files.Select(file => $"{file.FileName} · {new UIFileSize(file.Size)}")));
        }
        catch (InvalidOperationException error)
        {
            ValueGroup.Report(error.Message);
        }
    }
}
