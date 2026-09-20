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
    /// Inter, the theme's default face, shipped for machines without it: the variable weight file, upright only, cached for a
    /// year. OFL 1.1 license in <c>Client/fonts/LICENSE.txt</c>.
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
    /// The framework's own glyph font — chrome marks, standard icons, and the <c>ne-</c> pack (<c>UIGlyphs</c>) — cut from Material
    /// Symbols Rounded, so a host needs no icon pack. Apache 2.0 license in <c>Client/fonts/LICENSE-material-symbols.txt</c>.
    /// </summary>
    public static WebAssetDescriptor GlyphFont { get; } = new()
    {
        Key = "ui-glyphs.woff2",
        Kind = UIWebAssetKind.Font,
        SourceKind = UIWebAssetSourceKind.EmbeddedResource,
        Source = "NE.Standard.UI.Web.Client.fonts.NEGlyphs.woff2",
        ResourceAssemblyName = "NE.Standard.UI.Web",
        PublicPath = "/fonts/ne-glyphs.woff2",
        Order = 0
    };

    /// <summary>
    /// Both faces declared on versioned addresses, before <c>ui.css</c>, so the first paint already names faces that load. A theme
    /// with another <c>FontFamily</c> never asks for Inter; the glyph face is blocked, not swapped, since a fallback glyph draws as a box.
    /// </summary>
    public static WebAssetDescriptor FontCss { get; } = new()
    {
        Key = "ui-fonts.css",
        Kind = UIWebAssetKind.Css,
        SourceKind = UIWebAssetSourceKind.Content,
        Source = "ui-fonts",
        Content = $"@font-face{{font-family:\"Inter\";font-style:normal;font-weight:100 900;font-display:swap;src:url(\"{Font.ResolveVersionedPublicPath()}\") format(\"woff2\");}}"
            + $"@font-face{{font-family:\"NE Glyphs\";font-style:normal;font-weight:400;font-display:block;src:url(\"{GlyphFont.ResolveVersionedPublicPath()}\") format(\"woff2\");}}",
        PublicPath = "/css/ui-fonts.css",
        Order = -1
    };
}
