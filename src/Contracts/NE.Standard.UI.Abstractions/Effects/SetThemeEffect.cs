using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Puts the client into a theme, and makes it the session's from then on.
/// </summary>
/// <remarks>
/// The only effect with a server side to it: the theme persists as a session setting, not just a client update.
/// </remarks>
/// <param name="mode">The theme to use, or <see langword="null"/> to follow the platform's own preference.</param>
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
}
