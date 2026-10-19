using System;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Extensions;

/// <summary>The presets' one check of the words they are given: a key, a key with its arguments or an author's text, never blank.</summary>
internal static class PresetWords
{
    /// <summary>Refuses missing words and an author's text with nothing in it; a key's own words are the translator's.</summary>
    public static void Require([NotNull] UIPhrase? words, [CallerArgumentExpression(nameof(words))] string? name = null)
    {
        ArgumentNullException.ThrowIfNull(words, name);

        if (!UIPhrase.HasWords(words))
            throw new ArgumentException("The words are blank.", name);
    }

    /// <summary>The same for words that may be left out: refused only when given and blank.</summary>
    public static void RequireIfGiven(UIPhrase? words, [CallerArgumentExpression(nameof(words))] string? name = null)
    {
        if (words is not null)
            Require(words, name);
    }
}
