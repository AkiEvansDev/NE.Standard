using System;
using System.Globalization;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Describes what <see cref="UIFormattedValueNormalizer.Normalize"/> made of a value.
/// </summary>
internal enum UIFormattedValueNormalization
{
    /// <summary>There was nothing to reinterpret; the original value passes through untouched.</summary>
    Untouched,

    /// <summary>The text parsed, and the canonical form was produced.</summary>
    Normalized,

    /// <summary>The text does not parse against the component's format and culture.</summary>
    Rejected
}

/// <summary>
/// Turns what a user typed into a form the ordinary value coercion understands.
/// </summary>
/// <remarks>
/// The trick this exists for: the runtime never learns the target CLR type — <c>SetRecursiveValue</c> hands
/// the value to a generated setter that knows its own <c>T</c> and coerces there, culture-unaware. So this
/// does not produce a typed value at all. It parses with the component's own format/culture and hands back
/// an <em>invariant canonical string</em>, which that same coercion then turns into
/// <see cref="DateOnly"/>/<see cref="TimeOnly"/>/<see cref="DateTimeOffset"/>/<see cref="decimal"/> without
/// needing to know anything about cultures.
/// </remarks>
internal static class UIFormattedValueNormalizer
{
    private const string CanonicalTimeFormat = "HH:mm:ss";

    /// <summary>The exact shapes <c>TemporalInputRendererBase</c> and <c>toCanonical</c> (client) produce.</summary>
    private static readonly string[] CanonicalDateFormats = ["yyyy-MM-dd", "yyyy-MM-ddTHH:mm:ss"];

    /// <summary>
    /// Normalizes <paramref name="value"/> when it is text entered against
    /// <paramref name="format"/>/<paramref name="culture"/>.
    /// </summary>
    /// <remarks>
    /// A rejection is a return value rather than an exception: text that does not parse is ordinary invalid
    /// user input — "31.02.2026" in a date field — not a broken protocol update, and it belongs in the
    /// field's validation message. Throwing made it cost a first-chance exception on a per-keystroke-commit
    /// path and, worse, aborted the whole client change set (see <c>UIRuntimeBase.ProcessChangeSetFromUIAsync</c>).
    /// </remarks>
    public static UIFormattedValueNormalization Normalize(object? value, string? format, string? culture, out object? normalized)
    {
        normalized = value;

        if (value is not string text || string.IsNullOrWhiteSpace(text))
            return UIFormattedValueNormalization.Untouched;

        CultureInfo cultureInfo = ResolveCulture(culture);

        // No format and an invariant culture means there is nothing this could usefully reinterpret — the
        // client already sends canonical strings for every input that isn't formatted text.
        if (string.IsNullOrWhiteSpace(format) && ReferenceEquals(cultureInfo, CultureInfo.InvariantCulture))
            return UIFormattedValueNormalization.Untouched;

        if (TryParseTemporal(text, format, cultureInfo, out normalized))
            return UIFormattedValueNormalization.Normalized;

        if (TryParseNumeric(text, cultureInfo, out normalized))
            return UIFormattedValueNormalization.Normalized;

        normalized = value;
        return UIFormattedValueNormalization.Rejected;
    }

    private static CultureInfo ResolveCulture(string? culture)
    {
        if (string.IsNullOrWhiteSpace(culture))
            return CultureInfo.InvariantCulture;

        try
        {
            return CultureInfo.GetCultureInfo(culture);
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture;
        }
    }

    /// <summary>
    /// Emits the round-trip form the coercion already accepts: "yyyy-MM-dd" for a date-only input,
    /// "HH:mm:ss" for a time-only one, ISO-8601 otherwise. Which of the three is chosen follows from what
    /// the format string actually carries, since the runtime cannot see the target type.
    /// </summary>
    /// <remarks>
    /// The order is decided by the format string, not by trying the parsers in turn:
    /// <see cref="TimeOnly.TryParseExact(string, string, IFormatProvider, DateTimeStyles, out TimeOnly)"/>
    /// happily accepts a format carrying date parts and silently drops the date, so "03.04.2026" under
    /// "dd.MM.yyyy" comes back as midnight and a date turns into a time. Ask the format what kind of value
    /// it describes first.
    /// </remarks>
    private static bool TryParseTemporal(string text, string? format, CultureInfo culture, out object? normalized)
    {
        normalized = null;

        DateTimeStyles styles = DateTimeStyles.None;

        if (!string.IsNullOrWhiteSpace(format))
        {
            if (!HasDateParts(format))
            {
                if (HasTimeParts(format) && TimeOnly.TryParseExact(text, format, culture, styles, out TimeOnly timeOnly))
                {
                    normalized = timeOnly.ToString(CanonicalTimeFormat, CultureInfo.InvariantCulture);
                    return true;
                }

                return TryParseCanonical(text, format, out normalized);
            }

            if (DateTime.TryParseExact(text, format, culture, styles, out DateTime exact))
            {
                normalized = FormatTemporal(exact, format);
                return true;
            }

            return TryParseCanonical(text, format, out normalized);
        }

        if (DateTime.TryParse(text, culture, styles, out DateTime parsed))
        {
            normalized = FormatTemporal(parsed, format: null);
            return true;
        }

        if (TimeOnly.TryParse(text, culture, styles, out TimeOnly parsedTime))
        {
            normalized = parsedTime.ToString("HH:mm:ss", CultureInfo.InvariantCulture);
            return true;
        }

        return false;
    }

    /// <summary>
    /// The escape hatch for a value the client produced rather than a user typed. A calendar pick already
    /// knows the exact value and sends it in the same invariant canonical form the renderer emits — which a
    /// <c>TryParseExact</c> against the component's own <c>Format</c> rejects out of hand, since "2026-04-03"
    /// is not "dd.MM.yyyy". Tried only after the format-exact parse has failed, so a string the format *can*
    /// read is never reinterpreted as something else.
    /// </summary>
    /// <remarks>
    /// Exact against a closed list rather than a lenient <c>TryParse</c>: the invariant parser accepts a good
    /// deal more than these three shapes, and this must not turn genuinely invalid input (which belongs in a
    /// validation message) into a silently different value.
    /// </remarks>
    private static bool TryParseCanonical(string text, string format, out object? normalized)
    {
        if (!HasDateParts(format))
        {
            if (TimeOnly.TryParseExact(text, CanonicalTimeFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out TimeOnly time))
            {
                normalized = time.ToString(CanonicalTimeFormat, CultureInfo.InvariantCulture);
                return true;
            }

            normalized = null;
            return false;
        }

        if (DateTime.TryParseExact(text, CanonicalDateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsed))
        {
            normalized = FormatTemporal(parsed, format);
            return true;
        }

        normalized = null;
        return false;
    }

    private static bool HasDateParts(string format)
        => format.Contains('d', StringComparison.Ordinal) ||
           format.Contains('M', StringComparison.Ordinal) ||
           format.Contains('y', StringComparison.Ordinal);

    private static bool HasTimeParts(string format)
        => format.Contains('H', StringComparison.Ordinal) ||
           format.Contains('h', StringComparison.Ordinal) ||
           format.Contains('m', StringComparison.Ordinal) ||
           format.Contains('s', StringComparison.Ordinal);

    private static string FormatTemporal(DateTime value, string? format)
    {
        // A format naming no time part describes a date-only input, whose canonical form is the one
        // DateOnly itself round-trips through. Without a format, midnight is the only signal available —
        // which is why an explicit format is the better thing to author.
        var isDateOnly = format is null
            ? value.TimeOfDay == TimeSpan.Zero
            : !HasTimeParts(format);

        return isDateOnly
            ? value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
            : value.ToString("O", CultureInfo.InvariantCulture);
    }

    private static bool TryParseNumeric(string text, CultureInfo culture, out object? normalized)
    {
        if (decimal.TryParse(text, NumberStyles.Number, culture, out var number))
        {
            normalized = number.ToString(CultureInfo.InvariantCulture);
            return true;
        }

        normalized = null;
        return false;
    }
}
