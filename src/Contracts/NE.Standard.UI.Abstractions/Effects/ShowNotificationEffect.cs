using System;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to show a notification.
/// </summary>
public sealed class ShowNotificationEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that shows a notification with the given message and severity.
    /// </summary>
    public ShowNotificationEffect(string message, UIColorStyle severity = UIColorStyle.Info)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);

        Message = message;
        Severity = severity;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.ShowNotification;

    /// <summary>
    /// Gets the notification message.
    /// </summary>
    public string Message { get; }

    /// <summary>
    /// Gets the notification severity.
    /// </summary>
    public UIColorStyle Severity { get; }
}
