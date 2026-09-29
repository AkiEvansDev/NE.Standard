using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Primitives.Localization;

/// <summary>
/// A translation key with the arguments its <c>{name}</c> slots take; always translated, on any property. <see cref="Text"/> makes
/// one of an author's text instead, looked up as a plain value is.
/// </summary>
/// <remarks>
/// An argument is a string, a number, a <see langword="bool"/> or a nested <see cref="UIPhrase"/> (translated first); a numeric
/// <c>count</c> picks the key's plural form. Equal by key, arguments and kind, so a value set again unchanged is no change.
/// </remarks>
[JsonConverter(typeof(UIPhraseJsonConverter))]
public sealed record UIPhrase
{
    /// <summary>
    /// Creates a phrase from its key and, optionally, its arguments.
    /// </summary>
    public UIPhrase(string key, IReadOnlyDictionary<string, object?>? arguments = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        Key = key;
        Arguments = arguments is null || arguments.Count == 0
            ? null
            : arguments.ToFrozenDictionary(StringComparer.Ordinal);
    }

    private UIPhrase(string text, bool isText)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(text);

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
    /// Creates a phrase from its key alone.
    /// </summary>
    public static UIPhrase FromString(string key)
        => new(key);

    /// <summary>
    /// An author's text as an argument — an option's title in "Remove {label}", a column's caption — shown as written unless it is a
    /// key by the application's prefixes, as the text itself would be where it stands.
    /// </summary>
    public static UIPhrase Text(string text)
        => new(text, isText: true);

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
