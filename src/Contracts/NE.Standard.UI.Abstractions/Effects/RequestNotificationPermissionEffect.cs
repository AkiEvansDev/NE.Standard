namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Asks the reader whether the page may show system notifications — the browser's own prompt — and reports the answer to the runtime.
/// </summary>
/// <remarks>
/// A browser shows the prompt only inside the reader's own gesture: raised by an interaction (<c>InteractOn("click", …)</c>) it runs in
/// the press itself; returned from a command it runs after the round trip, which most browsers refuse without a word. Asked again
/// once refused, the browser answers at once and shows nothing: a page whose <c>UIContext.NotificationPermission</c> says denied says
/// so rather than offering the button.
/// </remarks>
public sealed class RequestNotificationPermissionEffect : ClientEffect
{
    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.RequestNotificationPermission;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;
}
