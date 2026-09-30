using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// A translation key with the arguments its <c>{name}</c> slots take; always translated, on any property. <see cref="Text"/> makes
/// one of an author's text instead, looked up as a plain value is — which is what a string converts to, so a text property takes
/// either: <c>Title = "Anna"</c>, <c>Description = UIPhrase.Of("chat.sent", ("at", instant))</c>.
/// </summary>
/// <remarks>
/// <para>
/// Standing as a property's whole value, an author's text is that plain value — shown as written where the item or the instance is
/// content — and travels as a plain string (<see cref="AsValue"/>); as an argument it stays an author's text, since a plain string
/// argument is a literal.
/// </para>
/// <para>
/// An argument is a string, a number, a <see langword="bool"/>, a nested <see cref="UIPhrase"/> (translated first) or a moment — a
/// <see cref="DateTimeOffset"/>, a UTC or local <see cref="DateTime"/> or a <see cref="UIMoment"/>, written by the page in the reader's
/// zone as a timestamp is (a <see cref="DateTime"/> of unspecified kind is refused); a numeric <c>count</c> picks the key's plural form.
/// Equal by key, arguments and kind, so a value set again unchanged is no change.
/// </para>
/// </remarks>
[JsonConverter(typeof(UIPhraseJsonConverter))]
public sealed record UIPhrase
{
    /// <summary>
    /// Creates a phrase from its key and, optionally, its arguments.
    /// </summary>
    /// <exception cref="ArgumentException">An argument is a <see cref="DateTime"/> of unspecified kind, which names no instant.</exception>
    public UIPhrase(string key, IReadOnlyDictionary<string, object?>? arguments = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        Key = key;
        Arguments = arguments is null || arguments.Count == 0
            ? null
            : Freeze(arguments);
    }

    private static FrozenDictionary<string, object?> Freeze(IReadOnlyDictionary<string, object?> arguments)
    {
        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            // Refused where it is written: a guessed zone would show the moment hours off, on every page, with nothing said.
            if (argument.Value is DateTime { Kind: DateTimeKind.Unspecified })
                throw new ArgumentException($"The argument '{argument.Key}' is a DateTime of unspecified kind, which names no instant: pass a DateTimeOffset, or the DateTime through DateTime.SpecifyKind.", nameof(arguments));
        }

        return arguments.ToFrozenDictionary(StringComparer.Ordinal);
    }

    // Blank allowed: an author's text may be empty (a badge's empty text is its dot), a key may not.
    private UIPhrase(string text, bool isText)
    {
        ArgumentNullException.ThrowIfNull(text);

        Key = text;
        IsText = isText;
    }

    /// <summary>
    /// Gets the translation key, or the author's text of a <see cref="Text"/> phrase.
    /// </summary>
    public string Key { get; }

    /// <summary>
    /// Gets whether this is an author's text rather than a key: looked up only where a plain value on a translatable property would
    /// be — under key prefixes, only a prefixed one.
    /// </summary>
    public bool IsText { get; }

    /// <summary>
    /// Gets the arguments by slot name, or <see langword="null"/> when there are none.
    /// </summary>
    public IReadOnlyDictionary<string, object?>? Arguments { get; }

    /// <summary>
    /// Creates a phrase from its key and named arguments.
    /// </summary>
    /// <exception cref="ArgumentException">An argument is a <see cref="DateTime"/> of unspecified kind, which names no instant.</exception>
    public static UIPhrase Of(string key, params (string Name, object? Value)[] arguments)
    {
        ArgumentNullException.ThrowIfNull(arguments);

        if (arguments.Length == 0)
            return new UIPhrase(key);

        Dictionary<string, object?> named = new(arguments.Length, StringComparer.Ordinal);

        for (var i = 0; i < arguments.Length; i++)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(arguments[i].Name);
            named[arguments[i].Name] = arguments[i].Value;
        }

        return new UIPhrase(key, named);
    }

    /// <summary>
    /// An author's text — a text property's value, or an argument: an option's title in "Remove {label}", a column's caption — shown
    /// as written unless it is a key by the application's prefixes, as the text itself would be where it stands.
    /// </summary>
    public static UIPhrase Text(string text)
        => new(text, isText: true);

    /// <summary>
    /// A string as a text property's value: the author's text (<see cref="Text"/>); <see langword="null"/> stays <see langword="null"/>.
    /// </summary>
    [return: NotNullIfNotNull(nameof(text))]
    public static implicit operator UIPhrase?(string? text)
        => text is null ? null : Text(text);

    /// <summary>
    /// The implicit conversion's named form: the author's text (<see cref="Text"/>), not a key — a key is <see cref="Of"/>.
    /// </summary>
    public static UIPhrase FromString(string text)
        => Text(text);

    /// <summary>
    /// A property's whole value as the page is handed it: an author's text as the plain string it stands for, anything else as it is.
    /// </summary>
    public static object? AsValue(object? value)
        => value is UIPhrase { IsText: true } text ? text.Key : value;

    /// <inheritdoc />
    public bool Equals(UIPhrase? other)
    {
        if (other is null)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (IsText != other.IsText || !string.Equals(Key, other.Key, StringComparison.Ordinal))
            return false;

        if (Arguments is null || other.Arguments is null)
            return Arguments is null && other.Arguments is null;

        if (Arguments.Count != other.Arguments.Count)
            return false;

        foreach (KeyValuePair<string, object?> argument in Arguments)
        {
            if (!other.Arguments.TryGetValue(argument.Key, out var value) || !Equals(argument.Value, value))
                return false;
        }

        return true;
    }

    /// <inheritdoc />
    public override int GetHashCode()
        => HashCode.Combine(StringComparer.Ordinal.GetHashCode(Key), Arguments?.Count ?? 0, IsText);

    /// <summary>
    /// Returns the key, for debugging.
    /// </summary>
    public override string ToString()
        => Key;
}
