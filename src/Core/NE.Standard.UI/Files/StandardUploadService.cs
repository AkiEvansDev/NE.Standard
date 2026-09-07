using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Services;

namespace NE.Standard.UI.Files;

/// <summary>
/// Reads back what the upload endpoint staged, scoped to the calling session.
/// </summary>
public sealed class StandardUploadService : IUIUploadService
{
    private readonly IUIFileStore _store;

    public StandardUploadService(IUIFileStore store)
    {
        ArgumentNullException.ThrowIfNull(store);
        _store = store;
    }

    /// <inheritdoc />
    public async Task<UIUploadSelection> GetSelectionAsync(UIHandle handle, string selectionId, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);

        handle.Instance.Validate();

        IReadOnlyList<UIUploadFile> files = await _store
            .GetSelectionAsync(handle.Session.SessionId, selectionId, cancellationToken)
            .ConfigureAwait(false);

        return new UIUploadSelection([.. files]);
    }

    /// <inheritdoc />
    public async Task<UIUploadedFile> OpenAsync(UIHandle handle, string fileId, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileId);

        handle.Instance.Validate();

        UIUploadFile metadata = await RequireMetadataAsync(handle, fileId, cancellationToken).ConfigureAwait(false);

        Stream content = await _store.OpenUploadAsync(handle.Session.SessionId, fileId, cancellationToken).ConfigureAwait(false)
            ?? throw new FileNotFoundException($"Uploaded file '{fileId}' is not available to this session.");

        progress?.Report(1);

        return new UIUploadedFile
        {
            Metadata = metadata,
            Content = content
        };
    }

    /// <summary>
    /// Asks the store, scoped to this session, so an id belonging to another session is a miss rather than a
    /// read.
    /// </summary>
    private async Task<UIUploadFile> RequireMetadataAsync(UIHandle handle, string fileId, CancellationToken cancellationToken)
    {
        UIUploadFile? metadata = await _store
            .GetUploadAsync(handle.Session.SessionId, fileId, cancellationToken)
            .ConfigureAwait(false);

        return metadata ?? throw new FileNotFoundException($"Uploaded file '{fileId}' is not available to this session.");
    }

    /// <inheritdoc />
    public async Task<UIUploadedFile[]> OpenManyAsync(UIHandle handle, string[] fileIds, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(fileIds);

        UIUploadedFile[] files = new UIUploadedFile[fileIds.Length];

        for (var i = 0; i < fileIds.Length; i++)
        {
            files[i] = await OpenAsync(handle, fileIds[i], progress: null, cancellationToken).ConfigureAwait(false);
            progress?.Report((i + 1d) / fileIds.Length);
        }

        return files;
    }

    /// <inheritdoc />
    public async Task<UITransferResult> CopyToAsync(UIHandle handle, string fileId, Stream destination, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(destination);

        try
        {
            UIUploadedFile file = await OpenAsync(handle, fileId, progress: null, cancellationToken).ConfigureAwait(false);

            await using (file.ConfigureAwait(false))
                await CopyWithProgressAsync(file.Content, destination, file.Metadata.Size, progress, cancellationToken).ConfigureAwait(false);

            return UITransferResult.Ok();
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return UITransferResult.Cancel();
        }
    }

    /// <summary>
    /// Copies in chunks so the reported fraction means something — <c>Stream.CopyToAsync</c> would finish and
    /// report once, which is not progress.
    /// </summary>
    private static async Task CopyWithProgressAsync(Stream source, Stream destination, long total, IProgress<double>? progress, CancellationToken cancellationToken)
    {
        if (progress is null)
        {
            await source.CopyToAsync(destination, cancellationToken).ConfigureAwait(false);
            return;
        }

        var buffer = new byte[81920];
        long copied = 0;

        for (var read = await source.ReadAsync(buffer, cancellationToken).ConfigureAwait(false);
            read > 0;
            read = await source.ReadAsync(buffer, cancellationToken).ConfigureAwait(false))
        {
            await destination.WriteAsync(buffer.AsMemory(0, read), cancellationToken).ConfigureAwait(false);

            copied += read;
            progress.Report(total <= 0 ? 0 : Math.Min(1, copied / (double)total));
        }

        progress.Report(1);
    }

    /// <inheritdoc />
    public async Task<UITransferResult[]> CopyManyToAsync(UIHandle handle, string[] fileIds, Func<UIUploadFile, Stream> destinationFactory, IProgress<double>? progress = null, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(fileIds);
        ArgumentNullException.ThrowIfNull(destinationFactory);

        UITransferResult[] results = new UITransferResult[fileIds.Length];

        for (var i = 0; i < fileIds.Length; i++)
        {
            results[i] = await CopyOneToAsync(handle, fileIds[i], destinationFactory, cancellationToken).ConfigureAwait(false);
            progress?.Report((i + 1d) / fileIds.Length);
        }

        return results;
    }

    /// <summary>
    /// Copies straight from the stream this open already holds, rather than reopening the file through
    /// <see cref="CopyToAsync"/> a second time.
    /// </summary>
    private async Task<UITransferResult> CopyOneToAsync(UIHandle handle, string fileId, Func<UIUploadFile, Stream> destinationFactory, CancellationToken cancellationToken)
    {
        try
        {
            UIUploadedFile file = await OpenAsync(handle, fileId, progress: null, cancellationToken).ConfigureAwait(false);

            await using (file.ConfigureAwait(false))
            {
                Stream destination = destinationFactory(file.Metadata);
                await CopyWithProgressAsync(file.Content, destination, file.Metadata.Size, progress: null, cancellationToken).ConfigureAwait(false);
            }

            return UITransferResult.Ok();
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return UITransferResult.Cancel();
        }
    }
}
