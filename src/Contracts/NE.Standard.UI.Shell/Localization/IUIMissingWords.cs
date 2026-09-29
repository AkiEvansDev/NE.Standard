using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The words a page asked for that no source has in the language asked — collected while
/// <c>UILocalizationOptions.ReportMissingWords</c> is on, each logged once.
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
/// A key a page asked for in a language no source has it in.
/// </summary>
public sealed record UIMissingWord(string Language, string Key);
