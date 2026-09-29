using System;
using System.Collections.Frozen;
using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// Every word a translator can list for one language, what a page translates by on its own.
/// </summary>
public sealed record UIWordTable
{
    /// <summary>
    /// Creates a table from its words, whether they are all there is, and the prefixes a plain string must start with.
    /// </summary>
    public UIWordTable(IReadOnlyDictionary<string, string> words, bool complete, IReadOnlyList<string>? keyPrefixes = null)
    {
        ArgumentNullException.ThrowIfNull(words);

        Words = words;
        Complete = complete;
        KeyPrefixes = keyPrefixes ?? [];
    }

    /// <summary>
    /// The table of a translator that cannot list its words.
    /// </summary>
    public static UIWordTable Unlisted { get; } = new(FrozenDictionary<string, string>.Empty, complete: false);

    /// <summary>
    /// Gets the words by key as the translator answers them for the language: its own over the default language's over the
    /// framework's English.
    /// </summary>
    public IReadOnlyDictionary<string, string> Words { get; }

    /// <summary>
    /// Gets whether every source listed its words; when not, a key the table lacks may still translate.
    /// </summary>
    public bool Complete { get; }

    /// <summary>
    /// Gets the prefixes a plain string must start with to be looked up; empty when any string is a key.
    /// </summary>
    public IReadOnlyList<string> KeyPrefixes { get; }
}
