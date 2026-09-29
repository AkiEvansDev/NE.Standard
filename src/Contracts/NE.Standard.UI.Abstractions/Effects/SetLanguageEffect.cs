using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>Switches the page to a language in place — its words re-translated, no navigation — after the session moved to it.</summary>
/// <remarks>
/// The server sends it to the connection whose code switched the session; raised on the page (an interaction), the page stores
/// the language in the session first. Numbers and dates keep their culture until the next render.
/// </remarks>
public sealed class SetLanguageEffect : ClientEffect
{
    /// <summary>
    /// Creates the effect for a language.
    /// </summary>
    public SetLanguageEffect(string language)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(language);

        Language = language;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.SetLanguage;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the language to switch to.
    /// </summary>
    public string Language { get; }

    /// <summary>Gets where the page fetches the language's words.</summary>
    /// <remarks>
    /// Named by the platform on a switch it pushes for a session that already holds the language, so the page does not tell the session
    /// again; without it the page tells the session and learns the address.
    /// </remarks>
    public string? Href { get; init; }
}
