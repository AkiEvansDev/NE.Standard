using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
internal sealed class FileSystemUIFileStore : IUIFileStore, IDisposable
{
    private sealed record StoredUpload(UIUploadFile File, string SelectionId, string Path, DateTime CreatedAtUtc);

    private sealed record StoredDownload(string FileName, string ContentType, string Path, long Size, DateTime CreatedAtUtc);

    // Keyed by (session, id) so a file id from another session simply does not resolve.
    private readonly ConcurrentDictionary<(string SessionId, string FileId), StoredUpload> _uploads = new();
    private readonly ConcurrentDictionary<(string SessionId, string Token), StoredDownload> _downloads = new();

    // Each session's upload bytes, kept beside the uploads: the upload endpoint asks on every request, and walking every
    // session's files for it would cost more the more the store holds.
    private readonly ConcurrentDictionary<string, long> _sessionBytes = new(StringComparer.Ordinal);

    private readonly string _root;

    /// <summary>How many files the store keeps on disk, uploads and staged downloads together, for the host's meter.</summary>
    public int Count => _uploads.Count + _downloads.Count;

    /// <summary>How many bytes the files the store keeps take on disk, for the host's meter.</summary>
    public long Size
    {
        get
        {
            long size = 0;

            foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> pair in _uploads)
                size += pair.Value.File.Size;

            foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> pair in _downloads)
                size += pair.Value.Size;

            return size;
        }
    }

    public FileSystemUIFileStore(UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _root = application.Files.StorageRoot ?? DefaultRoot();

        _ = Directory.CreateDirectory(_root);
    }

    /// <summary>
    /// The application's own folder under the temp folder: the orphan sweep deletes what no entry of this store claims, so a
    /// folder two applications shared would lose each one's files to the other's sweep.
    /// </summary>
    internal static string DefaultRoot()
        => UIApplicationStorage.TempDirectory("ne.standard.ui.files");

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

        // A failed copy leaves an unregistered file the sweep would never find, so it is deleted here instead.
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

        AddUpload(sessionId, fileId, new StoredUpload(file, selectionId, path, DateTime.UtcNow));

        return file;
    }

    /// <summary>Registers an upload and counts its bytes to its session.</summary>
    private void AddUpload(string sessionId, string fileId, StoredUpload upload)
    {
        _uploads[(sessionId, fileId)] = upload;
        _ = _sessionBytes.AddOrUpdate(sessionId, upload.File.Size, (_, bytes) => bytes + upload.File.Size);
    }

    /// <inheritdoc />
    public Task<long> GetUploadedBytesAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(_sessionBytes.GetValueOrDefault(sessionId));
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

        if (!_uploads.TryGetValue((sessionId, fileId), out StoredUpload? stored))
            return Task.FromResult<Stream?>(null);

        // Opened rather than checked first: the cleanup pass may delete the file between an exists check and the open.
        try
        {
            return Task.FromResult<Stream?>(new FileStream(stored.Path, FileMode.Open, FileAccess.Read, FileShare.Read));
        }
        catch (Exception exception) when (exception is FileNotFoundException or DirectoryNotFoundException)
        {
            return Task.FromResult<Stream?>(null);
        }
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

        long size;

        // Same as the upload path: until the token is registered, the file is known to nothing.
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

        _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, path, size, DateTime.UtcNow);

        return token;
    }

    /// <inheritdoc />
    public Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        cancellationToken.ThrowIfCancellationRequested();

        // Removed on read, so the same URL cannot be fetched twice.
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
    public Task RemoveSelectionAsync(string sessionId, string selectionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);

        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal)
                && string.Equals(entry.Value.SelectionId, selectionId, StringComparison.Ordinal)
                && TryRemoveUpload(entry.Key, out StoredUpload? removed))
            {
                Delete(removed.Path);
            }
        }

        return Task.CompletedTask;
    }

    private bool TryRemoveUpload((string SessionId, string FileId) key, [NotNullWhen(true)] out StoredUpload? removed)
    {
        if (!_uploads.TryRemove(key, out removed))
            return false;

        Uncount(key.SessionId, removed.File.Size);
        return true;
    }

    /// <summary>Removes the upload only while it is still the one given, so one the sweep read stays if it was replaced since.</summary>
    private bool TryRemoveUpload(KeyValuePair<(string SessionId, string FileId), StoredUpload> entry)
    {
        if (!_uploads.TryRemove(entry))
            return false;

        Uncount(entry.Key.SessionId, entry.Value.File.Size);
        return true;
    }

    private void Uncount(string sessionId, long size)
    {
        var bytes = _sessionBytes.AddOrUpdate(sessionId, 0, (_, current) => current - size);

        // Dropped only while still empty, so an upload counted meanwhile keeps its session's entry.
        if (bytes <= 0)
            _ = _sessionBytes.TryRemove(new KeyValuePair<string, long>(sessionId, bytes));
    }

    /// <inheritdoc />
    public Task RemoveSessionAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal) && TryRemoveUpload(entry.Key, out StoredUpload? removed))
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
    public Task MoveSessionAsync(string fromSessionId, string toSessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(fromSessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(toSessionId);

        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<(string SessionId, string FileId), StoredUpload> entry in _uploads)
        {
            if (string.Equals(entry.Key.SessionId, fromSessionId, StringComparison.Ordinal) && TryRemoveUpload(entry.Key, out StoredUpload? moved))
                AddUpload(toSessionId, entry.Key.FileId, moved);
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (string.Equals(entry.Key.SessionId, fromSessionId, StringComparison.Ordinal) && _downloads.TryRemove(entry.Key, out StoredDownload? moved))
                _downloads[(toSessionId, entry.Key.Token)] = moved;
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
            if (entry.Value.CreatedAtUtc + uploadRetention <= utcNow && TryRemoveUpload(entry))
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
            // A file still open by a download in flight is deleted by FileOptions.DeleteOnClose instead.
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
        _sessionBytes.Clear();
    }
}
