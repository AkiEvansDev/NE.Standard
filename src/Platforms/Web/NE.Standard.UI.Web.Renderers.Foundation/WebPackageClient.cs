using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Web.Abstractions.Assets;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>
/// Registers a package's embedded client (the script and stylesheet its <c>Client/</c> builds into <c>dist</c>) as framework
/// assets, after the framework's own, so it registers with the runtime the framework's module creates.
/// </summary>
public static class WebPackageClient
{
    /// <summary>After the framework's own assets (order 0).</summary>
    public const int PackageAssetOrder = 100;

    /// <summary>
    /// Registers <c>{bundleName}.js</c> and <c>{bundleName}.css</c> embedded under <c>Client/dist</c> of <paramref name="assemblyName"/>.
    /// Calling it twice registers nothing more, so a package's <c>Add…</c> stays idempotent through this alone.
    /// </summary>
    public static IServiceCollection AddPackageClient(this IServiceCollection services, string assemblyName, string bundleName)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentException.ThrowIfNullOrWhiteSpace(assemblyName);
        ArgumentException.ThrowIfNullOrWhiteSpace(bundleName);

        var scriptKey = $"{bundleName}.js";

        foreach (ServiceDescriptor descriptor in services)
        {
            if (descriptor.ImplementationInstance is WebAssetDescriptor { } asset && string.Equals(asset.Key, scriptKey, StringComparison.Ordinal))
                return services;
        }

        _ = services.AddSingleton(new WebAssetDescriptor
        {
            Key = $"{bundleName}.css",
            Kind = UIWebAssetKind.Css,
            SourceKind = UIWebAssetSourceKind.EmbeddedResource,
            Source = $"{assemblyName}.Client.dist.{bundleName}.css",
            ResourceAssemblyName = assemblyName,
            PublicPath = $"/css/{bundleName}.css",
            Order = PackageAssetOrder
        });

        _ = services.AddSingleton(new WebAssetDescriptor
        {
            Key = scriptKey,
            Kind = UIWebAssetKind.JavaScript,
            SourceKind = UIWebAssetSourceKind.EmbeddedResource,
            Source = $"{assemblyName}.Client.dist.{bundleName}.js",
            ResourceAssemblyName = assemblyName,
            PublicPath = $"/js/{bundleName}.js",
            Order = PackageAssetOrder
        });

        return services;
    }
}
