using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Localization;

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
    public UINotificationAction(UIPhrase label, string command, object? argument = null)
    {
        ArgumentNullException.ThrowIfNull(label);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        Label = label;
        Command = command;
        Argument = argument;
    }

    [JsonConstructor]
    private UINotificationAction(UIPhrase label, string id)
    {
        ArgumentNullException.ThrowIfNull(label);
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        Label = label;
        Command = string.Empty;
        Id = id;
    }

    /// <summary>
    /// Gets the button's words: the author's text (<see cref="UIPhrase.IsText"/>) or a phrase, translated as the message is.
    /// </summary>
    public UIPhrase Label { get; }

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
        => new(Label, resolver.OfferCommand(Command, Argument));
}
