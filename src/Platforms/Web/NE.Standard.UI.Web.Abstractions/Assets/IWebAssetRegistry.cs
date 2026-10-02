using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Web.Abstractions.Assets;

public interface IWebAssetRegistry
{
    /// <summary>Gets every asset, by <see cref="WebAssetDescriptor.Order"/> and then key: the order the page's shell links them in.</summary>
    IReadOnlyList<WebAssetDescriptor> Assets { get; }

    bool TryGet(string key, [NotNullWhen(true)] out WebAssetDescriptor? asset);

    WebAssetDescriptor GetRequired(string key);
}
