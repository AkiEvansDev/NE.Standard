using System;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Web.Abstractions.Assets;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// A theme's stylesheet as an asset of its own under <c>/_ne/</c>: the same text for every reader, so a page links it by a version
/// its content gives, cached for good, rather than carrying it in a document no cache may keep.
/// </summary>
/// <remarks>
/// A theme another content makes is another version, so another address: a page never meets a stale copy. Built once per theme, which
/// is an immutable record the application holds for good.
/// </remarks>
internal static class WebThemeStylesheet
{
    public const string PublicPath = "/_ne/css/ui-theme.css";

    private static readonly ConditionalWeakTable<UITheme, WebAssetDescriptor> Sheets = [];

    // By version, for the request a page's link makes: the theme it was rendered with, whichever that was. Grows with the distinct
    // themes the process renders, which is the themes the application builds.
    private static readonly ConcurrentDictionary<string, WebAssetDescriptor> ByVersion = new(StringComparer.Ordinal);

    /// <summary>The theme's stylesheet asset, built on first use.</summary>
    public static WebAssetDescriptor For(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        return Sheets.GetValue(theme, Create);
    }

    private static WebAssetDescriptor Create(UITheme theme)
    {
        WebAssetDescriptor sheet = new()
        {
            Key = "ui-theme.css",
            Kind = UIWebAssetKind.Css,
            SourceKind = UIWebAssetSourceKind.Content,
            Source = "ui-theme",
            Content = WebThemeCssBuilder.Build(theme),
            PublicPath = PublicPath
        };

        // The first of equal contents stays: its version is the same, and so are its bytes.
        return ByVersion.GetOrAdd(sheet.ResolveVersion(), sheet);
    }

    /// <summary>
    /// The stylesheet a request's <c>v</c> names, or, for a version this process has not rendered — an address from before a restart,
    /// or none — the application's own, which the asset endpoint then serves to revalidate rather than for good.
    /// </summary>
    public static WebAssetDescriptor Resolve(string? version, UITheme applicationTheme)
    {
        ArgumentNullException.ThrowIfNull(applicationTheme);

        WebAssetDescriptor own = For(applicationTheme);

        return version is not null && ByVersion.TryGetValue(version, out WebAssetDescriptor? named) ? named : own;
    }
}
