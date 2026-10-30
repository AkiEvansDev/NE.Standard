using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// A notification's one button: its words, and the controller's command a press runs with the argument, through the ordinary
/// command path — filters, authorization and <c>MaxConcurrent</c> apply as to a button's press.
/// </summary>
/// <remarks>
/// The command and its argument stay on the server: the effect is sent with an id the runtime issues for this one press, so the page
/// can run what it was offered and nothing else, once.
/// </remarks>
public sealed class UINotificationAction
{
    /// <summary>
    /// Creates an action running <paramref name="command"/>, handing <paramref name="argument"/> (the key the command acts on, such
    /// as the deleted item's id) to its one parameter.
    /// </summary>
    /// <exception cref="ArgumentException">The title is blank: a button naming nothing.</exception>
    public UINotificationAction(UIPhrase title, string command, object? argument = null, UIButtonVariant variant = UIButtonVariant.Surface)
    {
        ArgumentNullException.ThrowIfNull(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        if (!UIPhrase.HasWords(title))
            throw new ArgumentException("A notification's action needs words.", nameof(title));

        Title = title;
        Command = command;
        Argument = argument;
        Variant = variant;
    }

    [JsonConstructor]
    private UINotificationAction(UIPhrase title, string id, UIButtonVariant variant = UIButtonVariant.Surface)
    {
        ArgumentNullException.ThrowIfNull(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        Title = title;
        Command = string.Empty;
        Id = id;
        Variant = variant;
    }

    /// <summary>
    /// Gets the button's words: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase, translated as the message is.
    /// </summary>
    public UIPhrase Title { get; }

    /// <summary>
    /// Gets the button's visual variant; <see cref="UIButtonVariant.Surface"/> by default.
    /// </summary>
    public UIButtonVariant Variant { get; init; } = UIButtonVariant.Surface;

    /// <summary>
    /// Gets the name of the controller's command a press runs; empty on an action read back from the wire.
    /// </summary>
    [JsonIgnore]
    public string Command { get; }

    /// <summary>
    /// Gets what the command's one parameter receives, or <see langword="null"/> for none.
    /// </summary>
    [JsonIgnore]
    public object? Argument { get; }

    /// <summary>
    /// Gets the id the page runs the action by, issued when the effect is sent; <see langword="null"/> before.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Id { get; }

    /// <summary>
    /// Offers the command to the page through <paramref name="resolver"/>, which checks it and answers the id it is run by.
    /// </summary>
    internal UINotificationAction Offer(IUIReferenceResolver resolver)
        => new(Title, resolver.OfferCommand(Command, Argument), Variant);
}
