using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Files;

/// <summary>Holds file content between the transfer and the code that reads it.</summary>
/// <remarks>
/// Every operation is scoped to a session, and a file id alone must never be enough to read a file — an implementation
/// that ignores <c>sessionId</c> is broken.
/// </remarks>
public interface IUIFileStore
{
    /// <summary>
    /// Stores one uploaded file and issues its id.
    /// </summary>
    Task<UIUploadFile> SaveUploadAsync(string sessionId, string selectionId, string fileName, string? contentType, Stream content, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers an existing local read-only file as an upload for <paramref name="sessionId"/> without copying its bytes when the store supports local references.
    /// </summary>
    async Task<UIUploadFile> RegisterLocalUploadAsync(string sessionId, string selectionId, string localFilePath, string? fileName = null, string? contentType = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(localFilePath);

        var resolvedName = string.IsNullOrWhiteSpace(fileName) ? Path.GetFileName(localFilePath) : fileName;
        FileStream stream = new(localFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 64 * 1024, FileOptions.Asynchronous | FileOptions.SequentialScan);

        await using (stream.ConfigureAwait(false))
            return await SaveUploadAsync(sessionId, selectionId, resolvedName, contentType, stream, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>How many bytes of uploads the session holds now — what <c>UIFileOptions.MaxUploadBytesPerSession</c> is checked against.</summary>
    /// <remarks>A store that does not count answers zero, and the per-session limit then holds nothing back.</remarks>
    Task<long> GetUploadedBytesAsync(string sessionId, CancellationToken cancellationToken = default)
        => Task.FromResult(0L);

    /// <summary>
    /// Reads back the metadata of a stored selection, or an empty list when the session has no such selection.
    /// </summary>
    Task<IReadOnlyList<UIUploadFile>> GetSelectionAsync(string sessionId, string selectionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reads the metadata of one stored upload, or <see langword="null"/> when this session has no such file.
    /// </summary>
    Task<UIUploadFile?> GetUploadAsync(string sessionId, string fileId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Opens a stored upload for reading, or <see langword="null"/> when this session has no such file.
    /// </summary>
    Task<Stream?> OpenUploadAsync(string sessionId, string fileId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages content for the client to fetch and issues the one-time token that identifies it.
    /// </summary>
    Task<string> StageDownloadAsync(string sessionId, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a streaming download producer so content is generated directly into the destination stream when fetched or delivered.
    /// </summary>
    async Task<string> StageDownloadAsync(string sessionId, string fileName, string contentType, Func<Stream, CancellationToken, ValueTask> writeAsync, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(writeAsync);

        using MemoryStream buffer = new();
        await writeAsync(buffer, cancellationToken).ConfigureAwait(false);
        buffer.Position = 0;
        return await StageDownloadAsync(sessionId, fileName, contentType, buffer, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Takes a staged download, removing it so the token cannot be replayed. Null when the token is unknown to
    /// this session.
    /// </summary>
    Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Takes a staged download and delivers it directly to <paramref name="destinationPath"/> on disk (moving a staged temp file or invoking its producer in place).
    /// </summary>
    async Task<bool> TryDeliverDownloadAsync(string sessionId, string token, string destinationPath, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(destinationPath);

        UIStagedDownload? staged = await TakeDownloadAsync(sessionId, token, cancellationToken).ConfigureAwait(false);
        if (staged is null)
            return false;

        await using (staged.ConfigureAwait(false))
        {
            var directory = Path.GetDirectoryName(destinationPath);
            if (!string.IsNullOrEmpty(directory))
                _ = Directory.CreateDirectory(directory);

            FileStream destination = new(destinationPath, FileMode.Create, FileAccess.Write, FileShare.None, 64 * 1024, FileOptions.Asynchronous | FileOptions.SequentialScan);
            await using (destination.ConfigureAwait(false))
            {
                if (staged.WriteToAsync is not null)
                    await staged.WriteToAsync(destination, cancellationToken).ConfigureAwait(false);
                else
                    await staged.Content.CopyToAsync(destination, cancellationToken).ConfigureAwait(false);
            }
        }

        return true;
    }

    /// <summary>
    /// Removes every file of a selection — what an upload that failed part-way had already saved.
    /// </summary>
    Task RemoveSelectionAsync(string sessionId, string selectionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes everything held for a session — called when the session goes away.
    /// </summary>
    Task RemoveSessionAsync(string sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Moves everything held for a session to the id it was replaced by at sign-in, so a file picked before signing in stays the reader's.
    /// </summary>
    Task MoveSessionAsync(string fromSessionId, string toSessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes staged content older than the given retention, returning how many entries went.
    /// </summary>
    Task<int> CleanupAsync(DateTime utcNow, TimeSpan uploadRetention, TimeSpan downloadRetention, CancellationToken cancellationToken = default);
}

/// <summary>
/// Content staged for the client to download, and the stream it is read from.
/// </summary>
public sealed class UIStagedDownload : IAsyncDisposable, IDisposable
{
    /// <summary>
    /// Gets the file name offered to the client.
    /// </summary>
    public required string FileName { get; init; }

    /// <summary>
    /// Gets the content type served.
    /// </summary>
    public required string ContentType { get; init; }

    /// <summary>
    /// Gets the readable content.
    /// </summary>
    public required Stream Content { get; init; }

    /// <summary>
    /// Gets an optional streaming writer used instead of <see cref="Content"/> when the download was staged without buffering to disk.
    /// </summary>
    public Func<Stream, CancellationToken, ValueTask>? WriteToAsync { get; init; }

    /// <summary>
    /// Gets the maximum byte count allowed while streaming <see cref="WriteToAsync"/>, or <see langword="null"/> when unbounded.
    /// </summary>
    public long? MaxBytes { get; init; }

    /// <inheritdoc />
    public ValueTask DisposeAsync()
        => Content.DisposeAsync();

    /// <inheritdoc />
    public void Dispose()
        => Content.Dispose();
}
