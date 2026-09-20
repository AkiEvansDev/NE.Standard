using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Rendering;

internal sealed class FileSystemWebViewRenderCache : IWebViewRenderCache
{
    private const string HtmlFileName = "view.html";
    private const string MetadataFileName = "metadata.json";
    private const string InitBindingsFileName = "init-bindings.json";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// The renders this process has already read, so a page load costs a dictionary lookup rather than the files again.
    /// </summary>
    /// <remarks>
    /// The files persist across restarts and processes; this cache avoids re-reading the whole shape from disk when a controller
    /// page needs only its init bindings.
    /// </remarks>
    private readonly ConcurrentDictionary<string, HeldRender> _renders = new(StringComparer.Ordinal);

    private readonly string _directoryPath;
    private readonly int _maxHeldRenders;

    // An ordering stamp, not a clock: a race between two reads only reorders which entry is dropped first.
    private long _reads;

    public FileSystemWebViewRenderCache(IOptions<WebViewRenderCacheOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

        _maxHeldRenders = options.Value.MaxHeldRenders > 0
            ? options.Value.MaxHeldRenders
            : throw new ArgumentOutOfRangeException(nameof(options), options.Value.MaxHeldRenders, "Held render count must be greater than zero.");

        _directoryPath = string.IsNullOrWhiteSpace(options.Value.DirectoryPath)
            ? Path.Combine(AppContext.BaseDirectory, "ui-view-cache")
            : options.Value.DirectoryPath;
    }

    /// <summary>
    /// Empties the cache directory, keeping the directory itself, to avoid the Windows race of deleting and recreating it.
    /// </summary>
    public ValueTask ClearAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        _renders.Clear();

        DirectoryInfo directory = new(_directoryPath);

        if (!directory.Exists)
        {
            _ = Directory.CreateDirectory(_directoryPath);
            return ValueTask.CompletedTask;
        }

        foreach (FileSystemInfo entry in directory.EnumerateFileSystemInfos())
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (entry is DirectoryInfo subdirectory)
                subdirectory.Delete(recursive: true);
            else
                entry.Delete();
        }

        return ValueTask.CompletedTask;
    }

    public async ValueTask<WebCachedViewRender?> GetRenderAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        if (_renders.TryGetValue(key, out HeldRender? held))
        {
            held.Touch(Interlocked.Increment(ref _reads));
            return held.Render;
        }

        var directory = ResolveDirectory(key);
        var htmlPath = Path.Combine(directory, HtmlFileName);
        var metadataPath = Path.Combine(directory, MetadataFileName);

        if (!File.Exists(htmlPath) || !File.Exists(metadataPath))
            return null;

        var html = await ReadAllTextSharedAsync(htmlPath, cancellationToken).ConfigureAwait(false);
        var metadataJson = await ReadAllTextSharedAsync(metadataPath, cancellationToken).ConfigureAwait(false);
        IReadOnlyList<int> initBindingIds = await ReadInitBindingIdsAsync(key, cancellationToken).ConfigureAwait(false) ?? [];

        WebCachedViewRender render = new()
        {
            Html = html,
            MetadataJson = metadataJson,
            InitBindingIds = initBindingIds
        };

        render.Validate();

        Hold(key, render);

        return render;
    }

    /// <summary>
    /// Writes a render into the cache; each of the three files is written atomically, but the set as a whole is not.
    /// </summary>
    public async ValueTask SetRenderAsync(string key, WebCachedViewRender render, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(render);

        render.Validate();

        var directory = ResolveDirectory(key);

        _ = Directory.CreateDirectory(directory);

        await WriteAllTextAtomicAsync(Path.Combine(directory, HtmlFileName), render.Html, cancellationToken).ConfigureAwait(false);
        await WriteAllTextAtomicAsync(
            Path.Combine(directory, MetadataFileName),
            render.MetadataJson,
            cancellationToken
        ).ConfigureAwait(false);
        await SetInitBindingIdsAsync(key, render.InitBindingIds, cancellationToken).ConfigureAwait(false);

        Hold(key, render);
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

        return ReadInitBindingIdsAsync(key, cancellationToken);
    }

    private async ValueTask<IReadOnlyList<int>?> ReadInitBindingIdsAsync(string key, CancellationToken cancellationToken)
    {
        var path = Path.Combine(ResolveDirectory(key), InitBindingsFileName);

        if (!File.Exists(path))
            return null;

        using FileStream stream = OpenShared(path);

        WebInitBindingCacheEntry? entry = await JsonSerializer.DeserializeAsync<WebInitBindingCacheEntry>(
            stream,
            JsonOptions,
            cancellationToken
        ).ConfigureAwait(false);

        return entry?.BindingIds ?? [];
    }

    private async ValueTask SetInitBindingIdsAsync(string key, IReadOnlyList<int> bindingIds, CancellationToken cancellationToken)
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

        await WriteAllTextAtomicAsync(Path.Combine(directory, InitBindingsFileName), json, cancellationToken).ConfigureAwait(false);
    }

    private void Hold(string key, WebCachedViewRender render)
    {
        _renders[key] = new HeldRender(render, Interlocked.Increment(ref _reads));

        if (_renders.Count > _maxHeldRenders)
            TrimHeldRenders();
    }

    /// <summary>Drops the least recently read renders back to three quarters of the bound, so trimming is not a per-write cost.</summary>
    private void TrimHeldRenders()
    {
        var target = Math.Max(1, _maxHeldRenders * 3 / 4);

        KeyValuePair<string, HeldRender>[] snapshot = [.. _renders];

        Array.Sort(snapshot, static (left, right) => left.Value.Stamp.CompareTo(right.Value.Stamp));

        for (var i = 0; i < snapshot.Length && _renders.Count > target; i++)
            _ = _renders.TryRemove(snapshot[i]);
    }

    private string ResolveDirectory(string key)
        => Path.Combine(_directoryPath, CreateDirectoryName(key));

    private static string CreateDirectoryName(string key)
    {
        var sanitized = SanitizeKey(key);
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(key)));

        return string.Create(CultureInfo.InvariantCulture, $"{sanitized}-{hash[..12]}");
    }

    private static string SanitizeKey(string key)
    {
        StringBuilder builder = new(key.Length);

        for (var i = 0; i < key.Length; i++)
        {
            var ch = key[i];

            if (char.IsAsciiLetterOrDigit(ch))
            {
                _ = builder.Append(ch);
                continue;
            }

            if (ch is '-' or '_' or '.')
            {
                _ = builder.Append(ch);
                continue;
            }

            _ = builder.Append('-');
        }

        if (builder.Length == 0)
            return "view";

        const int MaxLength = 80;

        return builder.Length <= MaxLength
            ? builder.ToString()
            : builder.ToString(0, MaxLength);
    }

    private static async Task<string> ReadAllTextSharedAsync(string path, CancellationToken cancellationToken)
    {
        using FileStream stream = OpenShared(path);
        using StreamReader reader = new(stream, Encoding.UTF8);

        return await reader.ReadToEndAsync(cancellationToken).ConfigureAwait(false);
    }

    // A reader shares delete and write: on Windows, the atomic replace below fails against a reader holding the file with less.
    private static FileStream OpenShared(string path)
        => new(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite | FileShare.Delete, bufferSize: 4096, useAsync: true);

    private static async ValueTask WriteAllTextAtomicAsync(string path, string content, CancellationToken cancellationToken)
    {
        var directory = Path.GetDirectoryName(path) ?? throw new InvalidOperationException("Cache file path must include a directory.");
        var tempPath = Path.Combine(
            directory,
            string.Create(CultureInfo.InvariantCulture, $".{Path.GetFileName(path)}.{Guid.NewGuid():N}.tmp")
        );

        try
        {
            await File.WriteAllTextAsync(tempPath, content, Encoding.UTF8, cancellationToken).ConfigureAwait(false);

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

        public long Stamp { get; private set; } = stamp;

        public void Touch(long value) => Stamp = value;
    }

    private sealed class WebInitBindingCacheEntry
    {
        public int[] BindingIds { get; init; } = [];
    }
}
