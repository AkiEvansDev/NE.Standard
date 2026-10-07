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

    /// <summary>One session's uploads by id, and what they are counted as against its allowance (<see cref="UIAllowanceCharge"/>).</summary>
    private sealed class SessionUploads
    {
        public Dictionary<string, StoredUpload> Files { get; } = new(StringComparer.Ordinal);

        public long Charged { get; set; }
    }

    // By session, then by id: a file id from another session simply does not resolve, and what one session asks for — its count, a
    // selection, its removal — walks its own uploads, never every session's. One lock: an upload is no hot path, and a session's
    // files and its count move together.
    private readonly Lock _uploadsSync = new();
    private readonly Dictionary<string, SessionUploads> _uploads = new(StringComparer.Ordinal);
    private int _uploadCount;
    private long _uploadSize;

    private readonly ConcurrentDictionary<(string SessionId, string Token), StoredDownload> _downloads = new();

    private readonly string _root;

    /// <summary>How many files the store keeps on disk, uploads and staged downloads together, for the host's meter.</summary>
    public int Count => Volatile.Read(ref _uploadCount) + _downloads.Count;

    /// <summary>How many bytes the files the store keeps take on disk, for the host's meter.</summary>
    public long Size
    {
        get
        {
            var size = Interlocked.Read(ref _uploadSize);

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

    /// <summary>Registers an upload and counts it to its session.</summary>
    private void AddUpload(string sessionId, string fileId, StoredUpload upload)
    {
        lock (_uploadsSync)
            AddUploadNoLock(sessionId, fileId, upload);
    }

    private void AddUploadNoLock(string sessionId, string fileId, StoredUpload upload)
    {
        if (!_uploads.TryGetValue(sessionId, out SessionUploads? session))
        {
            session = new SessionUploads();
            _uploads.Add(sessionId, session);
        }

        session.Files.Add(fileId, upload);
        session.Charged += UIAllowanceCharge.Of(upload.File);
        _uploadCount++;
        _uploadSize += upload.File.Size;
    }

    /// <inheritdoc />
    /// <remarks>Each file counted as the upload endpoint charges it: its bytes, a fixed entry and its name (<see cref="UIAllowanceCharge"/>).</remarks>
    public Task<long> GetUploadedBytesAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        cancellationToken.ThrowIfCancellationRequested();

        lock (_uploadsSync)
            return Task.FromResult(_uploads.TryGetValue(sessionId, out SessionUploads? session) ? session.Charged : 0);
    }

    /// <inheritdoc />
    public Task<IReadOnlyList<UIUploadFile>> GetSelectionAsync(string sessionId, string selectionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);

        cancellationToken.ThrowIfCancellationRequested();

        List<UIUploadFile> files = [];

        lock (_uploadsSync)
        {
            if (_uploads.TryGetValue(sessionId, out SessionUploads? session))
            {
                foreach (StoredUpload upload in session.Files.Values)
                {
                    if (string.Equals(upload.SelectionId, selectionId, StringComparison.Ordinal))
                        files.Add(upload.File);
                }
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

        return Task.FromResult(TryGetUpload(sessionId, fileId, out StoredUpload? stored) ? stored.File : null);
    }

    private bool TryGetUpload(string sessionId, string fileId, [NotNullWhen(true)] out StoredUpload? stored)
    {
        lock (_uploadsSync)
        {
            stored = null;

            return _uploads.TryGetValue(sessionId, out SessionUploads? session) && session.Files.TryGetValue(fileId, out stored);
        }
    }

    /// <inheritdoc />
    public Task<Stream?> OpenUploadAsync(string sessionId, string fileId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileId);

        cancellationToken.ThrowIfCancellationRequested();

        if (!TryGetUpload(sessionId, fileId, out StoredUpload? stored))
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

        List<StoredUpload> removed = [];

        lock (_uploadsSync)
        {
            if (_uploads.TryGetValue(sessionId, out SessionUploads? session))
            {
                foreach (KeyValuePair<string, StoredUpload> entry in session.Files)
                {
                    if (string.Equals(entry.Value.SelectionId, selectionId, StringComparison.Ordinal))
                        removed.Add(entry.Value);
                }

                foreach (StoredUpload upload in removed)
                    RemoveUploadNoLock(sessionId, session, upload.File.FileId);
            }
        }

        // Deleted outside the lock: a disk write never holds back another session's count.
        foreach (StoredUpload upload in removed)
            Delete(upload.Path);

        return Task.CompletedTask;
    }

    /// <summary>Takes an upload out of its session's entry and its count; a session left with none is dropped.</summary>
    private void RemoveUploadNoLock(string sessionId, SessionUploads session, string fileId)
    {
        if (!session.Files.Remove(fileId, out StoredUpload? removed))
            return;

        session.Charged -= UIAllowanceCharge.Of(removed.File);
        _uploadCount--;
        _uploadSize -= removed.File.Size;

        if (session.Files.Count == 0)
            _ = _uploads.Remove(sessionId);
    }

    /// <summary>Takes a session's whole entry out, uncounted, and answers its uploads.</summary>
    private List<StoredUpload> RemoveSessionUploadsNoLock(string sessionId)
    {
        if (!_uploads.Remove(sessionId, out SessionUploads? session))
            return [];

        _uploadCount -= session.Files.Count;

        List<StoredUpload> removed = [.. session.Files.Values];

        foreach (StoredUpload upload in removed)
            _uploadSize -= upload.File.Size;

        return removed;
    }

    /// <inheritdoc />
    public Task RemoveSessionAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        cancellationToken.ThrowIfCancellationRequested();

        List<StoredUpload> uploads;

        lock (_uploadsSync)
            uploads = RemoveSessionUploadsNoLock(sessionId);

        foreach (StoredUpload upload in uploads)
            Delete(upload.Path);

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

        lock (_uploadsSync)
        {
            foreach (StoredUpload moved in RemoveSessionUploadsNoLock(fromSessionId))
                AddUploadNoLock(toSessionId, moved.File.FileId, moved);
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

        List<(string SessionId, StoredUpload Upload)> expired = [];

        lock (_uploadsSync)
        {
            foreach (KeyValuePair<string, SessionUploads> session in _uploads)
            {
                foreach (StoredUpload upload in session.Value.Files.Values)
                {
                    if (upload.CreatedAtUtc + uploadRetention <= utcNow)
                        expired.Add((session.Key, upload));
                }
            }

            foreach ((var sessionId, StoredUpload upload) in expired)
                RemoveUploadNoLock(sessionId, _uploads[sessionId], upload.File.FileId);
        }

        foreach ((_, StoredUpload upload) in expired)
            Delete(upload.Path);

        var removed = expired.Count;

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

        lock (_uploadsSync)
        {
            foreach (SessionUploads session in _uploads.Values)
            {
                foreach (StoredUpload upload in session.Files.Values)
                    _ = claimed.Add(upload.Path);
            }
        }

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
        lock (_uploadsSync)
        {
            foreach (SessionUploads session in _uploads.Values)
            {
                foreach (StoredUpload upload in session.Files.Values)
                    Delete(upload.Path);
            }

            _uploads.Clear();
            _uploadCount = 0;
            _uploadSize = 0;
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
            Delete(entry.Value.Path);

        _downloads.Clear();
    }
}
