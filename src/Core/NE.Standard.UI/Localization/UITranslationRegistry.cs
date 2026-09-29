using System;
using System.Collections.Concurrent;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

internal sealed class UITranslationRegistry : ITranslator
{
    /// <summary>The framework's own prefix, a key under any <see cref="UILocalizationOptions.KeyPrefixes"/>.</summary>
    internal const string FrameworkPrefix = "ui.";

    private readonly ITranslationSource[] _sources;
    private readonly string[] _languages;
    private readonly FrozenSet<string> _listedLanguages;

    /// <summary>The English every word falls back to: the framework's and each package's, one table.</summary>
    private readonly FrozenDictionary<string, string> _floor;

    /// <summary>What a plain string must start with to be a key; empty when any string is one.</summary>
    private readonly string[] _keyPrefixes;

    private readonly UIMissingWords? _missing;

    // Held per listed language only, so a language no source names cannot grow it.
    private readonly ConcurrentDictionary<string, UIWordTable> _tables = new(StringComparer.Ordinal);

    public UITranslationRegistry(string defaultLanguage = "en", IReadOnlyList<ITranslationSource>? sources = null, IReadOnlyList<IUIStringsSource>? packages = null, IReadOnlyList<string>? keyPrefixes = null, UIMissingWords? missing = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(defaultLanguage);

        DefaultLanguage = defaultLanguage;

        _sources = sources is null || sources.Count == 0
            ? []
            : [.. sources];

        _languages = BuildLanguages(defaultLanguage, _sources);
        _listedLanguages = _languages.ToFrozenSet(StringComparer.Ordinal);
        _floor = UIStrings.List(packages);
        _keyPrefixes = BuildKeyPrefixes(keyPrefixes);
        _missing = missing;
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

    private static string[] BuildKeyPrefixes(IReadOnlyList<string>? keyPrefixes)
    {
        if (keyPrefixes is null || keyPrefixes.Count == 0)
            return [];

        HashSet<string> prefixes = new(StringComparer.Ordinal) { FrameworkPrefix };

        for (var i = 0; i < keyPrefixes.Count; i++)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(keyPrefixes[i]);
            _ = prefixes.Add(keyPrefixes[i]);
        }

        return [.. prefixes];
    }

    /// <inheritdoc />
    public string DefaultLanguage { get; }

    /// <inheritdoc />
    public IReadOnlyList<string> Languages => _languages;

    /// <inheritdoc />
    public bool HasLanguage(string language)
        => _listedLanguages.Contains(language);

    /// <inheritdoc />
    public bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? words)
    {
        words = null;

        return !string.IsNullOrWhiteSpace(key) && TryLookup(EffectiveLanguage(language), key, out words, out _);
    }

    /// <inheritdoc />
    /// <remarks>
    /// The requested language, then the default language, then the framework's own English (<see cref="UIStrings"/>); the value itself
    /// when none of them has it, or at once when prefixes are configured and the value starts with none of them.
    /// </remarks>
    public string? Translate(string language, string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
            return key;

        if (_keyPrefixes.Length > 0 && !HasKeyPrefix(key))
            return key;

        var effectiveLanguage = EffectiveLanguage(language);

        if (TryLookup(effectiveLanguage, key, out var value, out var inLanguage))
        {
            if (!inLanguage)
                RecordMissing(effectiveLanguage, key, fellToKey: false);

            return value;
        }

        RecordMissing(effectiveLanguage, key, fellToKey: true);

        return key;
    }

    private bool HasKeyPrefix(string key)
    {
        for (var i = 0; i < _keyPrefixes.Length; i++)
        {
            if (key.StartsWith(_keyPrefixes[i], StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    private string EffectiveLanguage(string language)
        => string.IsNullOrWhiteSpace(language) ? DefaultLanguage : language;

    /// <summary>
    /// The language asked, then the default language, then the English floor; <paramref name="inLanguage"/> says whether the
    /// language asked had it.
    /// </summary>
    private bool TryLookup(string language, string key, [NotNullWhen(true)] out string? value, out bool inLanguage)
    {
        inLanguage = true;

        if (TryTranslateInSources(language, key, out value))
            return true;

        inLanguage = false;

        if (!string.Equals(language, DefaultLanguage, StringComparison.Ordinal) && TryTranslateInSources(DefaultLanguage, key, out value))
            return true;

        // Last, whatever the language: a framework or package word an application has not translated still reads, and the
        // application's own text in the default language outranks it.
        return _floor.TryGetValue(key, out value);
    }

    private bool TryTranslateInSources(string language, string key, [NotNullWhen(true)] out string? value)
    {
        for (var i = _sources.Length - 1; i >= 0; i--)
        {
            if (_sources[i].TryTranslate(language, key, out value))
                return true;
        }

        value = null;
        return false;
    }

    /// <summary>
    /// Records a word no source has in the language asked: any such word in another language than the default; in the default
    /// language only a prefixed key that fell to itself, since there any other string may be content.
    /// </summary>
    private void RecordMissing(string language, string key, bool fellToKey)
    {
        if (_missing is null)
            return;

        if (!string.Equals(language, DefaultLanguage, StringComparison.Ordinal) || (fellToKey && _keyPrefixes.Length > 0 && HasKeyPrefix(key)))
            _missing.Record(language, key);
    }

    /// <inheritdoc />
    /// <remarks>
    /// The plural form is looked up as a plain value is, each of <c>key.{category}</c>, <c>key.other</c> and the key through the
    /// whole precedence, so a page translating by <see cref="ListWords"/> picks the same form; a miss is the key's, once.
    /// </remarks>
    public string? Translate(string language, string? key, IReadOnlyDictionary<string, object?>? arguments)
    {
        if (string.IsNullOrWhiteSpace(key))
            return key;

        var effectiveLanguage = EffectiveLanguage(language);
        var template = UIWords.TryReadCount(arguments, out var count)
            ? LookupPlural(effectiveLanguage, key, count)
            : LookupKey(effectiveLanguage, key);

        return UIWords.Format(template, arguments, nested => (nested.IsText ? Translate(effectiveLanguage, nested.Key) : Translate(effectiveLanguage, nested.Key, nested.Arguments)) ?? nested.Key);
    }

    private string LookupPlural(string language, string key, double count)
    {
        var form = string.Concat(key, ".", UIPluralRules.Suffix(UIPluralRules.Select(language, count)));

        if (TryLookup(language, form, out var value, out var inLanguage) || TryLookup(language, key + ".other", out value, out inLanguage))
        {
            if (!inLanguage)
                RecordMissing(language, key, fellToKey: false);

            return value;
        }

        return LookupKey(language, key);
    }

    private string LookupKey(string language, string key)
    {
        if (TryLookup(language, key, out var value, out var inLanguage))
        {
            if (!inLanguage)
                RecordMissing(language, key, fellToKey: false);

            return value;
        }

        // A key asked for by name is a key whatever the prefixes, so falling to itself is a miss in any language.
        if (_missing is not null && (_keyPrefixes.Length > 0 || !string.Equals(language, DefaultLanguage, StringComparison.Ordinal)))
            _missing.Record(language, key);

        return key;
    }

    /// <summary>
    /// The words for <paramref name="language"/> exactly as <see cref="Translate(string, string?)"/> answers them: the English
    /// floor, the default language's words over it, the language's own over those; complete when every source could list.
    /// </summary>
    public UIWordTable ListWords(string language)
    {
        var effectiveLanguage = EffectiveLanguage(language);

        return _listedLanguages.Contains(effectiveLanguage)
            ? _tables.GetOrAdd(effectiveLanguage, BuildTable)
            : BuildTable(effectiveLanguage);
    }

    private UIWordTable BuildTable(string language)
    {
        Dictionary<string, string> words = new(_floor, StringComparer.Ordinal);
        var complete = true;

        complete &= Overlay(words, DefaultLanguage, own: null);

        HashSet<string>? own = null;

        if (!string.Equals(language, DefaultLanguage, StringComparison.Ordinal))
        {
            own = new HashSet<string>(StringComparer.Ordinal);
            complete &= Overlay(words, language, own);
        }

        if (_missing is not null && own is not null)
        {
            foreach (var key in words.Keys)
            {
                if (!own.Contains(key) && !IsFormNeverPicked(language, key, words))
                    _missing.Record(language, key);
            }

            RecordMissingForms(_missing, language, words);
        }

        return new UIWordTable(words.ToFrozenDictionary(StringComparer.Ordinal), complete, _keyPrefixes);
    }

    /// <summary>
    /// Lays each source's words for a language over <paramref name="words"/>, later sources winning as they do in a lookup;
    /// answers whether every source could list.
    /// </summary>
    private bool Overlay(Dictionary<string, string> words, string language, HashSet<string>? own)
    {
        var complete = true;

        for (var i = 0; i < _sources.Length; i++)
        {
            IReadOnlyDictionary<string, string>? listed = _sources[i].ListWords(language);

            if (listed is null)
            {
                complete = false;
                continue;
            }

            foreach (KeyValuePair<string, string> word in listed)
            {
                words[word.Key] = word.Value;
                _ = own?.Add(word.Key);
            }
        }

        return complete;
    }

    /// <summary>
    /// Whether a key is a plural form the language never picks (zh's <c>files.one</c>), beside a sibling a lookup does reach — the
    /// plural's <c>.other</c> or the key itself.
    /// </summary>
    private static bool IsFormNeverPicked(string language, string key, Dictionary<string, string> words)
        => UIPluralRules.TryReadForm(key, out var stem, out UIPluralCategory category)
            && !UIPluralRules.HasForm(language, category)
            && (words.ContainsKey(stem + ".other") || words.ContainsKey(stem));

    /// <summary>
    /// Records each plural form the language picks and no table holds — ru's <c>files.few</c> beside English's <c>.one</c>/<c>.other</c>:
    /// the floor never lists it, and a lookup falls to the language's own <c>.other</c> without a word.
    /// </summary>
    private static void RecordMissingForms(UIMissingWords missing, string language, Dictionary<string, string> words)
    {
        const string OtherSuffix = ".other";

        foreach (var key in words.Keys)
        {
            if (!key.EndsWith(OtherSuffix, StringComparison.Ordinal))
                continue;

            var stem = key[..^OtherSuffix.Length];

            for (UIPluralCategory category = UIPluralCategory.Zero; category < UIPluralCategory.Other; category++)
            {
                if (!UIPluralRules.HasForm(language, category))
                    continue;

                // A form some table lists is the loop above's to judge.
                var form = string.Concat(stem, ".", UIPluralRules.Suffix(category));

                if (!words.ContainsKey(form))
                    missing.Record(language, form);
            }
        }
    }
}
