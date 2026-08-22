using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// The locale-dependent text a formatted temporal value needs, resolved once from a
/// <see cref="CultureInfo"/> and handed to the client alongside the value.
/// </summary>
/// <remarks>
/// Only *text* lives here. It is what keeps the duplicated formatter from having to know anything about
/// locales: .NET stays the single source for month and day names, the client only assembles them.
/// </remarks>
public sealed record WebTemporalCulturePack(
    IReadOnlyList<string> MonthNames,
    IReadOnlyList<string> MonthGenitiveNames,
    IReadOnlyList<string> AbbreviatedMonthNames,
    IReadOnlyList<string> DayNames,
    IReadOnlyList<string> AbbreviatedDayNames,
    string AmDesignator,
    string PmDesignator)
{
    /// <summary>
    /// Builds the pack for <paramref name="culture"/>. Month arrays are trimmed to twelve — .NET returns
    /// thirteen for calendars with a leap month, and the client indexes by month number.
    /// </summary>
    /// <remarks>
    /// Both month forms are carried because inflected languages need them: "апрель" standing alone, but
    /// "3 апреля" next to a day number. .NET picks between them from the pattern, and
    /// <see cref="WebTemporalFormat"/> reproduces that rule on both sides rather than shipping one form and
    /// rendering half the formats ungrammatically.
    /// </remarks>
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
/// Deliberately does <em>not</em> delegate to <c>DateTime.ToString(format, culture)</c>. The client cannot
/// reproduce .NET's full format semantics, and a <c>DisplayFormat</c> that renders one way server-side and
/// another way after the first client update is the precise failure duplicating a formatter invites. Both
/// sides are therefore held to the same small set, and anything outside it is emitted literally rather
/// than interpreted differently by each.
/// </remarks>
public static class WebTemporalFormat
{
    /// <summary>
    /// The supported tokens, longest first — the order matters, since matching is greedy and "MMMM" must
    /// win over "MMM". Kept as data so the drift guard can compare it against the client's own table.
    /// </summary>
    public static readonly string[] Tokens =
    [
        "MMMM", "dddd", "yyyy", "MMM", "ddd", "dd", "MM", "yy", "HH", "hh", "mm", "ss", "tt", "d", "M", "H", "h", "m", "s"
    ];

    /// <summary>
    /// Formats <paramref name="value"/> against <paramref name="format"/>. A null or empty format returns
    /// the invariant round-trip form, which is what the field shows when no <c>DisplayFormat</c> is set.
    /// </summary>
    public static string Format(DateTime value, string? format, WebTemporalCulturePack culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        if (string.IsNullOrWhiteSpace(format))
            return value.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture).TrimEnd();

        StringBuilder result = new(format.Length + 8);
        var genitiveMonth = HasDayNumberToken(format);

        for (var index = 0; index < format.Length;)
        {
            var token = MatchToken(format, index);

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
    /// Whether the format names a day <em>number</em> ("d"/"dd", not the weekday names "ddd"/"dddd") — which
    /// is what decides between the two month forms in an inflected language, the same way .NET's own pattern
    /// handling does. Tokenized rather than scanned for a bare 'd' so a literal, or a "dddd" weekday, cannot
    /// be mistaken for one.
    /// </summary>
    private static bool HasDayNumberToken(string format)
    {
        for (var index = 0; index < format.Length;)
        {
            var token = MatchToken(format, index);

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

    private static string? MatchToken(string format, int index)
    {
        for (var i = 0; i < Tokens.Length; i++)
        {
            var token = Tokens[i];

            if (index + token.Length <= format.Length && string.CompareOrdinal(format, index, token, 0, token.Length) == 0)
                return token;
        }

        return null;
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
}
