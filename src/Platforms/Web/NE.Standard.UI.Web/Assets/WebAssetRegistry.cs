using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using NE.Standard.UI.Web.Abstractions.Assets;

namespace NE.Standard.UI.Web.Assets;

internal sealed class WebAssetRegistry : IWebAssetRegistry
{
    private readonly FrozenDictionary<string, WebAssetDescriptor> _assets;

    public WebAssetRegistry(IEnumerable<WebAssetDescriptor> assets)
    {
        ArgumentNullException.ThrowIfNull(assets);

        Dictionary<string, WebAssetDescriptor> builder = new(StringComparer.Ordinal);

        Add(builder, StandardWebAssetDescriptors.Css);
        Add(builder, StandardWebAssetDescriptors.JavaScript);

        foreach (WebAssetDescriptor asset in assets)
            Add(builder, asset);

        _assets = builder.ToFrozenDictionary(StringComparer.Ordinal);
    }

    public IReadOnlyList<WebAssetDescriptor> Assets
        => [.. _assets.Values
            .OrderBy(static asset => asset.Order)
            .ThenBy(static asset => asset.Key, StringComparer.Ordinal)];

    public bool TryGet(string key, [NotNullWhen(true)] out WebAssetDescriptor? asset)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return _assets.TryGetValue(key, out asset);
    }

    public WebAssetDescriptor GetRequired(string key)
        => TryGet(key, out WebAssetDescriptor? asset)
            ? asset
            : throw new InvalidOperationException($"Web asset '{key}' was not registered.");

    private static void Add(Dictionary<string, WebAssetDescriptor> builder, WebAssetDescriptor asset)
    {
        ArgumentNullException.ThrowIfNull(builder);
        ArgumentNullException.ThrowIfNull(asset);

        asset.Validate();

        if (!builder.TryAdd(asset.Key, asset))
            throw new InvalidOperationException($"Web asset '{asset.Key}' is already registered.");
    }
}
