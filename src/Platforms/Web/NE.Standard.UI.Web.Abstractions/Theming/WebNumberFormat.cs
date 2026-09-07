using System;
using System.Collections.Generic;
using System.Globalization;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>
/// The locale-dependent text a formatted number needs — separators, group sizes, the currency and percent symbols and their
/// patterns — resolved once from a <see cref="CultureInfo"/> and handed to the client as one JSON attribute
/// (<c>data-ui-number-culture</c>). The client formats from it; .NET stays the single source of the values.
/// </summary>
public sealed record WebNumberCulturePack(
    string DecimalSeparator,
    string GroupSeparator,
    IReadOnlyList<int> GroupSizes,
    string NegativeSign,
    int NegativePattern,
    int DecimalDigits,
    string CurrencySymbol,
    string CurrencyDecimalSeparator,
    string CurrencyGroupSeparator,
    IReadOnlyList<int> CurrencyGroupSizes,
    int CurrencyDecimalDigits,
    int CurrencyPositivePattern,
    int CurrencyNegativePattern,
    string PercentSymbol,
    string PercentDecimalSeparator,
    string PercentGroupSeparator,
    IReadOnlyList<int> PercentGroupSizes,
    int PercentDecimalDigits,
    int PercentPositivePattern,
    int PercentNegativePattern)
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
/// Formats a number against the <b>documented format subset</b> shared with the TypeScript client (<c>number-format.ts</c>):
/// the standard <c>N</c>, <c>F</c>, <c>C</c>, <c>P</c> and <c>D</c> formats with an optional precision, and no format for the
/// value as it is. <c>NumberFormatParityTests</c> holds the two ports to one corpus.
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

        // A decimal refuses "D"; the client rounds half away from zero, and so does this.
        return char.ToUpperInvariant(format[0]) == 'D'
            ? ((long)decimal.Round(value, 0, MidpointRounding.AwayFromZero)).ToString(format, info)
            : value.ToString(format, info);
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
