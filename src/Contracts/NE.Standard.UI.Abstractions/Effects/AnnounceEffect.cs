using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// How urgently a screen reader speaks an <see cref="AnnounceEffect"/>.
/// </summary>
public enum AnnouncePoliteness
{
    /// <summary>
    /// When the reader is done with what it is saying: a result, a count, a step done.
    /// </summary>
    Polite = 0,

    /// <summary>
    /// At once, cutting in: what the reader must hear before going on.
    /// </summary>
    Assertive = 1,
}

/// <summary>
/// Says something to a screen reader and shows nothing — "12 results", "Saved", "Message sent" — through a hidden live region of
/// the page.
/// </summary>
/// <remarks>
/// The words are translatable as a notification's are: a text is looked up as a plain value on a translatable property is — under key
/// prefixes only a prefixed one — and a <see cref="UIPhrase"/> always, in the page's language.
/// </remarks>
public sealed class AnnounceEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that says the author's text or key.
    /// </summary>
    public AnnounceEffect(string message, AnnouncePoliteness politeness = AnnouncePoliteness.Polite)
        : this(UIPhrase.Text(message), politeness)
    {
    }

    /// <summary>
    /// Creates an effect that says a key with its arguments.
    /// </summary>
    [JsonConstructor]
    public AnnounceEffect(UIPhrase message, AnnouncePoliteness politeness = AnnouncePoliteness.Polite)
    {
        ArgumentNullException.ThrowIfNull(message);

        Message = message;
        Politeness = politeness;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Announce;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <summary>
    /// Gets the words: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.
    /// </summary>
    public UIPhrase Message { get; }

    /// <summary>
    /// Gets how urgently the words are spoken.
    /// </summary>
    public AnnouncePoliteness Politeness { get; }
}
