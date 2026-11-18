using System;
using System.Buffers;
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
    private const int FileBufferSize = 64 * 1024;
    private const FileOptions AsyncSequentialOptions = FileOptions.Asynchronous | FileOptions.SequentialScan;

    private sealed record StoredUpload(UIUploadFile File, string SelectionId, string Path, DateTime CreatedAtUtc, bool OwnsFile = true);

    private sealed record StoredDownload(string FileName, string ContentType, string? Path, Func<Stream, CancellationToken, ValueTask>? Producer, long? MaxBytes, long Size, long Charged, DateTime CreatedAtUtc);

    /// <summary>One session's uploads by id, and what they are counted as against its allowance (<see cref="UIAllowanceCharge"/>).</summary>
    private sealed class SessionUploads
    {
        public Dictionary<string, StoredUpload> Files { get; } = [with(StringComparer.Ordinal)];

        public long Charged { get; set; }
    }

    // By session, then by id: a file id from another session simply does not resolve, and what one session asks for — its count, a
    // selection, its removal — walks its own uploads, never every session's. One lock: an upload is no hot path, and a session's
    // files and its count move together.
    private readonly Lock _uploadsSync = new();
    private readonly Dictionary<string, SessionUploads> _uploads = [with(StringComparer.Ordinal)];
    private int _uploadCount;
    private long _uploadSize;

    private readonly ConcurrentDictionary<(string SessionId, string Token), StoredDownload> _downloads = new();
    private readonly Lock _downloadsSync = new();
    private readonly UIFileOptions _options;

    private readonly string _root;

    /// <summary>How many active uploads and staged downloads the store tracks, for the host's meter.</summary>
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

        _options = application.Files;
        _root = _options.StorageRoot ?? DefaultRoot();

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
        var size = await CopyToNewFileAsync(content, path, cancellationToken).ConfigureAwait(false);

        UIUploadFile file = new()
        {
            FileId = fileId,
            FileName = fileName,
            ContentType = contentType,
            Size = size
        };

        file.Validate();

        AddUpload(sessionId, fileId, new StoredUpload(file, selectionId, path, DateTime.UtcNow, OwnsFile: true));

        return file;
    }

    /// <inheritdoc />
    public Task<UIUploadFile> RegisterLocalUploadAsync(string sessionId, string selectionId, string localFilePath, string? fileName = null, string? contentType = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(localFilePath);

        cancellationToken.ThrowIfCancellationRequested();

        var fullPath = Path.GetFullPath(localFilePath);
        FileInfo info = new(fullPath);
        if (!info.Exists)
            throw new FileNotFoundException("Local upload file does not exist.", fullPath);

        var resolvedName = string.IsNullOrWhiteSpace(fileName) ? info.Name : fileName;
        var fileId = CreateId();

        UIUploadFile file = new()
        {
            FileId = fileId,
            FileName = resolvedName,
            ContentType = contentType,
            Size = info.Length
        };

        file.Validate();

        AddUpload(sessionId, fileId, new StoredUpload(file, selectionId, fullPath, DateTime.UtcNow, OwnsFile: false));

        return Task.FromResult(file);
    }

    /// <summary>Copies content into a new file, answering its size, for an upload or a download not registered yet.</summary>
    /// <remarks>A failed copy leaves an unregistered file the sweep would never find, so it is deleted here instead.</remarks>
    private static async Task<long> CopyToNewFileAsync(Stream content, string path, CancellationToken cancellationToken)
    {
        try
        {
            FileStream destination = new(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);

            await using (destination.ConfigureAwait(false))
            {
                await content.CopyToAsync(destination, FileBufferSize, cancellationToken).ConfigureAwait(false);

                return destination.Length;
            }
        }
        catch
        {
            Delete(path);
            throw;
        }
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
        session.Charged += upload.OwnsFile ? UIAllowanceCharge.Of(upload.File) : UIAllowanceCharge.Overhead(upload.File.FileName);
        _uploadCount++;

        if (upload.OwnsFile)
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
            FileShare share = stored.OwnsFile ? FileShare.Read : FileShare.ReadWrite;
            return Task.FromResult<Stream?>(new FileStream(stored.Path, FileMode.Open, FileAccess.Read, share, FileBufferSize, AsyncSequentialOptions));
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

        DateTime now = DateTime.UtcNow;
        var overhead = UIAllowanceCharge.Overhead(fileName);
        List<string>? sweptPaths;
        long allowedBytes;

        lock (_downloadsSync)
        {
            sweptPaths = SweepExpiredDownloadsNoLock(now, _options.DownloadRetention);
            allowedBytes = GetRemainingDownloadAllowanceNoLock(sessionId) - overhead;
        }

        DeleteAll(sweptPaths);

        if (allowedBytes < 0)
            throw new InvalidOperationException("Staged download limit exceeded.");

        var token = CreateId();
        var path = Path.Combine(_root, $"{token}.download");
        var size = await CopyToBoundedFileAsync(content, path, allowedBytes, cancellationToken).ConfigureAwait(false);
        var charged = overhead + size;
        var rejected = false;

        lock (_downloadsSync)
        {
            sweptPaths = SweepExpiredDownloadsNoLock(DateTime.UtcNow, _options.DownloadRetention);

            if (ExceedsDownloadLimitsNoLock(sessionId, charged))
                rejected = true;
            else
                _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, path, Producer: null, MaxBytes: null, size, charged, DateTime.UtcNow);
        }

        DeleteAll(sweptPaths);

        if (rejected)
        {
            Delete(path);
            throw new InvalidOperationException("Staged download limit exceeded.");
        }

        return token;
    }

    /// <inheritdoc />
    public Task<string> StageDownloadAsync(string sessionId, string fileName, string contentType, Func<Stream, CancellationToken, ValueTask> writeAsync, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
        ArgumentNullException.ThrowIfNull(writeAsync);

        cancellationToken.ThrowIfCancellationRequested();

        var overhead = UIAllowanceCharge.Overhead(fileName);
        var token = CreateId();
        List<string>? sweptPaths;
        var rejected = false;

        lock (_downloadsSync)
        {
            DateTime now = DateTime.UtcNow;
            sweptPaths = SweepExpiredDownloadsNoLock(now, _options.DownloadRetention);
            var allowedBytes = GetRemainingDownloadAllowanceNoLock(sessionId) - overhead;

            if (allowedBytes < 0)
                rejected = true;
            else
                _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, Path: null, Producer: writeAsync, MaxBytes: allowedBytes, Size: 0, Charged: overhead, now);
        }

        DeleteAll(sweptPaths);

        return rejected
            ? throw new InvalidOperationException("Staged download limit exceeded.")
            : Task.FromResult(token);
    }

    private long GetRemainingDownloadAllowanceNoLock(string sessionId)
    {
        var sessionBytes = SumDownloadCharges(sessionId, out var totalBytes);
        var sessionRemaining = _options.MaxDownloadBytesPerSession - sessionBytes;

        if (_options.MaxDownloadBytesTotal is > 0 and var maxTotal)
            return Math.Min(sessionRemaining, maxTotal - totalBytes);

        return sessionRemaining;
    }

    private bool ExceedsDownloadLimitsNoLock(string sessionId, long addedBytes)
        => GetRemainingDownloadAllowanceNoLock(sessionId) < addedBytes;

    private long SumDownloadCharges(string sessionId, out long totalBytes)
    {
        long sessionBytes = 0;
        totalBytes = 0;

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            totalBytes += entry.Value.Charged;

            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal))
                sessionBytes += entry.Value.Charged;
        }

        return sessionBytes;
    }

    private List<string>? SweepExpiredDownloadsNoLock(DateTime utcNow, TimeSpan downloadRetention)
    {
        List<string>? paths = null;

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.CreatedAtUtc + downloadRetention <= utcNow && _downloads.TryRemove(entry) && entry.Value.Path is { } path)
                (paths ??= []).Add(path);
        }

        return paths;
    }

    private static void DeleteAll(List<string>? paths)
    {
        if (paths is null)
            return;

        for (var i = 0; i < paths.Count; i++)
            Delete(paths[i]);
    }

    private static async Task<long> CopyToBoundedFileAsync(Stream content, string path, long maxBytes, CancellationToken cancellationToken)
    {
        var buffer = ArrayPool<byte>.Shared.Rent(FileBufferSize);
        long total = 0;

        try
        {
            FileStream destination = new(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);

            await using (destination.ConfigureAwait(false))
            {
                int read;

                while ((read = await content.ReadAsync(buffer, cancellationToken).ConfigureAwait(false)) > 0)
                {
                    total += read;

                    if (total > maxBytes)
                        throw new InvalidOperationException("Staged download limit exceeded.");

                    await destination.WriteAsync(buffer.AsMemory(0, read), cancellationToken).ConfigureAwait(false);
                }

                return total;
            }
        }
        catch
        {
            Delete(path);
            throw;
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }

    /// <inheritdoc />
    public Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        cancellationToken.ThrowIfCancellationRequested();

        // Removed on read, so the same URL cannot be fetched twice.
        if (!_downloads.TryRemove((sessionId, token), out StoredDownload? stored))
            return Task.FromResult<UIStagedDownload?>(null);

        if (stored.Producer is not null)
        {
            return Task.FromResult<UIStagedDownload?>(new UIStagedDownload
            {
                FileName = stored.FileName,
                ContentType = stored.ContentType,
                Content = Stream.Null,
                WriteToAsync = stored.Producer,
                MaxBytes = stored.MaxBytes
            });
        }

        // Opened rather than checked first, as an upload is: once its entry is gone the orphan sweep may delete the file meanwhile.
        try
        {
            return Task.FromResult<UIStagedDownload?>(new UIStagedDownload
            {
                FileName = stored.FileName,
                ContentType = stored.ContentType,
                Content = new FileStream(stored.Path!, FileMode.Open, FileAccess.Read, FileShare.Read, FileBufferSize, AsyncSequentialOptions | FileOptions.DeleteOnClose)
            });
        }
        catch (Exception exception) when (exception is FileNotFoundException or DirectoryNotFoundException)
        {
            return Task.FromResult<UIStagedDownload?>(null);
        }
    }

    /// <inheritdoc />
    public async Task<bool> TryDeliverDownloadAsync(string sessionId, string token, string destinationPath, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);
        ArgumentException.ThrowIfNullOrWhiteSpace(destinationPath);

        cancellationToken.ThrowIfCancellationRequested();

        if (!_downloads.TryRemove((sessionId, token), out StoredDownload? stored))
            return false;

        var fullDestination = Path.GetFullPath(destinationPath);
        var directory = Path.GetDirectoryName(fullDestination);
        if (!string.IsNullOrEmpty(directory))
            _ = Directory.CreateDirectory(directory);

        if (stored.Producer is not null)
        {
            try
            {
                FileStream destination = new(fullDestination, FileMode.Create, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);
                await using (destination.ConfigureAwait(false))
                    _ = await UIStagedDownload.WriteBoundedToAsync(stored.Producer, stored.MaxBytes, destination, cancellationToken).ConfigureAwait(false);

                return true;
            }
            catch
            {
                Delete(fullDestination);
                throw;
            }
        }

        if (stored.Path is null)
            return false;

        var fullSource = Path.GetFullPath(stored.Path);
        if (string.Equals(fullSource, fullDestination, StringComparison.OrdinalIgnoreCase))
            return File.Exists(fullSource);

        try
        {
            File.Move(fullSource, fullDestination, overwrite: true);
            return true;
        }
        catch (FileNotFoundException)
        {
            return false;
        }
        catch (DirectoryNotFoundException)
        {
            return false;
        }
        catch (Exception exception) when (exception is IOException or UnauthorizedAccessException && string.Equals(Path.GetPathRoot(fullSource), Path.GetPathRoot(fullDestination), StringComparison.OrdinalIgnoreCase))
        {
            // Same-volume move failed (e.g. destination locked by another process): clean up the consumed staged file without touching destination.
            Delete(fullSource);
            throw;
        }
        catch (IOException)
        {
            // Cross-volume destination: copy once with async sequential handles and delete the staged source.
            var destinationCreated = false;
            try
            {
                FileStream source = new(fullSource, FileMode.Open, FileAccess.Read, FileShare.Read, FileBufferSize, AsyncSequentialOptions);
                await using (source.ConfigureAwait(false))
                {
                    FileStream destination = new(fullDestination, FileMode.Create, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);
                    destinationCreated = true;
                    await using (destination.ConfigureAwait(false))
                        await source.CopyToAsync(destination, FileBufferSize, cancellationToken).ConfigureAwait(false);
                }

                return true;
            }
            catch
            {
                if (destinationCreated)
                    Delete(fullDestination);

                throw;
            }
            finally
            {
                Delete(fullSource);
            }
        }
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
            DeleteOwnedUpload(upload);

        return Task.CompletedTask;
    }

    /// <summary>Takes an upload out of its session's entry and its count; a session left with none is dropped.</summary>
    private void RemoveUploadNoLock(string sessionId, SessionUploads session, string fileId)
    {
        if (!session.Files.Remove(fileId, out StoredUpload? removed))
            return;

        session.Charged -= removed.OwnsFile ? UIAllowanceCharge.Of(removed.File) : UIAllowanceCharge.Overhead(removed.File.FileName);
        _uploadCount--;

        if (removed.OwnsFile)
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
        {
            if (upload.OwnsFile)
                _uploadSize -= upload.File.Size;
        }

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
            DeleteOwnedUpload(upload);

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal) && _downloads.TryRemove(entry.Key, out StoredDownload? removed) && removed.Path is { } path)
                Delete(path);
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
            DeleteOwnedUpload(upload);

        var removed = expired.Count;

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.CreatedAtUtc + downloadRetention <= utcNow && _downloads.TryRemove(entry))
            {
                if (entry.Value.Path is { } path)
                    Delete(path);

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
        HashSet<string> claimed = [with(StringComparer.OrdinalIgnoreCase)];

        lock (_uploadsSync)
        {
            foreach (SessionUploads session in _uploads.Values)
            {
                foreach (StoredUpload upload in session.Files.Values)
                {
                    if (upload.OwnsFile)
                        _ = claimed.Add(upload.Path);
                }
            }
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.Path is { } path)
                _ = claimed.Add(path);
        }

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

    private static void DeleteOwnedUpload(StoredUpload upload)
    {
        if (upload.OwnsFile)
            Delete(upload.Path);
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
                    DeleteOwnedUpload(upload);
            }

            _uploads.Clear();
            _uploadCount = 0;
            _uploadSize = 0;
        }

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.Path is { } path)
                Delete(path);
        }

        _downloads.Clear();
    }
}
