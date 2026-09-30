using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// A moment as the wire writes it — <c>yyyy-MM-dd</c>, then <c>T</c> or a space and <c>HH:mm[:ss[.fff…]]</c>, then nothing or a zone —
/// read by the wall clock it is written with, as the page's <c>temporal.parse</c> reads it (<c>written-moment-corpus.json</c>).
/// </summary>
public static partial class UIWrittenMoment
{
    /// <summary>
    /// The wall clock a text in the wire's shapes names, a zone after it dropped rather than shifting the moment into the server's;
    /// false for any other text, or a field outside its own range.
    /// </summary>
    /// <remarks>
    /// Only the wire's shapes: a text .NET reads in another ("09/29/2026", "Sep 29 2026", a bare clock on today's date) is one the
    /// page cannot read, so a server that did would show what the page's redraw drops.
    /// </remarks>
    public static bool TryRead(string? text, out DateTime moment)
    {
        moment = default;

        if (text is null)
            return false;

        Match written = WrittenMomentRegex().Match(text.Trim());

        if (!written.Success)
            return false;

        var year = ReadField(written, 1);
        var month = ReadField(written, 2);
        var day = ReadField(written, 3);
        var hour = ReadField(written, 4);
        var minute = ReadField(written, 5);
        var second = ReadField(written, 6);

        if (year < 1 || month is < 1 or > 12 || day < 1 || day > DateTime.DaysInMonth(year, month) || hour > 23 || minute > 59 || second > 59)
            return false;

        // The fraction's first three digits are the milliseconds; the rest is finer than a moment carries.
        var fraction = written.Groups[7].Success ? written.Groups[7].Value.PadRight(3, '0')[..3] : "0";

        moment = new DateTime(year, month, day, hour, minute, second, int.Parse(fraction, CultureInfo.InvariantCulture), DateTimeKind.Unspecified);
        return true;
    }

    private static int ReadField(Match written, int group)
        => written.Groups[group].Success ? int.Parse(written.Groups[group].ValueSpan, CultureInfo.InvariantCulture) : 0;

    // temporal-format.ts's WrittenMomentPattern, with ASCII digits as JavaScript's \d reads them.
    [GeneratedRegex("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:[T ]([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2})(?:\\.([0-9]+))?)?)?(?:Z|[+-][0-9]{2}(?::?[0-9]{2})?)?$", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex WrittenMomentRegex();
}
