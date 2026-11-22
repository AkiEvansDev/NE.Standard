using System;
using System.Buffers;
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
    private const FileShare LocalUploadFileShare = FileShare.ReadWrite | FileShare.Delete;

    // By session, then by id: a file id from another session simply does not resolve, and what one session asks for — its count, a
    // selection, its removal — walks its own uploads, never every session's. One lock: an upload is no hot path, and a session's
    // files and its count move together.
    private readonly Lock _uploadsSync = new();
    private readonly Dictionary<string, SessionUploads> _uploads = [with(StringComparer.Ordinal)];
    private int _uploadCount;
    private long _uploadSize;
    private long _totalUploadCharged;

    private readonly Lock _downloadsSync = new();
    private readonly Dictionary<(string SessionId, string Token), StoredDownload> _downloads = [];
    private readonly Dictionary<string, long> _sessionDownloadBytes = [with(StringComparer.Ordinal)];
    private readonly HashSet<DownloadLease> _activeLeases = [];
    private int _downloadCount;
    private long _downloadSize;
    private long _totalDownloadBytes;

    private readonly UIFileOptions _options;
    private readonly string _root;

    /// <summary>How many active uploads and staged downloads the store tracks, for the host's meter.</summary>
    public int Count => Volatile.Read(ref _uploadCount) + Volatile.Read(ref _downloadCount);

    /// <summary>How many bytes the files the store keeps take on disk, for the host's meter.</summary>
    public long Size => Interlocked.Read(ref _uploadSize) + Interlocked.Read(ref _downloadSize);

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

        var charge = upload.OwnsFile ? UIAllowanceCharge.Of(upload.File) : UIAllowanceCharge.Overhead(upload.File.FileName);
        session.Files.Add(fileId, upload);
        session.Charged += charge;
        _totalUploadCharged += charge;
        _uploadCount++;

        if (upload.OwnsFile)
            _uploadSize += upload.File.Size;
    }

    /// <inheritdoc />
    public Task<UIUploadFile> RegisterLocalUploadAsync(string sessionId, string selectionId, string localFilePath, string? fileName = null, string? contentType = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(selectionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(localFilePath);

        cancellationToken.ThrowIfCancellationRequested();

        var fullPath = Path.GetFullPath(localFilePath);
        long size;

        using (FileStream probe = new(fullPath, FileMode.Open, FileAccess.Read, LocalUploadFileShare, FileBufferSize, FileOptions.SequentialScan))
            size = probe.Length;

        var resolvedName = string.IsNullOrWhiteSpace(fileName) ? Path.GetFileName(fullPath) : fileName;
        var fileId = CreateId();

        UIUploadFile file = new()
        {
            FileId = fileId,
            FileName = resolvedName,
            ContentType = contentType,
            Size = size
        };

        file.Validate();

        AddUpload(sessionId, fileId, new StoredUpload(file, selectionId, fullPath, DateTime.UtcNow, OwnsFile: false));

        return Task.FromResult(file);
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
    public ValueTask<long?> GetTotalUploadedBytesAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_uploadsSync)
            return ValueTask.FromResult<long?>(_totalUploadCharged);
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

        // Opened rather than checked first: the cleanup pass or user disk activity may remove or lock the file meanwhile.
        try
        {
            FileShare share = stored.OwnsFile ? FileShare.Read : LocalUploadFileShare;

            if (!stored.OwnsFile && _options.MaxFileSize > 0)
                return Task.FromResult<Stream?>(new CappedReadStream(stored.Path, share, _options.MaxFileSize));

            return Task.FromResult<Stream?>(new FileStream(stored.Path, FileMode.Open, FileAccess.Read, share, FileBufferSize, AsyncSequentialOptions));
        }
        catch (Exception exception) when (exception is IOException or UnauthorizedAccessException)
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
            (_, sweptPaths) = SweepExpiredDownloadsNoLock(now, _options.DownloadRetention);
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
            (_, sweptPaths) = SweepExpiredDownloadsNoLock(DateTime.UtcNow, _options.DownloadRetention);

            if (!TryReserveDownloadBytesNoLock(sessionId, charged))
            {
                rejected = true;
            }
            else
            {
                _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, path, Producer: null, Lease: null, size, charged, DateTime.UtcNow);
                _downloadCount++;
                _downloadSize += size;
            }
        }

        DeleteAll(sweptPaths);

        if (rejected)
        {
            Delete(path);
            throw new InvalidOperationException("Staged download limit exceeded.");
        }

        return token;
    }

    private (int RemovedCount, List<string>? Paths) SweepExpiredDownloadsNoLock(DateTime utcNow, TimeSpan downloadRetention)
    {
        List<(string SessionId, string Token)>? expiredKeys = null;
        List<string>? paths = null;

        foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
        {
            if (entry.Value.CreatedAtUtc + downloadRetention <= utcNow)
                (expiredKeys ??= []).Add(entry.Key);
        }

        if (expiredKeys is null)
            return (0, null);

        for (var i = 0; i < expiredKeys.Count; i++)
        {
            (var sessionId, var token) = expiredKeys[i];
            if (!_downloads.Remove((sessionId, token), out StoredDownload? removed))
                continue;

            _downloadCount--;
            _downloadSize -= removed.Size;

            if (removed.Lease is not null)
                ReleaseLeaseNoLock(removed.Lease);
            else
                ReleaseDownloadBytesNoLock(sessionId, removed.Charged);

            if (removed.Path is { } path)
                (paths ??= []).Add(path);
        }

        return (expiredKeys.Count, paths);
    }

    private void ReleaseLeaseNoLock(DownloadLease lease)
    {
        if (lease.Released)
            return;

        lease.Released = true;
        _ = _activeLeases.Remove(lease);
        ReleaseDownloadBytesNoLock(lease.SessionId, lease.ReservedBytes);
        lease.ReservedBytes = 0;
    }

    private void ReleaseDownloadBytesNoLock(string sessionId, long bytes)
    {
        if (bytes <= 0)
            return;

        _totalDownloadBytes = Math.Max(0, _totalDownloadBytes - bytes);

        if (!_sessionDownloadBytes.TryGetValue(sessionId, out var current))
            return;

        var updated = current - bytes;
        if (updated <= 0)
            _ = _sessionDownloadBytes.Remove(sessionId);
        else
            _sessionDownloadBytes[sessionId] = updated;
    }

    private long GetRemainingDownloadAllowanceNoLock(string sessionId)
    {
        var sessionBytes = _sessionDownloadBytes.TryGetValue(sessionId, out var held) ? held : 0;
        var sessionRemaining = _options.MaxDownloadBytesPerSession - sessionBytes;

        if (_options.MaxDownloadBytesTotal is > 0 and var maxTotal)
            return Math.Min(sessionRemaining, maxTotal - _totalDownloadBytes);

        return sessionRemaining;
    }

    private bool TryReserveDownloadBytesNoLock(string sessionId, long addedBytes)
    {
        if (addedBytes < 0 || GetRemainingDownloadAllowanceNoLock(sessionId) < addedBytes)
            return false;

        if (addedBytes == 0)
            return true;

        _sessionDownloadBytes[sessionId] = (_sessionDownloadBytes.TryGetValue(sessionId, out var current) ? current : 0) + addedBytes;
        _totalDownloadBytes += addedBytes;
        return true;
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
            (_, sweptPaths) = SweepExpiredDownloadsNoLock(now, _options.DownloadRetention);

            if (!TryReserveDownloadBytesNoLock(sessionId, overhead))
            {
                rejected = true;
            }
            else
            {
                DownloadLease lease = new(this, sessionId, overhead);
                _ = _activeLeases.Add(lease);
                _downloads[(sessionId, token)] = new StoredDownload(fileName, contentType, Path: null, Producer: writeAsync, Lease: lease, Size: 0, Charged: overhead, now);
                _downloadCount++;
            }
        }

        DeleteAll(sweptPaths);

        return rejected
            ? throw new InvalidOperationException("Staged download limit exceeded.")
            : Task.FromResult(token);
    }

    /// <inheritdoc />
    public Task<UIStagedDownload?> TakeDownloadAsync(string sessionId, string token, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);

        cancellationToken.ThrowIfCancellationRequested();

        StoredDownload? stored;

        // Removed on read, so the same URL cannot be fetched twice.
        lock (_downloadsSync)
        {
            if (!_downloads.Remove((sessionId, token), out stored))
                return Task.FromResult<UIStagedDownload?>(null);

            _downloadCount--;

            if (stored.Producer is null)
            {
                _downloadSize -= stored.Size;
                ReleaseDownloadBytesNoLock(sessionId, stored.Charged);
            }
        }

        if (stored.Producer is not null)
        {
            DownloadLease lease = stored.Lease!;

            return Task.FromResult<UIStagedDownload?>(new UIStagedDownload
            {
                FileName = stored.FileName,
                ContentType = stored.ContentType,
                Content = new LeaseReleaseStream(lease),
                WriteToAsync = (destination, ct) => RunLeasedProducerAsync(stored.Producer, lease, destination, ct),
                MaxBytes = null
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

    private static async ValueTask RunLeasedProducerAsync(Func<Stream, CancellationToken, ValueTask> producer, DownloadLease lease, Stream destination, CancellationToken cancellationToken)
    {
        try
        {
            using LeaseWriteStream bounded = new(destination, lease);
            await producer(bounded, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            lease.Release();
        }
    }

    /// <inheritdoc />
    public async Task<bool> TryDeliverDownloadAsync(string sessionId, string token, string destinationPath, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(token);
        ArgumentException.ThrowIfNullOrWhiteSpace(destinationPath);

        cancellationToken.ThrowIfCancellationRequested();

        StoredDownload? stored;

        lock (_downloadsSync)
        {
            if (!_downloads.Remove((sessionId, token), out stored))
                return false;

            _downloadCount--;

            if (stored.Producer is null)
            {
                _downloadSize -= stored.Size;
                ReleaseDownloadBytesNoLock(sessionId, stored.Charged);
            }
        }

        var fullDestination = Path.GetFullPath(destinationPath);
        var directory = Path.GetDirectoryName(fullDestination);
        if (!string.IsNullOrEmpty(directory))
            _ = Directory.CreateDirectory(directory);

        if (stored.Producer is not null)
        {
            await WriteProducerAtomicallyAsync(stored.Producer, stored.Lease!, fullDestination, cancellationToken).ConfigureAwait(false);
            return true;
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
        catch (UnauthorizedAccessException)
        {
            Delete(fullSource);
            throw;
        }
        catch (IOException exception) when (!IsCrossVolumeMove(exception, fullDestination))
        {
            // Same-volume move failed (e.g. destination locked by another process or is a directory): clean up staged source without touching destination.
            Delete(fullSource);
            throw;
        }
        catch (IOException)
        {
            return await CopyCrossVolumeAtomicallyAsync(fullSource, fullDestination, cancellationToken).ConfigureAwait(false);
        }
    }

    private static async Task WriteProducerAtomicallyAsync(Func<Stream, CancellationToken, ValueTask> producer, DownloadLease lease, string fullDestination, CancellationToken cancellationToken)
    {
        var tempPath = CreateSiblingTempPath(fullDestination);

        try
        {
            FileStream destination = new(tempPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);
            await using (destination.ConfigureAwait(false))
            {
                using LeaseWriteStream bounded = new(destination, lease);
                await producer(bounded, cancellationToken).ConfigureAwait(false);
            }

            File.Move(tempPath, fullDestination, overwrite: true);
        }
        catch
        {
            Delete(tempPath);
            throw;
        }
        finally
        {
            lease.Release();
        }
    }

    private static string CreateSiblingTempPath(string fullDestination)
    {
        var directory = Path.GetDirectoryName(fullDestination);
        var targetDir = string.IsNullOrEmpty(directory) ? "." : directory;
        return Path.Combine(targetDir, $".{Path.GetFileName(fullDestination)}.{Guid.NewGuid():N}.tmp");
    }

    private static bool IsCrossVolumeMove(IOException exception, string destinationPath)
        => OperatingSystem.IsWindows()
            ? (exception.HResult & 0xFFFF) == 0x11
            : !Directory.Exists(destinationPath);

    private static async Task<bool> CopyCrossVolumeAtomicallyAsync(string fullSource, string fullDestination, CancellationToken cancellationToken)
    {
        var tempPath = CreateSiblingTempPath(fullDestination);

        try
        {
            FileStream source = new(fullSource, FileMode.Open, FileAccess.Read, FileShare.Read, FileBufferSize, AsyncSequentialOptions);
            await using (source.ConfigureAwait(false))
            {
                FileStream destination = new(tempPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, FileBufferSize, AsyncSequentialOptions);
                await using (destination.ConfigureAwait(false))
                    await source.CopyToAsync(destination, FileBufferSize, cancellationToken).ConfigureAwait(false);
            }

            File.Move(tempPath, fullDestination, overwrite: true);
            return true;
        }
        catch
        {
            Delete(tempPath);
            throw;
        }
        finally
        {
            Delete(fullSource);
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

        var charge = removed.OwnsFile ? UIAllowanceCharge.Of(removed.File) : UIAllowanceCharge.Overhead(removed.File.FileName);
        session.Charged -= charge;
        _totalUploadCharged -= charge;
        _uploadCount--;

        if (removed.OwnsFile)
            _uploadSize -= removed.File.Size;

        if (session.Files.Count == 0)
            _ = _uploads.Remove(sessionId);
    }

    private static void DeleteOwnedUpload(StoredUpload upload)
    {
        if (upload.OwnsFile)
            Delete(upload.Path);
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

        List<string>? downloadPaths = null;

        lock (_downloadsSync)
        {
            List<(string SessionId, string Token)>? sessionKeys = null;

            foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
            {
                if (string.Equals(entry.Key.SessionId, sessionId, StringComparison.Ordinal))
                    (sessionKeys ??= []).Add(entry.Key);
            }

            if (sessionKeys is not null)
            {
                for (var i = 0; i < sessionKeys.Count; i++)
                {
                    if (!_downloads.Remove(sessionKeys[i], out StoredDownload? removed))
                        continue;

                    _downloadCount--;
                    _downloadSize -= removed.Size;

                    if (removed.Lease is not null)
                        ReleaseLeaseNoLock(removed.Lease);
                    else
                        ReleaseDownloadBytesNoLock(sessionId, removed.Charged);

                    if (removed.Path is { } path)
                        (downloadPaths ??= []).Add(path);
                }
            }
        }

        DeleteAll(downloadPaths);

        return Task.CompletedTask;
    }

    /// <summary>Takes a session's whole entry out, uncounted, and answers its uploads.</summary>
    private List<StoredUpload> RemoveSessionUploadsNoLock(string sessionId)
    {
        if (!_uploads.Remove(sessionId, out SessionUploads? session))
            return [];

        _uploadCount -= session.Files.Count;
        _totalUploadCharged -= session.Charged;

        List<StoredUpload> removed = [.. session.Files.Values];

        foreach (StoredUpload upload in removed)
        {
            if (upload.OwnsFile)
                _uploadSize -= upload.File.Size;
        }

        return removed;
    }

    /// <inheritdoc />
    public Task MoveSessionAsync(string fromSessionId, string toSessionId, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(fromSessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(toSessionId);

        cancellationToken.ThrowIfCancellationRequested();

        if (string.Equals(fromSessionId, toSessionId, StringComparison.Ordinal))
            return Task.CompletedTask;

        lock (_uploadsSync)
        {
            foreach (StoredUpload moved in RemoveSessionUploadsNoLock(fromSessionId))
                AddUploadNoLock(toSessionId, moved.File.FileId, moved);
        }

        lock (_downloadsSync)
        {
            List<KeyValuePair<(string SessionId, string Token), StoredDownload>>? moving = null;

            foreach (KeyValuePair<(string SessionId, string Token), StoredDownload> entry in _downloads)
            {
                if (string.Equals(entry.Key.SessionId, fromSessionId, StringComparison.Ordinal))
                    (moving ??= []).Add(entry);
            }

            if (moving is not null)
            {
                for (var i = 0; i < moving.Count; i++)
                {
                    KeyValuePair<(string SessionId, string Token), StoredDownload> entry = moving[i];
                    _ = _downloads.Remove(entry.Key);
                    _downloads[(toSessionId, entry.Key.Token)] = entry.Value;
                }
            }

            foreach (DownloadLease lease in _activeLeases)
            {
                if (string.Equals(lease.SessionId, fromSessionId, StringComparison.Ordinal))
                    lease.SessionId = toSessionId;
            }

            if (_sessionDownloadBytes.Remove(fromSessionId, out var fromBytes))
                _sessionDownloadBytes[toSessionId] = (_sessionDownloadBytes.TryGetValue(toSessionId, out var toBytes) ? toBytes : 0) + fromBytes;
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

        int removedDownloads;
        List<string>? sweptPaths;

        lock (_downloadsSync)
            (removedDownloads, sweptPaths) = SweepExpiredDownloadsNoLock(utcNow, downloadRetention);

        DeleteAll(sweptPaths);

        var removed = expired.Count + removedDownloads;

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

        lock (_downloadsSync)
        {
            foreach (StoredDownload download in _downloads.Values)
            {
                if (download.Path is { } path)
                    _ = claimed.Add(path);
            }
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
            _totalUploadCharged = 0;
        }

        List<string>? downloadPaths = null;

        lock (_downloadsSync)
        {
            foreach (StoredDownload download in _downloads.Values)
            {
                if (download.Path is { } path)
                    (downloadPaths ??= []).Add(path);
            }

            foreach (DownloadLease lease in _activeLeases)
            {
                lease.Released = true;
                lease.ReservedBytes = 0;
            }

            _downloads.Clear();
            _sessionDownloadBytes.Clear();
            _activeLeases.Clear();
            _downloadCount = 0;
            _downloadSize = 0;
            _totalDownloadBytes = 0;
        }

        DeleteAll(downloadPaths);
    }

    private sealed record StoredUpload(UIUploadFile File, string SelectionId, string Path, DateTime CreatedAtUtc, bool OwnsFile = true);

    private sealed record StoredDownload(string FileName, string ContentType, string? Path, Func<Stream, CancellationToken, ValueTask>? Producer, DownloadLease? Lease, long Size, long Charged, DateTime CreatedAtUtc);

    /// <summary>One session's uploads by id, and what they are counted as against its allowance (<see cref="UIAllowanceCharge"/>).</summary>
    private sealed class SessionUploads
    {
        public Dictionary<string, StoredUpload> Files { get; } = [with(StringComparer.Ordinal)];

        public long Charged { get; set; }
    }

    private sealed class DownloadLease(FileSystemUIFileStore owner, string sessionId, long initialBytes)
    {
        public string SessionId { get; set; } = sessionId;

        public long ReservedBytes { get; set; } = initialBytes;

        public bool Released { get; set; }

        public void ReserveChunk(int count)
        {
            if (count <= 0)
                return;

            lock (owner._downloadsSync)
            {
                if (Released)
                    throw new InvalidOperationException("Staged download lease has already ended.");

                if (!owner.TryReserveDownloadBytesNoLock(SessionId, count))
                    throw new InvalidOperationException("Staged download limit exceeded.");

                ReservedBytes += count;
            }
        }

        public void Release()
        {
            lock (owner._downloadsSync)
                owner.ReleaseLeaseNoLock(this);
        }
    }

    private sealed class LeaseWriteStream(Stream inner, DownloadLease lease) : Stream
    {
        private long _written;

        public override bool CanRead => false;
        public override bool CanSeek => false;
        public override bool CanWrite => true;
        public override long Length => _written;
        public override long Position
        {
            get => _written;
            set => throw new NotSupportedException();
        }

        public override void Flush()
            => inner.Flush();

        public override Task FlushAsync(CancellationToken cancellationToken)
            => inner.FlushAsync(cancellationToken);

        public override int Read(byte[] buffer, int offset, int count)
            => throw new NotSupportedException();

        public override long Seek(long offset, SeekOrigin origin)
            => throw new NotSupportedException();

        public override void SetLength(long value)
            => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count)
            => Write(buffer.AsSpan(offset, count));

        public override void Write(ReadOnlySpan<byte> buffer)
        {
            lease.ReserveChunk(buffer.Length);
            _written += buffer.Length;
            inner.Write(buffer);
        }

        public override ValueTask WriteAsync(ReadOnlyMemory<byte> buffer, CancellationToken cancellationToken = default)
        {
            lease.ReserveChunk(buffer.Length);
            _written += buffer.Length;
            return inner.WriteAsync(buffer, cancellationToken);
        }

        public override Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            => WriteAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();
    }

    private sealed class LeaseReleaseStream(DownloadLease lease) : Stream
    {
        public override bool CanRead => true;
        public override bool CanSeek => true;
        public override bool CanWrite => false;
        public override long Length => 0;
        public override long Position
        {
            get => 0;
            set => ArgumentOutOfRangeException.ThrowIfNotEqual(value, 0L);
        }

        public override void Flush()
        {
        }

        public override int Read(byte[] buffer, int offset, int count)
            => 0;

        public override ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
            => ValueTask.FromResult(0);

        public override long Seek(long offset, SeekOrigin origin)
        {
            ArgumentOutOfRangeException.ThrowIfNotEqual(offset, 0L);
            return 0;
        }

        public override void SetLength(long value)
            => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count)
            => throw new NotSupportedException();

        protected override void Dispose(bool disposing)
        {
            lease.Release();
            base.Dispose(disposing);
        }

        public override ValueTask DisposeAsync()
        {
            lease.Release();
            return base.DisposeAsync();
        }
    }

    private sealed class CappedReadStream(string path, FileShare share, long maxBytes) : Stream
    {
        private readonly FileStream _inner = new(path, FileMode.Open, FileAccess.Read, share, FileBufferSize, AsyncSequentialOptions);
        private long _read;

        public override bool CanRead => _inner.CanRead;
        public override bool CanSeek => _inner.CanSeek;
        public override bool CanWrite => false;
        public override long Length => _inner.CanSeek ? Math.Min(_inner.Length, maxBytes) : throw new NotSupportedException();

        public override long Position
        {
            get => _inner.CanSeek ? Math.Min(_inner.Position, maxBytes) : _read;
            set
            {
                ArgumentOutOfRangeException.ThrowIfNegative(value);
                _inner.Position = Math.Min(value, maxBytes);
                _read = _inner.Position;
            }
        }

        public override void Flush()
        {
        }

        public override int Read(byte[] buffer, int offset, int count)
            => Read(buffer.AsSpan(offset, count));

        public override int Read(Span<byte> buffer)
        {
            var remaining = RemainingBytes();
            if (remaining <= 0 || buffer.IsEmpty)
                return 0;

            var slice = (int)Math.Min(buffer.Length, remaining);
            var read = _inner.Read(buffer[..slice]);
            _read += read;
            return read;
        }

        public override async ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
        {
            var remaining = RemainingBytes();
            if (remaining <= 0 || buffer.IsEmpty)
                return 0;

            var slice = (int)Math.Min(buffer.Length, remaining);
            var read = await _inner.ReadAsync(buffer[..slice], cancellationToken).ConfigureAwait(false);
            _read += read;
            return read;
        }

        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            => ReadAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();

        private long RemainingBytes()
            => Math.Max(0, maxBytes - (_inner.CanSeek ? _inner.Position : _read));

        public override long Seek(long offset, SeekOrigin origin)
        {
            var boundedLength = Length;
            var target = origin switch
            {
                SeekOrigin.Begin => offset,
                SeekOrigin.Current => Position + offset,
                SeekOrigin.End => boundedLength + offset,
                _ => throw new ArgumentOutOfRangeException(nameof(origin))
            };

            ArgumentOutOfRangeException.ThrowIfNegative(target);
            var clamped = Math.Min(target, maxBytes);
            var moved = _inner.Seek(clamped, SeekOrigin.Begin);
            _read = moved;
            return Math.Min(moved, boundedLength);
        }

        public override void SetLength(long value)
            => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count)
            => throw new NotSupportedException();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
                _inner.Dispose();

            base.Dispose(disposing);
        }

        public override async ValueTask DisposeAsync()
        {
            await _inner.DisposeAsync().ConfigureAwait(false);
            await base.DisposeAsync().ConfigureAwait(false);
        }
    }
}
