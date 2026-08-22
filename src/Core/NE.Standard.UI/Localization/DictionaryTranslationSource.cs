using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

/// <summary>
/// Provides translations from an in-memory dictionary keyed by language and translation key.
/// </summary>
public sealed class DictionaryTranslationSource : ITranslationSource
{
    private readonly FrozenDictionary<string, FrozenDictionary<string, string>> _translations;

    /// <summary>
    /// Creates a translation source from a dictionary of translations keyed by language, then by key.
    /// </summary>
    public DictionaryTranslationSource(IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> translations)
    {
        ArgumentNullException.ThrowIfNull(translations);

        Dictionary<string, FrozenDictionary<string, string>> builder = new(StringComparer.Ordinal);

        foreach (KeyValuePair<string, IReadOnlyDictionary<string, string>> language in translations)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(language.Key);
            ArgumentNullException.ThrowIfNull(language.Value);

            Dictionary<string, string> values = new(StringComparer.Ordinal);

            foreach (KeyValuePair<string, string> translation in language.Value)
            {
                ArgumentException.ThrowIfNullOrWhiteSpace(translation.Key);
                ArgumentNullException.ThrowIfNull(translation.Value);

                values.Add(translation.Key, translation.Value);
            }

            builder.Add(language.Key, values.ToFrozenDictionary(StringComparer.Ordinal));
        }

        _translations = builder.ToFrozenDictionary(StringComparer.Ordinal);
        Languages = [.. _translations.Keys];
    }

    /// <inheritdoc />
    public IReadOnlyList<string> Languages { get; }

    /// <inheritdoc />
    public bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(language);
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        if (!_translations.TryGetValue(language, out FrozenDictionary<string, string>? translations))
        {
            value = null;
            return false;
        }

        if (!translations.TryGetValue(key, out var result))
        {
            value = null;
            return false;
        }

        value = result;
        return true;
    }
}
