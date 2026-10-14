using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Styling.Theme;

namespace NE.Standard.UI.Web.Services;

/// <summary>
/// A <see cref="SetLanguageEffect"/> for a language the session already holds, as the page reads it: with where it fetches the words,
/// so it switches without telling the session again.
/// </summary>
/// <remarks>The Web platform's own wire shape, written by <see cref="StandardWebUpdateSink"/> as it sends; the neutral effect carries the language alone.</remarks>
internal sealed class WebStoredLanguageEffect(string language, string href) : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.SetLanguage;

    /// <summary>Gets the language switched to.</summary>
    public string Language { get; } = language;

    /// <summary>Gets where the page fetches the language's words.</summary>
    public string Href { get; } = href;
}

/// <summary>
/// A <see cref="SetThemeColorsEffect"/> for colours the session already holds, as the page reads it: with the stylesheet they make, so
/// it draws them without handing them to the session again.
/// </summary>
/// <remarks>The Web platform's own wire shape, written by <see cref="StandardWebUpdateSink"/> as it sends; the neutral effect carries the colours alone.</remarks>
internal sealed class WebStoredThemeColorsEffect(UIThemeColors? colors, string css) : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.SetThemeColors;

    /// <summary>Gets the colours, or <see langword="null"/> for the application's palette.</summary>
    public UIThemeColors? Colors { get; } = colors;

    /// <summary>Gets the stylesheet the colours make; empty for the application's palette.</summary>
    public string Css { get; } = css;
}
