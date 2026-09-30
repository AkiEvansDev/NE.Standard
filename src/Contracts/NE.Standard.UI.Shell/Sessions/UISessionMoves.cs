using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// What of a session a page shows and a controller hears — its language, theme mode and colours — and the effects that bring a page
/// from one to the other.
/// </summary>
internal static class UISessionMoves
{
    /// <summary>Whether the session moved in anything a page shows.</summary>
    public static bool Any(IUserSessionContext previous, IUserSessionContext current)
        => !string.Equals(previous.Language, current.Language, StringComparison.Ordinal)
        || previous.ThemeMode != current.ThemeMode
        || !Equals(previous.ThemeColors, current.ThemeColors);

    /// <summary>The effects that bring a page shown in <paramref name="previous"/> to <paramref name="current"/>; none where it did not move.</summary>
    public static ClientEffect[] Effects(IUserSessionContext previous, IUserSessionContext current)
    {
        List<ClientEffect> effects = [];

        if (!string.Equals(previous.Language, current.Language, StringComparison.Ordinal))
            effects.Add(new SetLanguageEffect(current.Language));

        if (previous.ThemeMode != current.ThemeMode)
            effects.Add(new SetThemeEffect(current.ThemeMode));

        if (!Equals(previous.ThemeColors, current.ThemeColors))
            effects.Add(new SetThemeColorsEffect(current.ThemeColors));

        return [.. effects];
    }
}
