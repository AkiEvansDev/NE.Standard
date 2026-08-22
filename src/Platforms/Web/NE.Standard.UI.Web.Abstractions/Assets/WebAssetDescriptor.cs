using System;
using System.IO;
using System.Reflection;

namespace NE.Standard.UI.Web.Abstractions.Assets;

public enum UIWebAssetKind
{
    TypeScript = 0,
    Less = 1,
    JavaScript = 2,
    Css = 3
}

public enum UIWebAssetSourceKind
{
    File = 0,
    EmbeddedResource = 1,
    Url = 2
}

public sealed class WebAssetDescriptor
{
    public required string Key { get; init; }

    public required UIWebAssetKind Kind { get; init; }

    public required UIWebAssetSourceKind SourceKind { get; init; }

    public required string Source { get; init; }

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
            _ => throw new NotSupportedException($"Web asset source kind '{SourceKind}' cannot be opened as a stream.")
        };
    }

    public string ResolveFilePath()
    {
        var root = !string.IsNullOrWhiteSpace(SourceRoot)
            ? SourceRoot
            : AppContext.BaseDirectory;

        return Path.GetFullPath(Path.Combine(root, Source));
    }

    private Stream OpenEmbeddedResource()
    {
        Assembly assembly = !string.IsNullOrWhiteSpace(ResourceAssemblyName)
            ? Assembly.Load(new AssemblyName(ResourceAssemblyName))
            : typeof(WebAssetDescriptor).Assembly;

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
    }
}
