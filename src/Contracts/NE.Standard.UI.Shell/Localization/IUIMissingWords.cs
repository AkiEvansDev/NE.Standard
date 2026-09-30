using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The words a page asked for that no source has in the language asked, and under key prefixes the static text a view shows as
/// written where it may have meant a key — collected while <c>UILocalizationOptions.ReportMissingWords</c> is on, each logged once.
/// </summary>
/// <remarks>
/// Exact only under <c>UILocalizationOptions.KeyPrefixes</c>: without them any string on a translatable property is a key, so
/// English-as-key content shows up too.
/// </remarks>
public interface IUIMissingWords
{
    /// <summary>
    /// The missing words recorded so far, each once, in the order they were first missed.
    /// </summary>
    IReadOnlyList<UIMissingWord> Snapshot();

    /// <summary>
    /// Forgets every word recorded, so the next miss of one is recorded and logged again.
    /// </summary>
    void Clear();
}

/// <summary>
/// A key a page asked for in a language no source has it in, or (<see cref="UIMissingWordKind.Unkeyed"/>) a view's static text that
/// is no key.
/// </summary>
public sealed record UIMissingWord(string Language, string Key)
{
    /// <summary>
    /// What is missing: a word for the key, or a key for the text; an unkeyed text's <see cref="Language"/> is empty, since every
    /// language shows it as written.
    /// </summary>
    public UIMissingWordKind Kind { get; init; }
}

/// <summary>
/// What a <see cref="UIMissingWord"/> lacks.
/// </summary>
public enum UIMissingWordKind
{
    /// <summary>A key no source has a word for in the language asked.</summary>
    Untranslated = 0,

    /// <summary>
    /// Static text on a translatable property, under key prefixes, that starts with none and is not marked content: shown as written
    /// in every language, where the author may have meant a key.
    /// </summary>
    Unkeyed = 1
}
