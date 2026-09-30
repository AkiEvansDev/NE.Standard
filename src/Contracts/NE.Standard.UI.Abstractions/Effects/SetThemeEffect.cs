using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts the client into a theme and makes it the session's from then on.
/// </summary>
public sealed class SetThemeEffect(UIThemeMode? mode = null) : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.SetTheme;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the theme to use, or <see langword="null"/> to follow the platform's own preference.
    /// </summary>
    public UIThemeMode? Mode { get; } = mode;

    /// <summary>Gets whether the session already holds the theme, so the page does not report it back.</summary>
    /// <remarks>
    /// Set by the platform on a switch it pushes for a session that already holds it — a command's own <c>UpdateSessionAsync</c>, another
    /// page's switch — as <see cref="SetLanguageEffect.Href"/> is; without it the page reports the theme to its session.
    /// </remarks>
    public bool Stored { get; init; }
}
