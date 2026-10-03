using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
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

    /// <summary>
    /// Gets the notification's one button and the command it runs (an Undo), or <see langword="null"/> for none.
    /// </summary>
    /// <remarks>
    /// The command is the controller's, checked as the effect is sent; a command the controller does not declare is logged and the
    /// notification shown without the button. What the press was offered against (a soft delete) is the controller's to finalize
    /// once <see cref="Duration"/> has passed: the page holds the notification open while the reader hovers or focuses it.
    /// </remarks>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public UINotificationAction? Action { get; init; }

    /// <summary>
    /// Gets how long the notification stands, which is the window its <see cref="Action"/> can be pressed in, or
    /// <see langword="null"/> for the page's default: eight seconds with an action, five without.
    /// </summary>
    [JsonIgnore]
    public TimeSpan? Duration
    {
        get => DurationMilliseconds is int milliseconds ? TimeSpan.FromMilliseconds(milliseconds) : null;
        init => DurationMilliseconds = value is TimeSpan duration ? ToMilliseconds(duration) : null;
    }

    // Whole milliseconds on the wire, which is what the page's timer takes.
    [JsonInclude]
    [JsonPropertyName("durationMs")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    private int? DurationMilliseconds { get; init; }

    private static int ToMilliseconds(TimeSpan duration)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(duration, TimeSpan.FromMilliseconds(1));
        ArgumentOutOfRangeException.ThrowIfGreaterThan(duration, TimeSpan.FromMilliseconds(int.MaxValue));

        return (int)Math.Ceiling(duration.TotalMilliseconds);
    }

    /// <inheritdoc />
    /// <remarks>Offers the action's command to the page: the runtime checks it and issues the id a press runs it by.</remarks>
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        if (Action is null || Action.Id is not null)
            return this;

        return new ShowNotificationEffect(Message, Severity)
        {
            Action = Action.Offer(resolver),
            DurationMilliseconds = DurationMilliseconds
        };
    }
}
