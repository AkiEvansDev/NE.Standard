using System;
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

    private readonly string _directoryPath;

    public FileSystemWebViewRenderCache(IOptions<WebViewRenderCacheOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

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

        var directory = ResolveDirectory(key);
        var htmlPath = Path.Combine(directory, HtmlFileName);
        var metadataPath = Path.Combine(directory, MetadataFileName);

        if (!File.Exists(htmlPath) || !File.Exists(metadataPath))
            return null;

        var html = await File.ReadAllTextAsync(htmlPath, cancellationToken).ConfigureAwait(false);
        var metadataJson = await File.ReadAllTextAsync(metadataPath, cancellationToken).ConfigureAwait(false);
        IReadOnlyList<int> initBindingIds = await GetInitBindingIdsAsync(key, cancellationToken).ConfigureAwait(false) ?? [];

        WebCachedViewRender render = new()
        {
            Html = html,
            MetadataJson = metadataJson,
            InitBindingIds = initBindingIds
        };

        render.Validate();

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
    }

    public async ValueTask<IReadOnlyList<int>?> GetInitBindingIdsAsync(string key, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        var path = Path.Combine(ResolveDirectory(key), InitBindingsFileName);

        if (!File.Exists(path))
            return null;

        using FileStream stream = new(
            path,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            bufferSize: 4096,
            useAsync: true
        );

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

            File.Move(tempPath, path, overwrite: true);
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

    private sealed class WebInitBindingCacheEntry
    {
        public int[] BindingIds { get; init; } = [];
    }
}
