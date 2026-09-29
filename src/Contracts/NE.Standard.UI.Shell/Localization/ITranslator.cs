using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// Provides translation lookup across configured translation sources.
/// </summary>
public interface ITranslator
{
    /// <summary>
    /// Gets the default language used by the translator.
    /// </summary>
    string DefaultLanguage { get; }

    /// <summary>
    /// Gets supported languages.
    /// </summary>
    IReadOnlyList<string> Languages { get; }

    /// <summary>
    /// Whether <paramref name="language"/> is one of <see cref="Languages"/> — the one answer to which languages a page may switch
    /// to and have its words served in.
    /// </summary>
    bool HasLanguage(string language)
    {
        for (var i = 0; i < Languages.Count; i++)
        {
            if (string.Equals(Languages[i], language, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Translates a plain value for the specified language, answering the value itself when it is no key.
    /// </summary>
    string? Translate(string language, string? key);

    /// <summary>Looks a key up without reporting a missing word: <see langword="false"/> where nothing answers it.</summary>
    /// <remarks>
    /// For a caller probing whether a key's form exists. The default asks <see cref="Translate(string, string?)"/>, which honours the
    /// translator's key prefixes; a translator that can looks the key up whatever the prefixes.
    /// </remarks>
    bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? words)
    {
        words = Translate(language, key);

        return words is not null && !string.Equals(words, key, StringComparison.Ordinal);
    }

    /// <summary>
    /// Translates a key for the language and fills its <c>{name}</c> slots; a numeric <c>count</c> picks the plural form.
    /// </summary>
    /// <remarks>A key is always looked up here, whatever the prefixes; an author's text among the arguments by the plain rule.</remarks>
    string? Translate(string language, string? key, IReadOnlyDictionary<string, object?>? arguments)
    {
        if (string.IsNullOrWhiteSpace(key))
            return key;

        var template = UIWords.TryReadCount(arguments, out var count)
            ? TranslatePlural(this, language, key, count)
            : Translate(language, key) ?? key;

        return UIWords.Format(template, arguments, nested => (nested.IsText ? Translate(language, nested.Key) : Translate(language, nested.Key, nested.Arguments)) ?? nested.Key);
    }

    private static string TranslatePlural(ITranslator translator, string language, string key, double count)
    {
        var form = string.Concat(key, ".", UIPluralRules.Suffix(UIPluralRules.Select(language, count)));

        if (translator.Translate(language, form) is { } text && !string.Equals(text, form, StringComparison.Ordinal))
            return text;

        var other = key + ".other";

        if (translator.Translate(language, other) is { } otherText && !string.Equals(otherText, other, StringComparison.Ordinal))
            return otherText;

        return translator.Translate(language, key) ?? key;
    }

    /// <summary>
    /// Lists every word the translator can answer for <paramref name="language"/>; a translator that cannot list answers
    /// <see cref="UIWordTable.Unlisted"/>.
    /// </summary>
    UIWordTable ListWords(string language)
        => UIWordTable.Unlisted;
}
