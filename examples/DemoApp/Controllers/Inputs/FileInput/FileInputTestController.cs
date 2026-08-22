using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Files;

namespace DemoApp.Controllers.Inputs.FileInput;

/// <summary>
/// The upload round trip: the picker sends the files over HTTP, writes the returned id into
/// <see cref="SelectionId"/> through the ordinary value binding, and the command reads the selection back.
/// </summary>
internal sealed partial class FileUploadGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? SelectionId { get; set; }

    [RecursiveMember]
    public partial string Files { get; set; } = "(nothing uploaded yet)";

    public void Show(UIUploadSelection selection)
    {
        ArgumentNullException.ThrowIfNull(selection);

        Files = selection.HasFiles
            ? string.Join("  ·  ", Array.ConvertAll(selection.Files, static file => $"{file.FileName} ({file.Size} bytes)"))
            : "(the selection is empty)";

        LogEvent($"Read {selection.Files.Length} file(s) from selection '{SelectionId}'.");
    }
}

/// <summary>
/// Answers "can I show download progress through a binding": yes, for the half that takes time. The command
/// writes <see cref="Progress"/> while it builds the file and a bound <c>ProgressComponent</c> follows it.
/// </summary>
internal sealed partial class FileDownloadGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal Progress { get; set; }

    [RecursiveMember]
    public partial bool IsRunning { get; set; }

    /// <summary>
    /// An <c>IProgress</c> over the bound property, so ordinary code that already reports progress needs no
    /// knowledge of the UI. <c>Progress&lt;T&gt;</c> is not used: it posts to the captured synchronization
    /// context, which would let a report land after the command finished.
    /// </summary>
    public IProgress<double> Report => new DirectProgress(this);

    private sealed class DirectProgress(FileDownloadGroupContext context) : IProgress<double>
    {
        public void Report(double value)
            => context.Progress = (decimal)Math.Round(value * 100, 0);
    }

    public void Begin()
    {
        Progress = 0;
        IsRunning = true;
        LogEvent("Building the report...");
    }

    public void Finish(UITransferResult result)
    {
        IsRunning = false;
        LogEvent(result.Success ? "Report staged; the browser is fetching it." : $"Download failed: {result.Error}");
    }
}

/// <summary>
/// Covers what only a live transfer proves: that a picked file reaches the server and can be read back by the
/// id the picker wrote, and that a staged download reaches the browser. Neither is visible from a green build —
/// the binding page next door can show every property of the picker while the transport is dead.
/// </summary>
internal sealed partial class FileInputTestController() : DemoController
{
    [RecursiveMember]
    public partial FileUploadGroupContext UploadGroup { get; set; } = new();

    [RecursiveMember]
    public partial FileDownloadGroupContext DownloadGroup { get; set; } = new();

    /// <summary>
    /// Reads what the picker uploaded. The id arrived through the ordinary value binding, so nothing here is
    /// file-transfer-specific except the service call.
    /// </summary>
    [UICommand]
    public async Task ReadSelectionAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(UploadGroup.SelectionId))
        {
            UploadGroup.Message = "Pick a file first — the id arrives once the upload finishes.";
            return;
        }

        UIUploadSelection selection = await Context.Uploads
            .GetSelectionAsync(Context.Handle, UploadGroup.SelectionId, cancellationToken)
            .ConfigureAwait(false);

        UploadGroup.Show(selection);
    }

    /// <summary>
    /// Reads the uploaded bytes rather than only its metadata — the half that proves the content survived the
    /// transfer, not just that a row exists.
    /// </summary>
    [UICommand]
    public async Task ReadContentAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(UploadGroup.SelectionId))
        {
            UploadGroup.Message = "Pick a file first.";
            return;
        }

        UIUploadSelection selection = await Context.Uploads
            .GetSelectionAsync(Context.Handle, UploadGroup.SelectionId, cancellationToken)
            .ConfigureAwait(false);

        if (selection.SingleFile is not UIUploadFile file)
        {
            UploadGroup.Message = "Pick exactly one file to read its content.";
            return;
        }

        UIUploadedFile opened = await Context.Uploads
            .OpenAsync(Context.Handle, file.FileId, cancellationToken: cancellationToken)
            .ConfigureAwait(false);

        await using (opened.ConfigureAwait(false))
        {
            using StreamReader reader = new(opened.Content, Encoding.UTF8);

            var text = await reader.ReadToEndAsync(cancellationToken).ConfigureAwait(false);

            UploadGroup.Files = text.Length <= 120 ? text : $"{text[..120]}...";
            UploadGroup.Message = $"Read {text.Length} character(s) from '{file.FileName}'.";
        }
    }

    /// <summary>
    /// The download half of <c>docs/FILES.md</c>: the bytes never touch the connection — the service stages
    /// them and pushes a <c>DownloadFileEffect</c> pointing at a single-use path the browser then fetches.
    /// </summary>
    /// <remarks>
    /// Progress is bound the ordinary way, because the part that takes time is <em>producing</em> the file and
    /// that happens here, in the controller. Writing to a bound property mid-command reaches the client: the
    /// scheduled flush only needs the state lock, which a running command does not hold. Handing the transfer
    /// itself an <c>IProgress</c> would be the useless half — by then the browser is doing the work and the
    /// server cannot see it.
    /// </remarks>
    [UICommand]
    public async Task DownloadReportAsync(CancellationToken cancellationToken)
    {
        DownloadGroup.Begin();

        MemoryStream buffer = new();

        await using (buffer.ConfigureAwait(false))
        {
            await WriteReportAsync(buffer, DownloadGroup.Report, cancellationToken).ConfigureAwait(false);

            buffer.Position = 0;

            UITransferResult result = await Context.Downloads
                .DownloadAsync(Context.Handle, "demo-report.csv", "text/csv", buffer, cancellationToken)
                .ConfigureAwait(false);

            DownloadGroup.Finish(result);
        }
    }

    /// <summary>
    /// Stands in for whatever really takes the time — a query, a render, a zip. The delay is what makes the
    /// bound progress visible at all.
    /// </summary>
    private static async Task WriteReportAsync(Stream destination, IProgress<double> progress, CancellationToken cancellationToken)
    {
        const int Rows = 20;

        StreamWriter writer = new(destination, Encoding.UTF8, leaveOpen: true);

        await using (writer.ConfigureAwait(false))
        {
            await writer.WriteLineAsync("row,value").ConfigureAwait(false);

            for (var row = 1; row <= Rows; row++)
            {
                await Task.Delay(120, cancellationToken).ConfigureAwait(false);
                await writer.WriteLineAsync($"{row},{row * row}").ConfigureAwait(false);

                progress.Report(row / (double)Rows);
            }
        }
    }
}
