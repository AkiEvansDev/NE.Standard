using System;
using System.Collections.Generic;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// A CLDR plural category; a plural key's form is the key with the category's lower-case name after a dot (<c>files.few</c>).
/// </summary>
public enum UIPluralCategory
{
    /// <summary>The form for none, where a language has one of its own.</summary>
    Zero = 0,

    /// <summary>The form for one — and in some languages for 21, 31, … too.</summary>
    One = 1,

    /// <summary>The form for two, where a language has one of its own.</summary>
    Two = 2,

    /// <summary>The form for a few — 2 to 4 and their like in Slavic languages.</summary>
    Few = 3,

    /// <summary>The form for many — 5 to 20 and their like in Slavic languages, a round million in Romance ones.</summary>
    Many = 4,

    /// <summary>Every other number, and every number of a language with one form.</summary>
    Other = 5
}

/// <summary>
/// Chooses a number's CLDR cardinal plural category for a language — en, de, es, fr, ru, uk, pl and zh; any other language is
/// <see cref="UIPluralCategory.Other"/>.
/// </summary>
/// <remarks>
/// The rules of CLDR 48 (<c>plurals.xml</c>), over the operands n, i and v read off the number's shortest invariant text, so 1.5
/// has one visible fraction digit and 1.0 none. Twin of the client's <c>plural-rules.ts</c>, both pinned by
/// <c>eng/Tests/Shared/plural-corpus.json</c>.
/// </remarks>
public static class UIPluralRules
{
    /// <summary>
    /// The lower-case names a plural key's forms end in, in <see cref="UIPluralCategory"/>'s order: <c>zero</c> … <c>other</c>.
    /// </summary>
    public static IReadOnlyList<string> Forms { get; } = ["zero", "one", "two", "few", "many", "other"];

    /// <summary>
    /// The plural category of <paramref name="number"/> in <paramref name="language"/>, by its lower-cased primary subtag
    /// (<c>ru-RU</c> is <c>ru</c>, <c>zh-Hans</c> is <c>zh</c>).
    /// </summary>
    public static UIPluralCategory Select(string? language, double number)
    {
        if (!double.IsFinite(number))
            return UIPluralCategory.Other;

        var n = Math.Abs(number);
        var i = Math.Truncate(n);
        var v = VisibleFractionDigits(n);

        return PrimarySubtag(language) switch
        {
            "en" or "de" => i == 1 && v == 0 ? UIPluralCategory.One : UIPluralCategory.Other,
            "es" => n == 1 ? UIPluralCategory.One : IsMillions(i, v) ? UIPluralCategory.Many : UIPluralCategory.Other,
            "fr" => i is 0 or 1 ? UIPluralCategory.One : IsMillions(i, v) ? UIPluralCategory.Many : UIPluralCategory.Other,
            "ru" or "uk" => SelectEastSlavic(i, v),
            "pl" => SelectPolish(i, v),
            _ => UIPluralCategory.Other
        };
    }

    /// <summary>The key of a plural's form: its stem, a dot and the form's name (<c>files.few</c>); <see cref="TryReadForm"/> reads one back.</summary>
    public static string FormKey(string stem, UIPluralCategory category)
        => string.Concat(stem, ".", Forms[category is >= UIPluralCategory.Zero and <= UIPluralCategory.Other ? (int)category : (int)UIPluralCategory.Other]);

    /// <summary>
    /// Whether <see cref="Select"/> ever answers <paramref name="category"/> for <paramref name="language"/>: a form the language never
    /// picks is not one its table lacks, and one it picks is.
    /// </summary>
    /// <remarks>Pinned to <see cref="Select"/> over <c>plural-corpus.json</c> by a test, so a language added to one is added to both.</remarks>
    public static bool HasForm(string? language, UIPluralCategory category)
        => category == UIPluralCategory.Other || PrimarySubtag(language) switch
        {
            "en" or "de" => category == UIPluralCategory.One,
            "es" or "fr" => category is UIPluralCategory.One or UIPluralCategory.Many,
            "ru" or "uk" or "pl" => category is UIPluralCategory.One or UIPluralCategory.Few or UIPluralCategory.Many,
            _ => false
        };

    /// <summary>The category a key's last segment names (<c>files.few</c> is <see cref="UIPluralCategory.Few"/>); false for any other key.</summary>
    internal static bool TryReadForm(string key, out string stem, out UIPluralCategory category)
    {
        var dot = key.LastIndexOf('.');

        if (dot > 0)
        {
            ReadOnlySpan<char> suffix = key.AsSpan(dot + 1);

            for (var i = 0; i < Forms.Count; i++)
            {
                if (suffix.SequenceEqual(Forms[i]))
                {
                    stem = key[..dot];
                    category = (UIPluralCategory)i;
                    return true;
                }
            }
        }

        stem = key;
        category = UIPluralCategory.Other;
        return false;
    }

    /// <summary>The operand v: how many fraction digits the number's shortest text shows.</summary>
    private static int VisibleFractionDigits(double value)
    {
        if (value == Math.Truncate(value))
            return 0;

        UIScriptNumber.ShortestDigits(value, out var digits, out var point);

        return Math.Max(0, digits.Length - point);
    }

    private static string PrimarySubtag(string? language)
    {
        if (string.IsNullOrWhiteSpace(language))
            return string.Empty;

        var end = language.AsSpan().IndexOfAny('-', '_');

        return (end < 0 ? language : language[..end]).ToLowerInvariant();
    }

    // CLDR's "e = 0 and i != 0 and i % 1000000 = 0 and v = 0"; a number here never carries a compact exponent.
    private static bool IsMillions(double i, int v)
        => v == 0 && i != 0 && i % 1000000 == 0;

    private static UIPluralCategory SelectEastSlavic(double i, int v)
    {
        if (v != 0)
            return UIPluralCategory.Other;

        var i10 = i % 10;
        var i100 = i % 100;

        if (i10 == 1 && i100 != 11)
            return UIPluralCategory.One;

        return i10 is >= 2 and <= 4 && i100 is not (>= 12 and <= 14) ? UIPluralCategory.Few : UIPluralCategory.Many;
    }

    private static UIPluralCategory SelectPolish(double i, int v)
    {
        if (v != 0)
            return UIPluralCategory.Other;

        if (i == 1)
            return UIPluralCategory.One;

        var i10 = i % 10;
        var i100 = i % 100;

        return i10 is >= 2 and <= 4 && i100 is not (>= 12 and <= 14) ? UIPluralCategory.Few : UIPluralCategory.Many;
    }
}
