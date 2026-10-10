using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// Locale-dependent number-formatting text (separators, group sizes, currency/percent symbols) resolved once from a
/// <see cref="CultureInfo"/> and sent to the client as <c>data-ui-number-culture</c>. .NET stays the single source of the values.
/// </summary>
public sealed record WebNumberCulturePack(string DecimalSeparator, string GroupSeparator, IReadOnlyList<int> GroupSizes, string NegativeSign, int NegativePattern, int DecimalDigits, string CurrencySymbol, string CurrencyDecimalSeparator, string CurrencyGroupSeparator, IReadOnlyList<int> CurrencyGroupSizes, int CurrencyDecimalDigits, int CurrencyPositivePattern, int CurrencyNegativePattern, string PercentSymbol, string PercentDecimalSeparator, string PercentGroupSeparator, IReadOnlyList<int> PercentGroupSizes, int PercentDecimalDigits, int PercentPositivePattern, int PercentNegativePattern)
{
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
/// Formats a number against the format subset shared with the TypeScript client (<c>number-format.ts</c>): <c>N</c>, <c>F</c>,
/// <c>C</c>, <c>P</c>, <c>D</c> with optional precision, or none for the raw value. <c>NumberFormatParityTests</c> keeps both
/// ports to one corpus.
/// </summary>
public static class WebNumberFormat
{
    /// <summary>The format letters the client renders; anything else is refused on both sides.</summary>
    public const string Kinds = "NFCPD";

    /// <summary>Formats <paramref name="value"/>; a null or empty format is the value as it is, with the culture's separator and sign.</summary>
    public static string Format(decimal value, string? format, WebNumberCulturePack culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        NumberFormatInfo info = culture.ToNumberFormatInfo();

        if (string.IsNullOrWhiteSpace(format))
            return value.ToString(info);

        if (!IsSupported(format))
            throw new ArgumentException($"Number format '{format}' is outside the shared subset ({Kinds}, with an optional precision).", nameof(format));

        return char.ToUpperInvariant(format[0]) == 'D' ? FormatInteger(value, format, info) : value.ToString(format, info);
    }

    /// <summary>
    /// Formats <paramref name="value"/> as the client formats a number: by the shortest digits that read back as it (0.285, not
    /// its binary 0.28499…), so a value past a decimal's range, a logarithmic axis's, writes as the page writes it.
    /// </summary>
    public static string Format(double value, string? format, WebNumberCulturePack culture)
    {
        ArgumentNullException.ThrowIfNull(culture);

        if (!double.IsFinite(value))
            return double.IsNaN(value) ? "NaN" : value > 0 ? "Infinity" : "-Infinity";

        // No negative zero: the client writes -0 as 0.
        var digits = (value == 0 ? 0d : value).ToString("R", CultureInfo.InvariantCulture);

        if (string.IsNullOrWhiteSpace(format))
            return Plain(value, culture);

        if (decimal.TryParse(digits, NumberStyles.Float, CultureInfo.InvariantCulture, out var number))
            return Format(number, format, culture);

        if (!IsSupported(format))
            throw new ArgumentException($"Number format '{format}' is outside the shared subset ({Kinds}, with an optional precision).", nameof(format));

        // Past a decimal's range a double is a whole number, so its digits are exact as an integer.
        NumberFormatInfo info = culture.ToNumberFormatInfo();
        BigInteger whole = BigInteger.Parse(digits, NumberStyles.Float, CultureInfo.InvariantCulture);
        var kind = char.ToUpperInvariant(format[0]);

        // The precision always written out: a BigInteger's own default for P is not the culture's.
        var precision = format.Length > 1 ? format[1..] : kind switch
        {
            'C' => info.CurrencyDecimalDigits.ToString(CultureInfo.InvariantCulture),
            'P' => info.PercentDecimalDigits.ToString(CultureInfo.InvariantCulture),
            'D' => "",
            _ => info.NumberDecimalDigits.ToString(CultureInfo.InvariantCulture)
        };

        return whole.ToString(kind + precision, info);
    }

    /// <summary>
    /// <c>D</c>, which a decimal refuses: the integer's digits, rounded half away from zero as the client rounds, padded with zeros
    /// to the precision, the culture's sign before them.
    /// </summary>
    /// <remarks>Written out, not cast to a <see cref="long"/>, which holds too few digits for a decimal past 9.2e18.</remarks>
    private static string FormatInteger(decimal value, string format, NumberFormatInfo info)
    {
        var rounded = decimal.Round(value, 0, MidpointRounding.AwayFromZero);
        var width = format.Length > 1 ? int.Parse(format.AsSpan(1), NumberStyles.None, CultureInfo.InvariantCulture) : 1;
        var digits = decimal.Abs(rounded).ToString("F0", CultureInfo.InvariantCulture).PadLeft(width, '0');

        return rounded < 0 ? info.NegativeSign + digits : digits;
    }

    /// <summary>A number's shortest digits as they are — no grouping, never an exponent — in the culture's separator and sign.</summary>
    private static string Plain(double value, WebNumberCulturePack culture)
    {
        UIScriptNumber.ShortestDigits(Math.Abs(value), out var digits, out var point);

        var text = point <= 0 ? $"0{culture.DecimalSeparator}{new string('0', -point)}{digits}"
            : point >= digits.Length ? digits + new string('0', point - digits.Length)
            : $"{digits[..point]}{culture.DecimalSeparator}{digits[point..]}";

        return value < 0 ? culture.NegativeSign + text : text;
    }

    /// <summary>Whether the format is one letter of the subset followed by at most two digits of precision.</summary>
    public static bool IsSupported(string? format)
    {
        if (string.IsNullOrEmpty(format) || format.Length > 3 || !Kinds.Contains(char.ToUpperInvariant(format[0]), StringComparison.Ordinal))
            return false;

        for (var i = 1; i < format.Length; i++)
        {
            if (!char.IsAsciiDigit(format[i]))
                return false;
        }

        return true;
    }
}
