using NE.Standard.UI.Web.Abstractions.Assets;

namespace NE.Standard.UI.Web.Assets;

internal static class StandardWebAssetDescriptors
{
    public static WebAssetDescriptor Css { get; } = new()
    {
        Key = "ui.css",
        Kind = UIWebAssetKind.Css,
        SourceKind = UIWebAssetSourceKind.EmbeddedResource,
        Source = "NE.Standard.UI.Web.Client.dist.ui.css",
        ResourceAssemblyName = "NE.Standard.UI.Web",
        PublicPath = "/css/ui.css",
        Order = 0
    };

    public static WebAssetDescriptor JavaScript { get; } = new()
    {
        Key = "ui.js",
        Kind = UIWebAssetKind.JavaScript,
        SourceKind = UIWebAssetSourceKind.EmbeddedResource,
        Source = "NE.Standard.UI.Web.Client.dist.ui.js",
        ResourceAssemblyName = "NE.Standard.UI.Web",
        PublicPath = "/js/ui.js",
        Order = 0
    };
}
