using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Application;
using NE.Standard.UI.Shell.Files;

namespace NE.Standard.UI.Files;

/// <summary>
/// The default store: content on disk under a configured root, metadata in memory.
/// </summary>
/// <remarks>
/// Metadata in memory means a restart loses staged selections, which is the right trade for content whose
/// whole life is one page visit — a host that needs otherwise registers its own <see cref="IUIFileStore"/>.
/// The content those selections named outlives them on disk, so the sweep also walks the root for files no
/// entry claims; see <see cref="SweepOrphans"/>.
/// <para>
/// Files are named by their issued id and never by anything the client sent: a client-supplied name reaching a
/// path is how directory traversal happens. The original name lives in metadata only.
/// </para>
/// </remarks>
internal sealed class FileSystemUIFileStore : IUIFileStore, IDisposable
{
    private sealed record StoredUpload(UIUploadFile File, string SelectionId, string Path, DateTime CreatedAtUtc);

    private sealed record StoredDownload(string FileName, string ContentType, string Path, DateTime CreatedAtUtc);

    // Keyed by (session, id) so a file id from another session simply does not resolve — see docs/FILES.md §3.
    private readonly ConcurrentDictionary<(string SessionId, string FileId), StoredUpload> _uploads = new();
    private readonly ConcurrentDictionary<(string SessionId, string Token), StoredDownload> _downloads = new();

    private readonly string _root;

    public FileSystemUIFileStore(UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _root = application.Files.StorageRoot
            ?? Path.Combine(Path.GetTempPath(), "ne.standard.ui.files");

        _ = Directory.CreateDirectory(_root);
    }

    /// <inheritdoc />
    public async Task<UIUploadFile> SaveUploadAsync(string sessionId, string selectionId, string fileName, string? contentType, Stream content, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentNullException.ThrowIfNull(content);

        var fileId = CreateId();
        var path = Path.Combine(_root, $"{fileId}.upload");

        long size;

        // A copy that fails takes its own half-written file with it. Nothing has registered the path yet, so
        // the sweep — which walks the metadata — would never have seen it again: an oversized upload is the
        // one refusal a caller can repeat at will, and every attempt would have left its bytes behind.
        try
        {
            FileStream destination = new(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);

            await using (destination.ConfigureAwait(false))
            {
                await content.CopyToAsync(destination, cancellationToken).ConfigureAwait(false);
                size = destination.Length;
            }
        }
        catch
        {
            Delete(path);
            throw;
        }

        UIUploadFile file = new()
        {
            FileId = fileId,
            FileName = fileName,
            ContentType = contentType,
            Size = size
        };

        file.Validate();

        _uploads[(sessionId, fileId)] = new StoredUpload(file, selectionId, path, DateTime.UtcNow);

        return file;
    }

    /// <inheritdoc />
    public Task<IReadOnlyList<UIUploadFile>> GetSelectionAsync(string sessionId, string selectionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);

        cancellationToken.ThrowIfCancellationRequested();

        List<UIUploadFile> files = [];

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal)
                && string.Equals(entry.Value.SelectionId, selectionId, StringComparison.Ordinal))
            {
                files.Add(entry.Value.File);
            }
        }

        return Task.FromResult<IReadOnlyList<UIUploadFile>>(files);
    }

    /// <inheritdoc />
    public Task<UIUploadFile?> GetUploadAsync(string sessionId, string fileId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileId);

        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(_uploads.TryGetValue((sessionId, fileId), out StoredUpload? stored) ? stored.File : null);
    }

    /// <inheritdoc />
    public Task<Stream?> OpenUploadAsync(string sessionId, string fileId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileId);

        cancellationToken.ThrowIfCancellationRequested();

        if (!_uploads.TryGetValue((sessionId, fileId), out StoredUpload? stored) || !File.Exists(stored.Path))
            return Task.FromResult<Stream?>(null);

        return Task.FromResult<Stream?>(new FileStream(stored.Path, FileMode.Open, FileAccess.Read, FileShare.Read));
    }

    /// <inheritdoc />
    public async Task<string> StageDownloadAsync(string sessionId, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
        ArgumentNullException.ThrowIfNull(content);

        var token = CreateId();
        var path = Path.Combine(_root, $"{token}.download");

        // Same as the upload path: until the token is registered, the file is known to nothing.
        try
        {
            FileStream destination = new(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);

            await using (destination.ConfigureAwait(false))
                await content.CopyToAsync(destination, cancellationToken).ConfigureAwait(false);
        }
        catch
        {
            Delete(path);
            throw;
        }

        _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, path, DateTime.UtcNow);

        return token;
    }

    /// <inheritdoc />
    public Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        cancellationToken.ThrowIfCancellationRequested();

        // Removed on read, so the same URL cannot be fetched twice — a download link that stays live is a
        // download link that can be shared.
        if (!_downloads.TryRemove((sessionId, token), out StoredDownload? stored) || !File.Exists(stored.Path))
            return Task.FromResult<UIStagedDownload?>(null);

        return Task.FromResult<UIStagedDownload?>(new UIStagedDownload
        {
            FileName = stored.FileName,
            ContentType = stored.ContentType,
            Content = new FileStream(stored.Path, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, FileOptions.DeleteOnClose)
        });
    }

    /// <inheritdoc />
    public Task RemoveSessionAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal) && _uploads.TryRemove(entry.Key, out StoredUpload? removed))
                Delete(removed.Path);
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal) && _downloads.TryRemove(entry.Key, out StoredDownload? removed))
                Delete(removed.Path);
        }

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task<int> CleanupAsync(DateTime utcNow, TimeSpan uploadRetention, TimeSpan downloadRetention, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var removed = 0;

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (entry.Value.CreatedAtUtc + uploadRetention <= utcNow && _uploads.TryRemove(entry))
            {
                Delete(entry.Value.Path);
                removed++;
            }
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.CreatedAtUtc + downloadRetention <= utcNow && _downloads.TryRemove(entry))
            {
                Delete(entry.Value.Path);
                removed++;
            }
        }

        return Task.FromResult(removed + SweepOrphans(utcNow, uploadRetention, downloadRetention));
    }

    /// <summary>
    /// Deletes content on disk that no metadata entry claims and that is older than its own retention.
    /// </summary>
    /// <remarks>
    /// Metadata lives in memory, so anything that ends the process other than <see cref="Dispose"/> leaves
    /// every staged file behind with nothing left to name it. Age is the only handle the sweep has on such a
    /// file, and it is the same age at which a claimed one would have gone — so a second process sharing the
    /// root loses nothing it would have kept.
    /// </remarks>
    private int SweepOrphans(DateTime utcNow, TimeSpan uploadRetention, TimeSpan downloadRetention)
    {
        HashSet<string> claimed = new(StringComparer.OrdinalIgnoreCase);

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
            _ = claimed.Add(entry.Value.Path);

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
            _ = claimed.Add(entry.Value.Path);

        var removed = 0;

        try
        {
            foreach (var path in Directory.EnumerateFiles(_root))
            {
                TimeSpan retention = Path.GetExtension(path) switch
                {
                    ".upload" => uploadRetention,
                    ".download" => downloadRetention,
                    _ => TimeSpan.Zero
                };

                if (retention == TimeSpan.Zero || claimed.Contains(path))
                    continue;

                if (File.GetLastWriteTimeUtc(path) + retention > utcNow)
                    continue;

                Delete(path);
                removed++;
            }
        }
        catch (DirectoryNotFoundException)
        {
        }
        catch (IOException)
        {
        }
        catch (UnauthorizedAccessException)
        {
        }

        return removed;
    }

    private static void Delete(string path)
    {
        try
        {
            if (File.Exists(path))
                File.Delete(path);
        }
        catch (IOException)
        {
            // A file still open by a download in flight is deleted by FileOptions.DeleteOnClose instead; a
            // sweep failing to remove it is not worth failing the sweep.
        }
        catch (UnauthorizedAccessException)
        {
        }
    }

    private static string CreateId()
        => Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLower(CultureInfo.InvariantCulture);

    public void Dispose()
    {
        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
            Delete(entry.Value.Path);

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
            Delete(entry.Value.Path);

        _uploads.Clear();
        _downloads.Clear();
    }
}
