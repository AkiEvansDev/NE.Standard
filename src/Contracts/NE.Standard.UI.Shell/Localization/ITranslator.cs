using System.Collections.Generic;

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
    /// Translates a key for the specified language.
    /// </summary>
    string? Translate(string language, string? key);
}
