using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Web.Abstractions.Assets;

public interface IWebAssetRegistry
{
    IReadOnlyList<WebAssetDescriptor> Assets { get; }

    bool TryGet(string key, [NotNullWhen(true)] out WebAssetDescriptor? asset);

    WebAssetDescriptor GetRequired(string key);
}
