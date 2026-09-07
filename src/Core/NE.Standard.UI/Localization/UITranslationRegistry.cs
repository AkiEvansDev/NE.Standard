using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

internal sealed class UITranslationRegistry : ITranslator
{
    private readonly ITranslationSource[] _sources;
    private readonly string[] _languages;

    /// <summary>The English every word falls back to: the framework's and each package's, one table.</summary>
    private readonly FrozenDictionary<string, string> _floor;

    public UITranslationRegistry(string defaultLanguage = "en", IReadOnlyList<ITranslationSource>? sources = null, IReadOnlyList<IUIStringsSource>? packages = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(defaultLanguage);

        DefaultLanguage = defaultLanguage;

        _sources = sources is null || sources.Count == 0
            ? []
            : [.. sources];

        _languages = BuildLanguages(defaultLanguage, _sources);
        _floor = BuildFloor(packages);
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

    private static FrozenDictionary<string, string> BuildFloor(IReadOnlyList<IUIStringsSource>? packages)
    {
        if (packages is null || packages.Count == 0)
            return UIStrings.English;

        Dictionary<string, string> floor = new(UIStrings.English, StringComparer.Ordinal);

        for (var i = 0; i < packages.Count; i++)
        {
            ArgumentNullException.ThrowIfNull(packages[i]);

            foreach (KeyValuePair<string, string> word in packages[i].English)
            {
                // A package word is its own: two packages naming one key, or a package naming a framework key, is a mistake in the package, not a translation.
                if (!floor.TryAdd(word.Key, word.Value))
                    throw new InvalidOperationException($"Client string '{word.Key}' is defined more than once.");
            }
        }

        return floor.ToFrozenDictionary(StringComparer.Ordinal);
    }

    /// <inheritdoc />
    public string DefaultLanguage { get; }

    /// <inheritdoc />
    public IReadOnlyList<string> Languages => _languages;

    /// <summary>
    /// Translates a key using the requested language, then the default language, then the framework's own English
    /// (<see cref="UIStrings"/>), and returns the key when none of them has it.
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

        // Last, whatever the language: a framework or package word an application has not translated still reads, and the
        // application's own text in the default language outranks it.
        return _floor.TryGetValue(key, out value) ? value : key;
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
