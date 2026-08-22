using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

internal sealed class UITranslationRegistry : ITranslator
{
    private readonly ITranslationSource[] _sources;
    private readonly string[] _languages;

    public UITranslationRegistry(string defaultLanguage = "en", IReadOnlyList<ITranslationSource>? sources = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(defaultLanguage);

        DefaultLanguage = defaultLanguage;

        _sources = sources is null || sources.Count == 0
            ? []
            : [.. sources];

        _languages = BuildLanguages(defaultLanguage, _sources);
    }

    private static string[] BuildLanguages(string defaultLanguage, ITranslationSource[] sources)
    {
        HashSet<string> languages = new(StringComparer.Ordinal)
        {
            defaultLanguage
        };

        for (var i = 0; i < sources.Length; i++)
        {
            ITranslationSource source = sources[i];

            ArgumentNullException.ThrowIfNull(source);
            ArgumentNullException.ThrowIfNull(source.Languages);

            for (var j = 0; j < source.Languages.Count; j++)
            {
                ArgumentException.ThrowIfNullOrWhiteSpace(source.Languages[j]);
                _ = languages.Add(source.Languages[j]);
            }
        }

        return [.. languages];
    }

    /// <inheritdoc />
    public string DefaultLanguage { get; }

    /// <inheritdoc />
    public IReadOnlyList<string> Languages => _languages;

    /// <summary>
    /// Translates a key using the requested language, then the default language, and returns the key when no translation is found.
    /// </summary>
    public string? Translate(string language, string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
            return key;

        var effectiveLanguage = string.IsNullOrWhiteSpace(language)
            ? DefaultLanguage
            : language;

        if (TryTranslate(effectiveLanguage, key, out var value))
            return value;

        if (!string.Equals(effectiveLanguage, DefaultLanguage, StringComparison.Ordinal) && TryTranslate(DefaultLanguage, key, out value))
            return value;

        return key;
    }

    private bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? value)
    {
        for (var i = _sources.Length - 1; i >= 0; i--)
        {
            if (_sources[i].TryTranslate(language, key, out value))
                return true;
        }

        value = null;
        return false;
    }
}
