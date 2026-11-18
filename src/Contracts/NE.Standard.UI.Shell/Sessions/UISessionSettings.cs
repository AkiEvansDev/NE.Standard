using System;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Sessions;

internal static class UISessionSettings
{
    public static bool Holds(ClientEffect effect, string language, UIThemeMode? themeMode, UIThemeColors? themeColors)
        => effect switch
        {
            SetLanguageEffect setLanguage => string.Equals(setLanguage.Language, language, StringComparison.Ordinal),
            SetThemeEffect setTheme => setTheme.Stored || setTheme.Mode == themeMode,
            SetThemeColorsEffect setColors => Equals(setColors.Colors, themeColors),
            _ => true
        };
}
