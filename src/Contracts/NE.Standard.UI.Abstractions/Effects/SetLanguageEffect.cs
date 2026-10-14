using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>Switches the page to a language in place — its words re-translated, no navigation — after the session moved to it.</summary>
/// <remarks>
/// The server sends it to the connection whose code switched the session and to every other page open under that session, whichever
/// of them switched it; raised on the page (an interaction), the page stores the language in the session first. Pushed for a session
/// that already holds the language, the platform sends where its words are, so the page does not tell the session again. Numbers and
/// dates keep their culture until the next render.
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
}
