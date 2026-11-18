#pragma warning disable IDE0130 // Kept in NE.Standard.UI.Web.Abstractions.Theming for 2.x [TypeForwardedTo] binary compatibility.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// Locale-dependent number-formatting text (separators, group sizes, currency/percent symbols) resolved once from a
/// <see cref="CultureInfo"/> and sent to the client as <c>data-ui-number-culture</c>. .NET stays the single source of the values.
/// </summary>
public sealed record WebNumberCulturePack(string DecimalSeparator, string GroupSeparator, IReadOnlyList<int> GroupSizes, string NegativeSign, int NegativePattern, int DecimalDigits, string CurrencySymbol, string CurrencyDecimalSeparator, string CurrencyGroupSeparator, IReadOnlyList<int> CurrencyGroupSizes, int CurrencyDecimalDigits, int CurrencyPositivePattern, int CurrencyNegativePattern, string PercentSymbol, string PercentDecimalSeparator, string PercentGroupSeparator, IReadOnlyList<int> PercentGroupSizes, int PercentDecimalDigits, int PercentPositivePattern, int PercentNegativePattern)
{
    /// <summary>Builds the number culture pack for <paramref name="culture"/>.</summary>
    public static WebNumberCulturePack FromCulture(CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        NumberFormatInfo info = culture.NumberFormat;

        return new WebNumberCulturePack(
            info.NumberDecimalSeparator,
            info.NumberGroupSeparator,
            [.. info.NumberGroupSizes],
            info.NegativeSign,
            info.NumberNegativePattern,
            info.NumberDecimalDigits,
            info.CurrencySymbol,
            info.CurrencyDecimalSeparator,
            info.CurrencyGroupSeparator,
            [.. info.CurrencyGroupSizes],
            info.CurrencyDecimalDigits,
            info.CurrencyPositivePattern,
            info.CurrencyNegativePattern,
            info.PercentSymbol,
            info.PercentDecimalSeparator,
            info.PercentGroupSeparator,
            [.. info.PercentGroupSizes],
            info.PercentDecimalDigits,
            info.PercentPositivePattern,
            info.PercentNegativePattern);
    }

    /// <summary>The pack as .NET reads it back, so a value formats on the server exactly as the culture it came from would.</summary>
    public NumberFormatInfo ToNumberFormatInfo()
        => new()
        {
            NumberDecimalSeparator = DecimalSeparator,
            NumberGroupSeparator = GroupSeparator,
            NumberGroupSizes = [.. GroupSizes],
            NegativeSign = NegativeSign,
            NumberNegativePattern = NegativePattern,
            NumberDecimalDigits = DecimalDigits,
            CurrencySymbol = CurrencySymbol,
            CurrencyDecimalSeparator = CurrencyDecimalSeparator,
            CurrencyGroupSeparator = CurrencyGroupSeparator,
            CurrencyGroupSizes = [.. CurrencyGroupSizes],
            CurrencyDecimalDigits = CurrencyDecimalDigits,
            CurrencyPositivePattern = CurrencyPositivePattern,
            CurrencyNegativePattern = CurrencyNegativePattern,
            PercentSymbol = PercentSymbol,
            PercentDecimalSeparator = PercentDecimalSeparator,
            PercentGroupSeparator = PercentGroupSeparator,
            PercentGroupSizes = [.. PercentGroupSizes],
            PercentDecimalDigits = PercentDecimalDigits,
            PercentPositivePattern = PercentPositivePattern,
            PercentNegativePattern = PercentNegativePattern
        };
}

/// <summary>
/// The locale-dependent text a formatted temporal value needs, resolved once from a <see cref="CultureInfo"/> and handed to the client alongside the value.
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
/// Date and time patterns in the shared token subset — the framework's own, or a culture's — under the application's <see cref="UITemporalOptions"/>.
/// </summary>
/// <remarks>
/// Normalised from .NET's patterns: a year is always four digits, since the picker reads and writes every year there is; a quoted
/// literal is written without its quotes, the shared formatter having none; and a pattern the subset cannot hold falls back to the
/// canonical form.
/// </remarks>
public sealed record WebTemporalPatterns(string Date, string ShortTime, string LongTime)
{
    /// <summary>
    /// The wire's own forms: the framework's default where the culture is not followed, the invariant culture's, and the fallback for
    /// any pattern the subset cannot hold.
    /// </summary>
    public static WebTemporalPatterns Canonical { get; } = new("yyyy-MM-dd", "HH:mm", "HH:mm:ss");

    /// <summary>The patterns of <paramref name="culture"/>; the invariant culture's are the wire's own.</summary>
    public static WebTemporalPatterns FromCulture(CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        if (culture.Name.Length == 0)
            return Canonical;

        DateTimeFormatInfo format = culture.DateTimeFormat;

        return new WebTemporalPatterns(
            Normalize(format.ShortDatePattern, Canonical.Date, isTime: false),
            Normalize(format.ShortTimePattern, Canonical.ShortTime, isTime: true),
            Normalize(format.LongTimePattern, Canonical.LongTime, isTime: true)
        );
    }

    /// <summary>
    /// What a field in <paramref name="culture"/> shows with no pattern of its own, under the application's options.
    /// </summary>
    public static WebTemporalPatterns Resolve(CultureInfo culture, UITemporalOptions? options, bool ownCulture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        WebTemporalPatterns patterns = ownCulture || options?.FollowCulture == true ? FromCulture(culture) : Canonical;

        if (options is null)
            return patterns;

        var date = options.DateFormat ?? patterns.Date;

        if (options.TimeFormat is string time)
            return new WebTemporalPatterns(date, time, WithSeconds(time));

        return options.HourCycle switch
        {
            UIHourCycle.TwentyFourHour => new WebTemporalPatterns(date, TwentyFourHour(patterns.ShortTime, Canonical.ShortTime), TwentyFourHour(patterns.LongTime, Canonical.LongTime)),
            UIHourCycle.TwelveHour => new WebTemporalPatterns(date, TwelveHour(patterns.ShortTime), TwelveHour(patterns.LongTime)),
            _ => patterns with { Date = date }
        };
    }

    /// <summary>A time pattern to the second: as it is where it names seconds, else with them after the minutes, by the minutes' own separator.</summary>
    public static string WithSeconds(string time)
    {
        ArgumentNullException.ThrowIfNull(time);

        if (time.Contains('s', StringComparison.Ordinal))
            return time;

        var minutes = time.IndexOf('m', StringComparison.Ordinal);

        if (minutes < 0)
            return time;

        var end = minutes;

        while (end < time.Length && time[end] == 'm')
            end++;

        var separator = minutes > 0 && !char.IsAsciiLetterOrDigit(time[minutes - 1]) && !char.IsWhiteSpace(time[minutes - 1]) ? time[minutes - 1] : ':';

        return string.Concat(time.AsSpan(0, end), $"{separator}ss", time.AsSpan(end));
    }

    private static string TwentyFourHour(string time, string fallback)
    {
        if (!UITemporalPattern.IsTwelveHour(time))
            return time;

        var counted = time.Replace("tt", string.Empty, StringComparison.Ordinal).Replace('h', 'H').Trim();

        while (counted.Contains("  ", StringComparison.Ordinal))
            counted = counted.Replace("  ", " ", StringComparison.Ordinal);

        return UITemporalPattern.IsComplete(counted, isTime: true) ? counted : fallback;
    }

    private static string TwelveHour(string time)
    {
        if (UITemporalPattern.IsTwelveHour(time))
            return time;

        var counted = time.Replace('H', 'h');

        return counted.Contains("tt", StringComparison.Ordinal) ? counted : $"{counted} tt";
    }

    /// <summary>The time a field shows: to the second when its step reaches seconds, else to the minute.</summary>
    public string Time(bool seconds)
        => seconds ? LongTime : ShortTime;

    /// <summary>A day and its time, as a date-time field and a timestamp show them; mirrors <c>dateTimePattern</c> in <c>temporal-format.ts</c>.</summary>
    public string DateTime(bool seconds)
        => $"{Date} {Time(seconds)}";

    /// <summary>
    /// A .NET pattern in the shared subset, or <paramref name="fallback"/> where it names what the subset cannot write, a quoted literal
    /// holds a token's letter, or it lacks a part a date or a time needs.
    /// </summary>
    public static string Normalize(string pattern, string fallback, bool isTime)
    {
        ArgumentNullException.ThrowIfNull(pattern);
        ArgumentNullException.ThrowIfNull(fallback);

        StringBuilder result = new(pattern.Length + 2);

        for (var index = 0; index < pattern.Length;)
        {
            var current = pattern[index];

            if (current is '\'' or '"')
            {
                var close = pattern.IndexOf(current, index + 1, StringComparison.Ordinal);

                if (close < 0 || HasTokenLetter(pattern.AsSpan(index + 1, close - index - 1)))
                    return fallback;

                _ = result.Append(pattern, index + 1, close - index - 1);
                index = close + 1;
                continue;
            }

            if (current == '\\')
            {
                if (index + 1 >= pattern.Length || IsTokenLetter(pattern[index + 1]))
                    return fallback;

                _ = result.Append(pattern[index + 1]);
                index += 2;
                continue;
            }

            if (!char.IsAsciiLetter(current))
            {
                _ = result.Append(char.IsWhiteSpace(current) ? ' ' : current);
                index++;
                continue;
            }

            var run = 1;

            while (index + run < pattern.Length && pattern[index + run] == current)
                run++;

            switch (current)
            {
                case 'y':
                    _ = result.Append("yyyy");
                    break;
                case 'M' or 'd':
                    _ = result.Append(current, Math.Min(run, 4));
                    break;
                case 'H' or 'h' or 'm' or 's':
                    _ = result.Append(current, Math.Min(run, 2));
                    break;
                case 't':
                    _ = result.Append("tt");
                    break;
                default:
                    return fallback;
            }

            index += run;
        }

        var normalized = result.ToString().Trim();

        return UITemporalPattern.IsComplete(normalized, isTime) ? normalized : fallback;
    }

    private static bool HasTokenLetter(ReadOnlySpan<char> literal)
    {
        foreach (var letter in literal)
        {
            if (IsTokenLetter(letter))
                return true;
        }

        return false;
    }

    private static bool IsTokenLetter(char letter)
        => letter is 'y' or 'M' or 'd' or 'H' or 'h' or 'm' or 's' or 't';
}
