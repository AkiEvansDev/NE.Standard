using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Holds file content between the transfer and the code that reads it.
/// </summary>
/// <remarks>
/// <b>Every operation is scoped to a session, and that is the security boundary.</b> A file id on its own must
/// never be enough to read a file: without the session in the key, one client replaying or guessing another's
/// id reads their upload. An implementation that ignores <c>sessionId</c> is broken, however convenient.
/// <para>
/// Ids are issued here, never taken from the client. See <c>docs/FILES.md</c>.
/// </para>
/// </remarks>
public interface IUIFileStore
{
    /// <summary>
    /// Stores one uploaded file and issues its id.
    /// </summary>
    Task<UIUploadFile> SaveUploadAsync(string sessionId, string selectionId, string fileName, string? contentType, Stream content, CancellationToken cancellationToken = default);

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
    /// Stages content for the browser to fetch and issues the one-time token that identifies it.
    /// </summary>
    Task<string> StageDownloadAsync(string sessionId, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default);

    /// <summary>
    /// Takes a staged download, removing it so the token cannot be replayed. Null when the token is unknown to
    /// this session.
    /// </summary>
    Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes everything held for a session — called when the session goes away.
    /// </summary>
    Task RemoveSessionAsync(string sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes staged content older than the given retention, returning how many entries went.
    /// </summary>
    Task<int> CleanupAsync(DateTime utcNow, TimeSpan uploadRetention, TimeSpan downloadRetention, CancellationToken cancellationToken = default);
}

/// <summary>
/// Content staged for the browser to download, and the stream it is read from.
/// </summary>
public sealed class UIStagedDownload : IAsyncDisposable, IDisposable
{
    /// <summary>
    /// Gets the file name offered to the browser.
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

    /// <inheritdoc />
    public ValueTask DisposeAsync()
        => Content.DisposeAsync();

    /// <inheritdoc />
    public void Dispose()
        => Content.Dispose();
}
