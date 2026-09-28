using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Threading;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Assets;

/// <summary>
/// The framework's text assets compressed once, at the smallest size Brotli and Gzip make, and served as they are: a first visit
/// no longer pays for compressing half a megabyte of script, and at a level the per-response middleware could not afford.
/// </summary>
/// <remarks>
/// Built in the background at start (<see cref="WebAssetCompressionStartupTask"/>) and on the first request that finds an asset
/// not yet built. Keyed by the asset's version, so a file that changes on disk is compressed again. A font is left out — woff2 is
/// already compressed — and so is any asset the compression would not make smaller.
/// </remarks>
internal sealed partial class WebAssetCompression(IOptions<WebResponseCompressionOptions> options, ILogger<WebAssetCompression> logger)
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Debug, Message = "Precompressed {Count} asset(s) in {ElapsedMs:F1} ms: {Original} bytes as {Brotli} with Brotli, {Gzip} with Gzip.")]
        public static partial void Warmed(ILogger logger, int count, double elapsedMs, long original, long brotli, long gzip);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "Precompressing the assets failed; an asset not yet built is served as it is and built again on its next request.")]
        public static partial void WarmFailed(ILogger logger, Exception exception);

        [LoggerMessage(EventId = 3, Level = LogLevel.Warning, Message = "Precompressing asset '{Key}' failed; it is served as it is and built again on its next request. Later failures of this asset are not logged.")]
        public static partial void BuildFailed(ILogger logger, Exception exception, string key);
    }

    /// <summary>An asset's compressed forms; either is null where it would not be smaller than the asset itself.</summary>
    internal sealed record Compressed(byte[]? Brotli, byte[]? Gzip);

    private readonly ConcurrentDictionary<(string Key, string Version), Lazy<Compressed>> _built = new();

    // The assets whose failed build was already logged, so an asset that keeps failing is one warning rather than one a request.
    private readonly ConcurrentDictionary<string, byte> _reportedFailures = new(StringComparer.Ordinal);

    /// <summary>Gets whether assets are served compressed at all: the framework's compression is on.</summary>
    public bool Enabled => options.Value.Enabled;

    /// <summary>Whether an asset of this kind is compressed: text is, a font is not.</summary>
    public static bool Compresses(WebAssetDescriptor asset)
        => asset.Kind != UIWebAssetKind.Font && asset.SourceKind != UIWebAssetSourceKind.Url;

    /// <summary>The asset's compressed forms, built now if nothing built them yet; null when they cannot be built, and the asset goes out as it is.</summary>
    public Compressed? Get(WebAssetDescriptor asset)
    {
        ArgumentNullException.ThrowIfNull(asset);

        (string Key, string Version) key = default;
        Lazy<Compressed>? built = null;

        try
        {
            key = (asset.Key, asset.ResolveVersion());
            built = _built.GetOrAdd(key, _ => new Lazy<Compressed>(() => Build(asset)));

            return built.Value;
        }
        catch (Exception exception) when (IsBuildFailure(exception))
        {
            // A Lazy keeps the exception it threw: left in place, every later request for this version would rethrow it.
            if (built is not null)
                _ = _built.TryRemove(new KeyValuePair<(string Key, string Version), Lazy<Compressed>>(key, built));

            if (_reportedFailures.TryAdd(asset.Key, 0))
                Log.BuildFailed(logger, exception, asset.Key);

            return null;
        }
    }

    private static Compressed Build(WebAssetDescriptor asset)
    {
        byte[] original;

        using (Stream source = asset.Open())
        using (MemoryStream buffer = new())
        {
            source.CopyTo(buffer);
            original = buffer.ToArray();
        }

        var brotli = Compress(original, static target => new BrotliStream(target, CompressionLevel.SmallestSize, leaveOpen: true));
        var gzip = Compress(original, static target => new GZipStream(target, CompressionLevel.SmallestSize, leaveOpen: true));

        return new Compressed(brotli.Length < original.Length ? brotli : null, gzip.Length < original.Length ? gzip : null);
    }

    private static byte[] Compress(byte[] original, Func<Stream, Stream> wrap)
    {
        using MemoryStream target = new();

        using (Stream compressor = wrap(target))
            compressor.Write(original);

        return target.ToArray();
    }

    private static bool IsBuildFailure(Exception exception)
        => exception is IOException or InvalidOperationException or NotSupportedException or UnauthorizedAccessException;

    /// <summary>Builds every compressible asset, one after another, so the first visits find them ready; a failure is logged, never thrown.</summary>
    public void Warm(WebAssetDescriptor[] assets, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(assets);

        try
        {
            WarmCore(assets, cancellationToken);
        }
        catch (Exception exception) when (IsBuildFailure(exception))
        {
            Log.WarmFailed(logger, exception);
        }
    }

    private void WarmCore(WebAssetDescriptor[] assets, CancellationToken cancellationToken)
    {
        var started = Stopwatch.GetTimestamp();
        var count = 0;
        long original = 0, brotli = 0, gzip = 0;

        foreach (WebAssetDescriptor asset in assets)
        {
            if (cancellationToken.IsCancellationRequested)
                return;

            if (!Compresses(asset) || string.IsNullOrWhiteSpace(asset.PublicPath))
                continue;

            if (Get(asset) is not { } compressed)
                continue;

            count++;
            original += OriginalLength(asset);
            brotli += compressed.Brotli?.Length ?? 0;
            gzip += compressed.Gzip?.Length ?? 0;
        }

        TimeSpan elapsed = Stopwatch.GetElapsedTime(started);

        Log.Warmed(logger, count, elapsed.TotalMilliseconds, original, brotli, gzip);
    }

    private static long OriginalLength(WebAssetDescriptor asset)
    {
        using Stream source = asset.Open();

        return source.CanSeek ? source.Length : 0;
    }
}
