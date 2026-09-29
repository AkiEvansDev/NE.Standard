using System;
using System.Text;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>How a name written in code is read as words, for a caption an author did not write.</summary>
public static class UINaming
{
    /// <summary>Reads a name as words: <c>InProgress</c> as "In progress".</summary>
    /// <remarks>
    /// A capital inside the name starts a new word, lower-cased; a run of capitals is an acronym, kept as it is and split from the word
    /// after it — <c>UICalculatorOperation</c> as "UI calculator operation", <c>ParseHTML</c> as "Parse HTML", <c>URLs</c> as it stands,
    /// <c>UIIsReady</c> as "UI is ready". An acronym's plural before another word is read as "is" or "as" where its last letter is I or A:
    /// <c>APIsCount</c> reads "AP is count", the price of <c>UIIsReady</c> and <c>PDFAsImage</c> reading right.
    /// </remarks>
    public static string Humanize(string name)
    {
        ArgumentNullException.ThrowIfNull(name);

        StringBuilder words = new(name.Length + 4);

        for (var i = 0; i < name.Length; i++)
        {
            var current = name[i];

            if (i == 0 || !StartsWord(name, i))
            {
                _ = words.Append(current);
                continue;
            }

            _ = words.Append(' ');
            // An acronym keeps its capitals; a word is lower-cased as a sentence's would be.
            _ = words.Append(IsAcronymAt(name, i) ? current : char.ToLowerInvariant(current));
        }

        return words.ToString();
    }

    /// <summary>
    /// A capital after anything but a capital, or the last capital of a run when a word follows it (the "C" of "UICalculator") — but
    /// not an acronym's plural "s" ("URLs").
    /// </summary>
    private static bool StartsWord(string name, int index)
    {
        if (!char.IsUpper(name[index]))
            return false;

        if (!char.IsUpper(name[index - 1]))
            return true;

        return index + 1 < name.Length && char.IsLower(name[index + 1]) && !IsPluralTail(name, index + 1);
    }

    /// <summary>A lone "s" closing a word: "URLs", "IDsCount" — but not the "s" of "Is" or "As" before another word ("UIIsReady").</summary>
    private static bool IsPluralTail(string name, int index)
    {
        if (name[index] != 's')
            return false;

        if (index + 1 == name.Length)
            return true;

        return !char.IsLower(name[index + 1]) && !(name[index - 1] is 'I' or 'A' && char.IsUpper(name[index + 1]));
    }

    /// <summary>Whether the word starting at a capital is a run of capitals rather than a capital and its lower-case letters.</summary>
    private static bool IsAcronymAt(string name, int index)
        => index + 1 < name.Length && char.IsUpper(name[index + 1]);
}
