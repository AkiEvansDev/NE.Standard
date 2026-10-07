using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Shows a notification of the operating system's, which reaches a reader who is not looking at the page — the browser's, through
/// the page's tab — or, where it does not show, its <see cref="Fallback"/>.
/// </summary>
/// <remarks>
/// Shown where the page is off screen (<see cref="When"/>) and its browser lets it (<c>UIContext.NotificationPermission</c>, asked by
/// <see cref="RequestNotificationPermissionEffect"/>); the page decides as it shows it, from what it is then. Sent to every page of a
/// runtime, it is shown by the hidden ones only while none is on screen, and once: the pages share its <see cref="Tag"/>. The words
/// are translated in the page's language, as a toast's are.
/// </remarks>
public sealed class ShowSystemNotificationEffect : ClientEffect
{
    /// <summary>Creates a notification with the author's title and body, texts or keys.</summary>
    public ShowSystemNotificationEffect(string title, string? body = null)
        : this(UIPhrase.Text(title), body is null ? null : UIPhrase.Text(body))
    {
    }

    /// <summary>Creates a notification with a title and a body, each a phrase or the author's text.</summary>
    [JsonConstructor]
    public ShowSystemNotificationEffect(UIPhrase title, UIPhrase? body = null)
    {
        ArgumentNullException.ThrowIfNull(title);

        Title = title;
        Body = body;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ShowSystemNotification;

    /// <summary>Gets the notification's title: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase.</summary>
    public UIPhrase Title { get; }

    /// <summary>Gets the line under the title, or <see langword="null"/> for none.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public UIPhrase? Body { get; }

    /// <summary>
    /// Gets the key a later notification with the same one replaces this by — one per chat, say — or <see langword="null"/> for one
    /// of its own, issued as it is sent.
    /// </summary>
    /// <remarks>The one replacing is shown and sounded again, unless <see cref="Silent"/>: a second message in a chat is news too.</remarks>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Tag { get; init; }

    /// <summary>Gets the address of the picture it shows, of this site; <see langword="null"/> for the application's icon.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Icon { get; init; }

    /// <summary>
    /// Gets the address of this site a click opens where the page is gone, or <see langword="null"/> for the page's own; a page still
    /// open is brought to the front instead.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Address { get; init; }

    /// <summary>Gets whether it shows without a sound or a vibration.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Silent { get; init; }

    /// <summary>Gets whether it stays until the reader acts on it, where the system lets one stay.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool RequireInteraction { get; init; }

    /// <summary>
    /// Gets the command a click on it runs once the page is in front — its button's in the fallback toast — or <see langword="null"/>
    /// for a click that only brings the page forward.
    /// </summary>
    /// <remarks>Offered as a toast's action is, and run once; a click once the page is gone, its runtime with it, only opens <see cref="Address"/>.</remarks>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public UINotificationAction? Action { get; init; }

    /// <summary>Gets when it shows as the system's: by default only while the page is off screen.</summary>
    public UINotificationWhen When { get; init; }

    /// <summary>Gets what shows instead: by default the page's toast.</summary>
    public UINotificationFallback Fallback { get; init; }

    /// <inheritdoc />
    /// <remarks>Offers the action's command, and issues a tag where none is given, so every page sent it shows it once.</remarks>
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        if (Tag is not null && (Action is null || Action.Id is not null))
            return this;

        return new ShowSystemNotificationEffect(Title, Body)
        {
            Tag = Tag ?? Guid.NewGuid().ToString("N"),
            Icon = Icon,
            Address = Address,
            Silent = Silent,
            RequireInteraction = RequireInteraction,
            Action = Action is null || Action.Id is not null ? Action : Action.Offer(resolver),
            When = When,
            Fallback = Fallback
        };
    }
}
