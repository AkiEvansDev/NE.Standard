using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to show a notification.
/// </summary>
/// <remarks>
/// The words are translatable as a label is: a text is looked up as a plain value on a translatable property is — under key
/// prefixes only a prefixed one — and a <see cref="UIPhrase"/> always; the page shows them in its language and again after a switch.
/// </remarks>
public sealed class ShowNotificationEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that shows a notification with the author's text or key and severity.
    /// </summary>
    public ShowNotificationEffect(string message, UIColorStyle severity = UIColorStyle.Info)
        : this(UIPhrase.Text(message), severity)
    {
    }

    /// <summary>
    /// Creates an effect that shows a notification with a key and its arguments, and severity.
    /// </summary>
    [JsonConstructor]
    public ShowNotificationEffect(UIPhrase message, UIColorStyle severity = UIColorStyle.Info)
    {
        ArgumentNullException.ThrowIfNull(message);

        Message = message;
        Severity = severity;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ShowNotification;

    /// <summary>
    /// Gets the notification's words: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.
    /// </summary>
    public UIPhrase Message { get; }

    /// <summary>
    /// Gets the notification severity.
    /// </summary>
    public UIColorStyle Severity { get; }
}
