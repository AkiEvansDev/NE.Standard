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
/// Never produces a typed value: it hands back an invariant canonical string, since the runtime does not know the target CLR type.
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
    /// A rejection is a return value, not an exception: invalid user input is expected here and belongs in the field's validation message.
    /// </remarks>
    public static UIFormattedValueNormalization Normalize(object? value, string? format, string? culture, out object? normalized)
    {
        normalized = value;

        if (value is not string text || string.IsNullOrWhiteSpace(text))
            return UIFormattedValueNormalization.Untouched;

        CultureInfo cultureInfo = ResolveCulture(culture);

        // No format and an invariant culture: the client already sends canonical strings for unformatted input.
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
    /// Parses text against a temporal format, emitting "yyyy-MM-dd", "HH:mm:ss", or ISO-8601 depending on what the format carries.
    /// </summary>
    /// <remarks>
    /// The format decides date vs. time first rather than trying parsers in turn:
    /// <see cref="TimeOnly.TryParseExact(string, string, IFormatProvider, DateTimeStyles, out TimeOnly)"/> silently drops a date part.
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
    /// Parses a value the client produced in its own invariant canonical form, tried only after the format-exact parse fails.
    /// </summary>
    /// <remarks>
    /// Matches an exact closed list of formats rather than a lenient <c>TryParse</c>, so invalid input never becomes a different value.
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
        // A format naming no time part is a date-only input; without a format, midnight is the only signal available.
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
