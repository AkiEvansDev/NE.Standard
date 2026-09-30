using NE.Standard.UI.Abstractions.Styling.Theme;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts the reader's own brand colours over the application's palette and makes them the session's from then on; none returns to the
/// application's palette.
/// </summary>
/// <remarks>
/// Like <see cref="SetThemeEffect"/>, it reports back: the page hands the colours to its session and draws what the server derives from
/// them, the same block a page render of that session carries.
/// </remarks>
public sealed class SetThemeColorsEffect(UIThemeColors? colors = null) : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.SetThemeColors;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the colours to use, or <see langword="null"/> for the application's palette.
    /// </summary>
    public UIThemeColors? Colors { get; } = colors is { IsEmpty: false } ? colors : null;

    /// <summary>Gets the stylesheet the colours make, so the page draws it without handing the colours to its session.</summary>
    /// <remarks>
    /// Named by the platform on a switch it pushes for a session that already holds the colours, as <see cref="SetLanguageEffect.Href"/>
    /// names the words; empty for the application's palette. Without it the page hands the colours to its session and draws its answer.
    /// </remarks>
    public string? Css { get; init; }
}
