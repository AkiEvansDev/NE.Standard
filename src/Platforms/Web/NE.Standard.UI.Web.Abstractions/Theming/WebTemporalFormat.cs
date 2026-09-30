using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// The locale-dependent text a formatted temporal value needs, resolved once from a
/// <see cref="CultureInfo"/> and handed to the client alongside the value.
/// </summary>
/// <remarks>Text only: .NET stays the single source for month and day names, the client only assembles them.</remarks>
public sealed record WebTemporalCulturePack(IReadOnlyList<string> MonthNames, IReadOnlyList<string> MonthGenitiveNames, IReadOnlyList<string> AbbreviatedMonthNames, IReadOnlyList<string> DayNames, IReadOnlyList<string> AbbreviatedDayNames, string AmDesignator, string PmDesignator)
{
    /// <summary>
    /// Builds the pack for <paramref name="culture"/>; month arrays are trimmed to twelve, since .NET returns
    /// thirteen for a leap-month calendar and the client indexes by month number.
    /// </summary>
    /// <remarks>Both month forms are carried because an inflected language needs each in a different pattern.</remarks>
    public static WebTemporalCulturePack FromCulture(CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        DateTimeFormatInfo format = culture.DateTimeFormat;

        return new WebTemporalCulturePack(
            [.. format.MonthNames[..12]],
            [.. format.MonthGenitiveNames[..12]],
            [.. format.AbbreviatedMonthNames[..12]],
            [.. format.DayNames],
            [.. format.AbbreviatedDayNames],
            format.AMDesignator,
            format.PMDesignator);
    }
}

/// <summary>
/// Formats a temporal value against the <b>documented token subset</b> shared with the TypeScript client
/// (<c>temporal-format.ts</c>); <c>TemporalFormatSyncTests</c> keeps the two token tables in step.
/// </summary>
/// <remarks>
/// Deliberately not <c>DateTime.ToString(format, culture)</c>: the client cannot reproduce .NET's full
/// semantics, so anything outside the shared subset is emitted literally on both sides.
/// </remarks>
public static class WebTemporalFormat
{
    /// <summary>The supported tokens, longest first: <see cref="UITemporalPattern.Tokens"/>, which the application's patterns are checked by.</summary>
    public static readonly string[] Tokens = [.. UITemporalPattern.Tokens];

    /// <summary>Formats <paramref name="value"/>; a null or empty format returns the invariant round-trip form.</summary>
    public static string Format(DateTime value, string? format, WebTemporalCulturePack culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        if (string.IsNullOrWhiteSpace(format))
            return value.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture).TrimEnd();

        StringBuilder result = new(format.Length + 8);
        var genitiveMonth = HasDayNumberToken(format);

        for (var index = 0; index < format.Length;)
        {
            var token = UITemporalPattern.Match(format, index);

            if (token is null)
            {
                _ = result.Append(format[index]);
                index++;
                continue;
            }

            _ = result.Append(Render(token, value, culture, genitiveMonth));
            index += token.Length;
        }

        return result.ToString();
    }

    /// <summary>
    /// Whether the format names a day number ("d"/"dd", not "ddd"/"dddd"), which chooses between the two
    /// month forms; tokenized rather than scanned so a literal 'd' cannot be mistaken for one.
    /// </summary>
    private static bool HasDayNumberToken(string format)
    {
        for (var index = 0; index < format.Length;)
        {
            var token = UITemporalPattern.Match(format, index);

            if (token is null)
            {
                index++;
                continue;
            }

            if (token is "d" or "dd")
                return true;

            index += token.Length;
        }

        return false;
    }

    private static string Render(string token, DateTime value, WebTemporalCulturePack culture, bool genitiveMonth)
    {
        var hour12 = value.Hour % 12 == 0 ? 12 : value.Hour % 12;

        return token switch
        {
            "yyyy" => value.Year.ToString("D4", CultureInfo.InvariantCulture),
            "yy" => (value.Year % 100).ToString("D2", CultureInfo.InvariantCulture),
            "MMMM" => genitiveMonth ? culture.MonthGenitiveNames[value.Month - 1] : culture.MonthNames[value.Month - 1],
            "MMM" => culture.AbbreviatedMonthNames[value.Month - 1],
            "MM" => value.Month.ToString("D2", CultureInfo.InvariantCulture),
            "M" => value.Month.ToString(CultureInfo.InvariantCulture),
            "dddd" => culture.DayNames[(int)value.DayOfWeek],
            "ddd" => culture.AbbreviatedDayNames[(int)value.DayOfWeek],
            "dd" => value.Day.ToString("D2", CultureInfo.InvariantCulture),
            "d" => value.Day.ToString(CultureInfo.InvariantCulture),
            "HH" => value.Hour.ToString("D2", CultureInfo.InvariantCulture),
            "H" => value.Hour.ToString(CultureInfo.InvariantCulture),
            "hh" => hour12.ToString("D2", CultureInfo.InvariantCulture),
            "h" => hour12.ToString(CultureInfo.InvariantCulture),
            "mm" => value.Minute.ToString("D2", CultureInfo.InvariantCulture),
            "m" => value.Minute.ToString(CultureInfo.InvariantCulture),
            "ss" => value.Second.ToString("D2", CultureInfo.InvariantCulture),
            "s" => value.Second.ToString(CultureInfo.InvariantCulture),
            "tt" => value.Hour < 12 ? culture.AmDesignator : culture.PmDesignator,
            _ => token
        };
    }

    /// <summary>
    /// A field's placeholder for a format: each token written as its unit's letter, as many times as the token is long — a 12-hour
    /// hour's in lower case — and the rest as it stands. <c>temporalPlaceholder</c> is the client's port.
    /// </summary>
    public static string Placeholder(string format, WebTemporalLetters letters)
    {
        ArgumentNullException.ThrowIfNull(format);
        ArgumentNullException.ThrowIfNull(letters);

        StringBuilder result = new(format.Length);

        for (var index = 0; index < format.Length;)
        {
            var token = UITemporalPattern.Match(format, index);

            if (token is null)
            {
                _ = result.Append(format[index]);
                index++;
                continue;
            }

            var letter = PlaceholderLetter(token, letters);

            for (var i = 0; i < token.Length; i++)
                _ = result.Append(letter);

            index += token.Length;
        }

        return result.ToString();
    }

    private static string PlaceholderLetter(string token, WebTemporalLetters letters)
        => token[0] switch
        {
            'y' => letters.Year,
            'M' => letters.Month,
            'd' => letters.Day,
            'H' => letters.Hour,
            'h' => letters.Hour.ToLowerInvariant(),
            'm' => letters.Minute,
            's' => letters.Second,
            // The meridiem stays as it is written: its words are the culture's, not a letter's.
            _ => token[..1]
        };
}

/// <summary>What a format's letters read as in a field's placeholder, one per unit: <c>dd.MM.yyyy</c> shown as <c>дд.ММ.гггг</c>.</summary>
public sealed record WebTemporalLetters(string Year, string Month, string Day, string Hour, string Minute, string Second)
{
    /// <summary>The letters the format itself is written in: a placeholder that reads as the format.</summary>
    public static WebTemporalLetters Invariant { get; } = new("y", "M", "d", "H", "m", "s");

    /// <summary>The letters in the page's words (<c>ui.picker.letter.*</c>); a word that comes back empty keeps the format's letter.</summary>
    public static WebTemporalLetters FromWords(Func<string, string> translate)
    {
        ArgumentNullException.ThrowIfNull(translate);

        return new(
            Letter(translate, UIStrings.PickerLetterYear, Invariant.Year),
            Letter(translate, UIStrings.PickerLetterMonth, Invariant.Month),
            Letter(translate, UIStrings.PickerLetterDay, Invariant.Day),
            Letter(translate, UIStrings.PickerLetterHour, Invariant.Hour),
            Letter(translate, UIStrings.PickerLetterMinute, Invariant.Minute),
            Letter(translate, UIStrings.PickerLetterSecond, Invariant.Second)
        );
    }

    private static string Letter(Func<string, string> translate, string key, string fallback)
    {
        var letter = translate(key);

        return string.IsNullOrWhiteSpace(letter) ? fallback : letter;
    }
}
