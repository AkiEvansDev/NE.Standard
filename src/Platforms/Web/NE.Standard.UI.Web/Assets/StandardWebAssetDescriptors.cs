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

    public static WebAssetDescriptor Boot { get; } = new()
    {
        Key = "ui-boot.js",
        Kind = UIWebAssetKind.HeadScript,
        SourceKind = UIWebAssetSourceKind.EmbeddedResource,
        Source = "NE.Standard.UI.Web.Client.dist.ui-boot.js",
        ResourceAssemblyName = "NE.Standard.UI.Web",
        PublicPath = "/js/ui-boot.js",
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

    /// <summary>
    /// Inter, the theme's default face, shipped so a page reads the same on a machine that has no Inter of its own: the variable
    /// weight file, upright only, 352 KB once and then cached for a year under its versioned address. OFL 1.1; the licence text
    /// is in <c>Client/fonts/LICENSE.txt</c> and travels with the package.
    /// </summary>
    public static WebAssetDescriptor Font { get; } = new()
    {
        Key = "ui-inter.woff2",
        Kind = UIWebAssetKind.Font,
        SourceKind = UIWebAssetSourceKind.EmbeddedResource,
        Source = "NE.Standard.UI.Web.Client.fonts.InterVariable.woff2",
        ResourceAssemblyName = "NE.Standard.UI.Web",
        PublicPath = "/fonts/inter.woff2",
        Order = 0
    };

    /// <summary>
    /// The face declared on the font's versioned address; before <c>ui.css</c>, so the first paint already names a face that loads.
    /// A theme with another <c>FontFamily</c> simply never asks for it.
    /// </summary>
    public static WebAssetDescriptor FontCss { get; } = new()
    {
        Key = "ui-inter.css",
        Kind = UIWebAssetKind.Css,
        SourceKind = UIWebAssetSourceKind.Content,
        Source = "ui-inter",
        Content = $"@font-face{{font-family:\"Inter\";font-style:normal;font-weight:100 900;font-display:swap;src:url(\"{Font.ResolveVersionedPublicPath()}\") format(\"woff2\");}}",
        PublicPath = "/css/ui-inter.css",
        Order = -1
    };
}
