using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Application;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

/// <summary>
/// The render cache on disk, held in memory once read. Best-effort throughout: a directory that cannot be read or written
/// costs the cache, never the page or the host — a failure is logged once per cause and the page renders without it.
/// </summary>
internal sealed partial class FileSystemWebViewRenderCache : IWebViewRenderCache
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "The render cache could not {Operation} under '{Directory}'; pages render without it meanwhile. Later failures of this kind are not logged.")]
        public static partial void CacheUnavailable(ILogger logger, Exception exception, string operation, string directory);

        [LoggerMessage(EventId = 2, Level = LogLevel.Debug, Message = "Read the render of '{Key}' off the disk in {ElapsedMs:F1} ms: {Bytes} bytes.")]
        public static partial void RenderRead(ILogger logger, string key, double elapsedMs, long bytes);

        [LoggerMessage(EventId = 3, Level = LogLevel.Debug, Message = "Wrote the render of '{Key}' to the disk in {ElapsedMs:F1} ms: {Bytes} bytes.")]
        public static partial void RenderWritten(ILogger logger, string key, double elapsedMs, long bytes);
    }

    /// <summary>The folder the cache owns under the configured one: the only one it ever empties.</summary>
    internal const string OwnFolderName = "renders";

    private const string HtmlFileName = "view.html";
    private const string MetadataFileName = "metadata.json";
    private const string InitBindingsFileName = "init-bindings.json";

    private const string TemporaryFileExtension = ".tmp";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // Far past any write: a temporary file this old was left by a process that stopped mid-write.
    private static readonly TimeSpan AbandonedTemporaryAge = TimeSpan.FromMinutes(10);

    /// <summary>
    /// The renders this process has already read, so a page load costs a dictionary lookup rather than the files again.
    /// </summary>
    /// <remarks>
    /// The files persist across restarts and processes; this cache avoids re-reading the whole shape from disk when a controller
    /// page needs only its init bindings.
    /// </remarks>
    private readonly ConcurrentDictionary<string, HeldRender> _renders = new(StringComparer.Ordinal);

    // The causes already logged, as operation and exception type, so a read-only folder is one warning rather than one per page.
    private readonly ConcurrentDictionary<string, byte> _reportedFailures = new(StringComparer.Ordinal);

    private readonly string _directoryPath;
    private readonly int _maxHeldRenders;
    private readonly long _maxHeldBytes;
    private readonly ILogger _logger;

    // An ordering stamp, not a clock: a race between two reads only reorders which entry is dropped first.
    private long _reads;
    private long _heldBytes;
    private long _diskBytesRead;
    private long _diskBytesWritten;

    public FileSystemWebViewRenderCache(IOptions<WebViewRenderCacheOptions> options, ILogger<FileSystemWebViewRenderCache>? logger = null)
    {
        ArgumentNullException.ThrowIfNull(options);

        _logger = logger ?? NullLogger<FileSystemWebViewRenderCache>.Instance;

        _maxHeldRenders = options.Value.MaxHeldRenders > 0
            ? options.Value.MaxHeldRenders
            : throw new ArgumentOutOfRangeException(nameof(options), options.Value.MaxHeldRenders, "Held render count must be greater than zero.");

        _maxHeldBytes = options.Value.MaxHeldBytes > 0
            ? options.Value.MaxHeldBytes
            : throw new ArgumentOutOfRangeException(nameof(options), options.Value.MaxHeldBytes, "Held render bytes must be greater than zero.");

        // A folder of the cache's own under the one named, so a clear can never empty a folder the application keeps other files in.
        _directoryPath = Path.Combine(string.IsNullOrWhiteSpace(options.Value.DirectoryPath) ? DefaultDirectoryPath() : options.Value.DirectoryPath, OwnFolderName);
    }

    /// <summary>How many renders are held in memory, for the web meter.</summary>
    public long HeldCount => _renders.Count;

    /// <summary>How many bytes of markup and metadata the held renders take, as <see cref="WebViewRenderCacheOptions.MaxHeldBytes"/> counts them.</summary>
    public long HeldBytes => Interlocked.Read(ref _heldBytes);

    /// <summary>How many characters of markup and metadata the held renders take, for the web meter.</summary>
    public long HeldLength => HeldBytes / sizeof(char);

    /// <summary>How many bytes this process has read from the folder, for the web meter.</summary>
    public long DiskBytesRead => Interlocked.Read(ref _diskBytesRead);

    /// <summary>How many bytes this process has written to the folder, for the web meter.</summary>
    public long DiskBytesWritten => Interlocked.Read(ref _diskBytesWritten);

    /// <summary>
    /// The application's own folder under the temp folder (<see cref="UIApplicationStorage.TempDirectory(string)"/>), so two
    /// applications on one machine never share a cache or clear each other's.
    /// </summary>
    internal static string DefaultDirectoryPath()
        => UIApplicationStorage.TempDirectory("NE.Standard.UI");

    /// <summary>
    /// Empties the cache directory, keeping the directory itself, to avoid the Windows race of deleting and recreating it.
    /// </summary>
    public ValueTask ClearAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        foreach (KeyValuePair<string, HeldRender> pair in _renders)
            Release(pair);

        try
        {
            ClearDirectory(cancellationToken);
        }
        catch (Exception exception) when (IsStorageFailure(exception))
        {
            ReportFailure("clear", exception);
        }

        return ValueTask.CompletedTask;
    }

    private void Release(KeyValuePair<string, HeldRender> pair)
    {
        if (_renders.TryRemove(pair))
            _ = Interlocked.Add(ref _heldBytes, -pair.Value.Bytes);
    }

    private void ClearDirectory(CancellationToken cancellationToken)
    {
        DirectoryInfo directory = new(_directoryPath);

        if (!directory.Exists)
        {
            _ = Directory.CreateDirectory(_directoryPath);
            return;
        }

        foreach (FileSystemInfo entry in directory.EnumerateFileSystemInfos())
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (entry is DirectoryInfo subdirectory)
                subdirectory.Delete(recursive: true);
            else
                entry.Delete();
        }
    }

    private static bool IsStorageFailure(Exception exception)
        => exception is IOException or UnauthorizedAccessException or JsonException;

    private void ReportFailure(string operation, Exception exception)
    {
        if (_reportedFailures.TryAdd($"{operation}:{exception.GetType().FullName}", 0))
            Log.CacheUnavailable(_logger, exception, operation, _directoryPath);
    }

    /// <summary>
    /// Sweeps what a folder kept across starts gathers: every compile of a view but the most recent, and the temporary files a
    /// stopped process left behind.
    /// </summary>
    /// <remarks>
    /// The newest compile of a view is kept rather than this process's, which is not known before the view renders: after a
    /// deploy the previous build's folder goes at the next start, so a view keeps at most two.
    /// </remarks>
    public ValueTask SweepAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        try
        {
            SweepDirectory(DateTime.UtcNow, cancellationToken);
        }
        catch (Exception exception) when (IsStorageFailure(exception))
        {
            ReportFailure("sweep", exception);
        }

        return ValueTask.CompletedTask;
    }

    private void SweepDirectory(DateTime utcNow, CancellationToken cancellationToken)
    {
        DirectoryInfo directory = new(_directoryPath);

        if (!directory.Exists)
            return;

        foreach (DirectoryInfo view in directory.EnumerateDirectories())
        {
            cancellationToken.ThrowIfCancellationRequested();

            DirectoryInfo[] compiles = view.GetDirectories();

            Array.Sort(compiles, static (left, right) => right.LastWriteTimeUtc.CompareTo(left.LastWriteTimeUtc));

            for (var i = 1; i < compiles.Length; i++)
                compiles[i].Delete(recursive: true);
        }

        // Only a temporary file old enough that no writer can still be about to move it: a second process may share the folder.
        foreach (FileInfo temporary in directory.EnumerateFiles("*" + TemporaryFileExtension, SearchOption.AllDirectories))
        {
            if (temporary.LastWriteTimeUtc + AbandonedTemporaryAge <= utcNow)
                TryDeleteTempFile(temporary.FullName);
        }
    }

    public async ValueTask<WebCachedViewRender?> GetRenderAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        if (_renders.TryGetValue(key, out HeldRender? held))
        {
            held.Touch(Interlocked.Increment(ref _reads));
            return held.Render;
        }

        WebCachedViewRender? render;

        try
        {
            render = await ReadRenderAsync(key, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (IsStorageFailure(exception))
        {
            ReportFailure("read", exception);
            return null;
        }

        if (render is not null)
            Hold(key, render);

        return render;
    }

    private async ValueTask<WebCachedViewRender?> ReadRenderAsync(string key, CancellationToken cancellationToken)
    {
        var directory = ResolveDirectory(key);
        var htmlPath = Path.Combine(directory, HtmlFileName);
        var metadataPath = Path.Combine(directory, MetadataFileName);

        if (!File.Exists(htmlPath) || !File.Exists(metadataPath))
            return null;

        var started = Stopwatch.GetTimestamp();

        // All three files or a miss: an entry whose write stopped short would otherwise give a controller page no init bindings,
        // and so no values, until the cache is cleared.
        if (await ReadInitBindingIdsAsync(key, cancellationToken).ConfigureAwait(false) is not { } initBindingIds)
            return null;

        var html = await ReadAllTextSharedAsync(htmlPath, cancellationToken).ConfigureAwait(false);
        var metadataJson = await ReadAllTextSharedAsync(metadataPath, cancellationToken).ConfigureAwait(false);

        WebCachedViewRender render = new()
        {
            Html = html,
            MetadataJson = metadataJson,
            InitBindingIds = initBindingIds
        };

        render.Validate();

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);
        // The files' own lengths: counting the text again would be a second pass over the whole page.
        var bytes = new FileInfo(htmlPath).Length + new FileInfo(metadataPath).Length;

        _ = Interlocked.Add(ref _diskBytesRead, bytes);
        Log.RenderRead(_logger, key, elapsed.TotalMilliseconds, bytes);

        return render;
    }

    private async ValueTask<IReadOnlyList<int>?> ReadInitBindingIdsAsync(string key, CancellationToken cancellationToken)
    {
        var path = Path.Combine(ResolveDirectory(key), InitBindingsFileName);

        if (!File.Exists(path))
            return null;

        using FileStream stream = OpenShared(path);

        WebInitBindingCacheEntry? entry = await JsonSerializer.DeserializeAsync<WebInitBindingCacheEntry>(stream, JsonOptions, cancellationToken).ConfigureAwait(false);

        return entry?.BindingIds ?? [];
    }

    private void Hold(string key, WebCachedViewRender render)
    {
        HeldRender held = new(render, Interlocked.Increment(ref _reads));

        // By hand rather than an indexer write, so the bytes of the entry it replaces leave the count exactly once.
        while (true)
        {
            if (_renders.TryGetValue(key, out HeldRender? previous))
            {
                if (_renders.TryUpdate(key, held, previous))
                {
                    _ = Interlocked.Add(ref _heldBytes, held.Bytes - previous.Bytes);
                    break;
                }
            }
            else if (_renders.TryAdd(key, held))
            {
                _ = Interlocked.Add(ref _heldBytes, held.Bytes);
                break;
            }
        }

        if (_renders.Count > _maxHeldRenders || Interlocked.Read(ref _heldBytes) > _maxHeldBytes)
            TrimHeldRenders();
    }

    /// <summary>
    /// Drops the least recently read renders back to three quarters of both bounds, so trimming is not a per-write cost; the most
    /// recent stays, even alone past the byte bound.
    /// </summary>
    private void TrimHeldRenders()
    {
        var targetCount = Math.Max(1, _maxHeldRenders * 3 / 4);
        var targetBytes = _maxHeldBytes / 4 * 3;

        KeyValuePair<string, HeldRender>[] snapshot = [.. _renders];

        Array.Sort(snapshot, static (left, right) => left.Value.Stamp.CompareTo(right.Value.Stamp));

        for (var i = 0; i < snapshot.Length - 1 && (_renders.Count > targetCount || Interlocked.Read(ref _heldBytes) > targetBytes); i++)
            Release(snapshot[i]);
    }

    /// <summary>
    /// Writes a render into the cache; each of the three files is written atomically, and a read takes the set only when all three
    /// are there.
    /// </summary>
    public async ValueTask SetRenderAsync(string key, WebCachedViewRender render, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(render);

        render.Validate();

        // Held whatever the disk says, so a process that cannot write still serves from memory.
        Hold(key, render);

        try
        {
            // Not the request's token: a reader navigating away must not leave the entry half written for the next process.
            await WriteRenderAsync(key, render, CancellationToken.None).ConfigureAwait(false);
        }
        catch (Exception exception) when (IsStorageFailure(exception))
        {
            ReportFailure("write", exception);
        }
    }

    private async ValueTask WriteRenderAsync(string key, WebCachedViewRender render, CancellationToken cancellationToken)
    {
        var directory = ResolveDirectory(key);
        var started = Stopwatch.GetTimestamp();

        _ = Directory.CreateDirectory(directory);

        var bytes = await WriteAllTextAtomicAsync(Path.Combine(directory, HtmlFileName), render.Html, cancellationToken).ConfigureAwait(false);
        bytes += await WriteAllTextAtomicAsync(Path.Combine(directory, MetadataFileName), render.MetadataJson, cancellationToken).ConfigureAwait(false);
        bytes += await SetInitBindingIdsAsync(key, render.InitBindingIds, cancellationToken).ConfigureAwait(false);

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        _ = Interlocked.Add(ref _diskBytesWritten, bytes);
        Log.RenderWritten(_logger, key, elapsed.TotalMilliseconds, bytes);
    }

    public ValueTask<IReadOnlyList<int>?> GetInitBindingIdsAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        if (_renders.TryGetValue(key, out HeldRender? held))
        {
            // A page with a controller reads only this off the entry, so this read is what keeps its entry recent.
            held.Touch(Interlocked.Increment(ref _reads));
            return ValueTask.FromResult<IReadOnlyList<int>?>(held.Render.InitBindingIds);
        }

        return ReadInitBindingIdsBestEffortAsync(key, cancellationToken);
    }

    private async ValueTask<IReadOnlyList<int>?> ReadInitBindingIdsBestEffortAsync(string key, CancellationToken cancellationToken)
    {
        try
        {
            return await ReadInitBindingIdsAsync(key, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception) when (IsStorageFailure(exception))
        {
            ReportFailure("read", exception);
            return null;
        }
    }

    private async ValueTask<long> SetInitBindingIdsAsync(string key, IReadOnlyList<int> bindingIds, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(bindingIds);

        var directory = ResolveDirectory(key);

        _ = Directory.CreateDirectory(directory);

        WebInitBindingCacheEntry entry = new()
        {
            BindingIds = [.. bindingIds]
        };

        var json = JsonSerializer.Serialize(entry, JsonOptions);

        return await WriteAllTextAtomicAsync(Path.Combine(directory, InitBindingsFileName), json, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// A folder per view and language holding one per compile, so a start can tell a stale compile of a view from the current one.
    /// </summary>
    private string ResolveDirectory(string key)
    {
        // The key is WebViewCacheKeys' `{ViewKey}:{Language}:{Fingerprint}`; one without the separator is a view of one compile.
        var separator = key.LastIndexOf(':');

        return separator < 0
            ? Path.Combine(_directoryPath, CreateDirectoryName(key), "compile")
            : Path.Combine(_directoryPath, CreateDirectoryName(key[..separator]), CreateDirectoryName(key[(separator + 1)..]));
    }

    private static string CreateDirectoryName(string name)
    {
        var sanitized = SanitizeKey(name);
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(name)));

        return string.Create(CultureInfo.InvariantCulture, $"{sanitized}-{hash[..12]}");
    }

    private static string SanitizeKey(string key)
        => UIApplicationStorage.ToSegment(key, "view");

    private static async Task<string> ReadAllTextSharedAsync(string path, CancellationToken cancellationToken)
    {
        using FileStream stream = OpenShared(path);
        using StreamReader reader = new(stream, Encoding.UTF8);

        return await reader.ReadToEndAsync(cancellationToken).ConfigureAwait(false);
    }

    // A reader shares delete and write: on Windows, the atomic replace below fails against a reader holding the file with less.
    private static FileStream OpenShared(string path)
        => new(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete, bufferSize: 4096, useAsync: true);

    /// <summary>Writes the file through a temporary one moved over it, and returns the bytes written.</summary>
    private static async ValueTask<long> WriteAllTextAtomicAsync(string path, string content, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(path) ?? throw new InvalidOperationException("Cache file path must include a directory.");
        var tempPath = Path.Combine(
            directory,
            string.Create(CultureInfo.InvariantCulture, $".{Path.GetFileName(path)}.{Guid.NewGuid():N}{TemporaryFileExtension}")
        );

        try
        {
            await File.WriteAllTextAsync(tempPath, content, Encoding.UTF8, cancellationToken).ConfigureAwait(false);

            var bytes = new FileInfo(tempPath).Length;

            try
            {
                File.Move(tempPath, path, overwrite: true);
            }
            catch (Exception exception) when (exception is UnauthorizedAccessException or IOException)
            {
                // Two renders of one key landing together: on Windows a pending-delete file blocks the second replace while a reader
                // still holds it. Harmless, since the first already wrote this render, and an unwritten cache is just a miss the
                // next request repairs.
                TryDeleteTempFile(tempPath);
            }

            return bytes;
        }
        catch
        {
            // Navigating away mid-render aborts the write; without this, the half-written temp file would never be swept.
            TryDeleteTempFile(tempPath);
            throw;
        }
    }

    private static void TryDeleteTempFile(string tempPath)
    {
        try
        {
            File.Delete(tempPath);
        }
        catch (IOException)
        {
        }
        catch (UnauthorizedAccessException)
        {
        }
    }

    private sealed class HeldRender(WebCachedViewRender render, long stamp)
    {
        public WebCachedViewRender Render { get; } = render;

        // What the two strings take in memory, UTF-16; the init bindings are small beside them.
        public long Bytes { get; } = ((long)render.Html.Length + render.MetadataJson.Length) * sizeof(char);

        public long Stamp { get; private set; } = stamp;

        public void Touch(long value) => Stamp = value;
    }

    private sealed class WebInitBindingCacheEntry
    {
        public int[] BindingIds { get; init; } = [];
    }
}
