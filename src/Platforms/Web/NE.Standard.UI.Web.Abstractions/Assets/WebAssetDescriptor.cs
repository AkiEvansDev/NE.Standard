using System;
using System.Buffers.Binary;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Assets;

public enum UIWebAssetKind
{
    TypeScript = 0,
    Less = 1,
    JavaScript = 2,
    Css = 3,

    /// <summary>
    /// A woff2 font file: a stylesheet's own <c>@font-face</c> names it, and the shell preloads it from the head.
    /// </summary>
    Font = 4,

    /// <summary>
    /// A classic script loaded in <c>&lt;head&gt;</c> before the body parses, unlike a module, which is always deferred.
    /// </summary>
    HeadScript = 5
}

public enum UIWebAssetSourceKind
{
    File = 0,
    EmbeddedResource = 1,
    Url = 2,

    /// <summary>
    /// Content the registering package generated at runtime rather than a file it shipped.
    /// </summary>
    Content = 3
}

public sealed class WebAssetDescriptor
{
    public required string Key { get; init; }

    public required UIWebAssetKind Kind { get; init; }

    public required UIWebAssetSourceKind SourceKind { get; init; }

    /// <summary>
    /// The file path, resource name or URL; for <see cref="UIWebAssetSourceKind.Content"/> it just names the content, for diagnostics.
    /// </summary>
    public required string Source { get; init; }

    /// <summary>
    /// The asset's own text, for <see cref="UIWebAssetSourceKind.Content"/>.
    /// </summary>
    public string? Content { get; init; }

    public string? Version { get; init; }

    public string? SourceRoot { get; init; }

    public string? PublicPath { get; init; }

    public string? ResourceAssemblyName { get; init; }

    public int Order { get; init; }

    public Stream Open()
    {
        Validate();

        return SourceKind switch
        {
            UIWebAssetSourceKind.File => File.OpenRead(ResolveFilePath()),
            UIWebAssetSourceKind.EmbeddedResource => OpenEmbeddedResource(),
            UIWebAssetSourceKind.Content => new MemoryStream(Encoding.UTF8.GetBytes(Content ?? string.Empty), writable: false),
            _ => throw new NotSupportedException($"Web asset source kind '{SourceKind}' cannot be opened as a stream.")
        };
    }

    /// <summary>The version the asset's URL carries: the authored one, else derived from the content, the file's write time or the resource's identity.</summary>
    public string ResolveVersion()
    {
        if (!string.IsNullOrWhiteSpace(Version))
            return Version;

        return SourceKind switch
        {
            UIWebAssetSourceKind.File => ResolveFileVersion(),
            // The content is what changes, so the content is what the version follows — the same number on every machine and every start.
            UIWebAssetSourceKind.EmbeddedResource or UIWebAssetSourceKind.Content => _contentVersion ??= HashContent(),
            UIWebAssetSourceKind.Url => "external",
            _ => throw new NotSupportedException($"Web asset source kind '{SourceKind}' has no version.")
        };
    }

    private string? _contentVersion;

    private string HashContent()
    {
        using Stream stream = Open();

        Span<byte> hash = stackalloc byte[SHA256.HashSizeInBytes];
        _ = SHA256.HashData(stream, hash);

        return BinaryPrimitives.ReadUInt64LittleEndian(hash).ToString(CultureInfo.InvariantCulture);
    }

    private string ResolveFileVersion()
    {
        var filePath = ResolveFilePath();

        // A missing file's version follows its name, hashed stably: string.GetHashCode differs every start and on every node.
        return File.Exists(filePath)
            ? File.GetLastWriteTimeUtc(filePath).Ticks.ToString(CultureInfo.InvariantCulture)
            : BinaryPrimitives.ReadUInt64LittleEndian(SHA256.HashData(Encoding.UTF8.GetBytes(Source))).ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>The public URL with the version on it, which is what a page links and what makes the response cacheable for good.</summary>
    public string ResolveVersionedPublicPath()
    {
        // Kept once the version cannot change, which is every source but a file on disk; every page links every asset.
        if (_versionedPublicPath is { } held)
            return held;

        Validate();

        var path = !string.IsNullOrWhiteSpace(PublicPath) ? PublicPath : Source;
        var version = ResolveVersion();
        var versioned = path.Contains('?', StringComparison.Ordinal)
            ? string.Create(CultureInfo.InvariantCulture, $"{path}&v={version}")
            : string.Create(CultureInfo.InvariantCulture, $"{path}?v={version}");

        if (SourceKind != UIWebAssetSourceKind.File || !string.IsNullOrWhiteSpace(Version))
            _versionedPublicPath = versioned;

        return versioned;
    }

    private string? _versionedPublicPath;

    public string ResolveFilePath()
    {
        var root = !string.IsNullOrWhiteSpace(SourceRoot)
            ? SourceRoot
            : AppContext.BaseDirectory;

        return Path.GetFullPath(Path.Combine(root, Source));
    }

    private Stream OpenEmbeddedResource()
    {
        // Validate has required the assembly's name for an embedded resource.
        Assembly assembly = Assembly.Load(new AssemblyName(ResourceAssemblyName!));

        Stream? stream = assembly.GetManifestResourceStream(Source);

        return stream ?? throw new InvalidOperationException($"Embedded web asset resource '{Source}' was not found in assembly '{assembly.GetName().Name}'.");
    }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Key);
        ArgumentException.ThrowIfNullOrWhiteSpace(Source);

        if (SourceKind is UIWebAssetSourceKind.Url or UIWebAssetSourceKind.EmbeddedResource)
            ArgumentException.ThrowIfNullOrWhiteSpace(PublicPath);

        if (SourceKind == UIWebAssetSourceKind.EmbeddedResource)
            ArgumentException.ThrowIfNullOrWhiteSpace(ResourceAssemblyName);

        if (SourceKind == UIWebAssetSourceKind.Content)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(PublicPath);
            ArgumentNullException.ThrowIfNull(Content);
        }
    }
}
