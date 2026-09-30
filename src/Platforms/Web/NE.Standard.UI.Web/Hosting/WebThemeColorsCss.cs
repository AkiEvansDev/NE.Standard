using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// A reader's colours as the stylesheet a page carries (<see cref="WebThemeCssBuilder.BuildColors"/>), kept per theme and colours: a
/// page render, a pushed switch and the hub's answer all read one text, built once.
/// </summary>
internal static class WebThemeColorsCss
{
    // Free colour has no bound of its own: past this many the theme's sheets start over rather than grow with every colour picked.
    private const int MaxPerTheme = 1024;

    // Per theme, an immutable record the application holds for good, as the theme's own stylesheet is kept.
    private static readonly ConditionalWeakTable<UITheme, ConcurrentDictionary<UIThemeColors, string>> Sheets = [];

    /// <summary>The stylesheet the colours make over the theme; empty for none, the application's palette.</summary>
    public static string For(UITheme theme, UIThemeColors? colors)
    {
        if (colors is null || colors.IsEmpty)
            return string.Empty;

        ConcurrentDictionary<UIThemeColors, string> sheets = Sheets.GetValue(theme, static _ => new ConcurrentDictionary<UIThemeColors, string>());

        if (sheets.TryGetValue(colors, out var css))
            return css;

        if (sheets.Count >= MaxPerTheme)
            sheets.Clear();

        return sheets.GetOrAdd(colors, static (key, owner) => WebThemeCssBuilder.BuildColors(owner, key), theme);
    }
}
