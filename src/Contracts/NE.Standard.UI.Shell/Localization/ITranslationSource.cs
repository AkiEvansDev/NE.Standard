using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// Provides localized text values from a translation source.
/// </summary>
public interface ITranslationSource
{
    /// <summary>
    /// Gets languages available from the source.
    /// </summary>
    IReadOnlyList<string> Languages { get; }

    /// <summary>
    /// Attempts to translate a key for the specified language.
    /// </summary>
    bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? value);

    /// <summary>
    /// Lists every word the source has for <paramref name="language"/>, or <see langword="null"/> when it cannot list them.
    /// </summary>
    IReadOnlyDictionary<string, string>? ListWords(string language)
        => null;
}
