using System;
using System.Globalization;
using System.Text;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// A number as the page's script holds and writes it: read off the wire as a <see langword="double"/>, written as JavaScript's
/// <c>String(number)</c> — the one port of that rule, for a server text that must read as the page's (a word's slot, a rule's
/// comparison, a cell the client may draw again).
/// </summary>
public static class UIScriptNumber
{
    /// <summary>
    /// A number as the page reads it off the wire: a <see langword="float"/> by its own shortest text, a <see langword="decimal"/> or an
    /// integer as the nearest <see langword="double"/>; false for anything that is no number.
    /// </summary>
    public static bool TryRead(object? value, out double number)
    {
        switch (value)
        {
            case double d:
                number = d;
                return true;
            case float f:
                number = double.Parse(f.ToString("R", CultureInfo.InvariantCulture), CultureInfo.InvariantCulture);
                return true;
            case decimal m:
                number = (double)m;
                return true;
            case int or long or short or sbyte or byte or ushort or uint or ulong:
                number = Convert.ToDouble(value, CultureInfo.InvariantCulture);
                return true;
            default:
                number = 0;
                return false;
        }
    }

    /// <summary>
    /// A number's shortest invariant text laid out as JavaScript's <c>String(number)</c> lays it out: plain digits from 1e-7 up to
    /// 1e21, an exponent (<c>1e+21</c>, <c>1e-7</c>) beyond.
    /// </summary>
    public static string Format(double value)
    {
        if (double.IsNaN(value))
            return "NaN";

        if (double.IsInfinity(value))
            return value > 0 ? "Infinity" : "-Infinity";

        // Negative zero reads "0", as in JavaScript.
        if (value == 0)
            return "0";

        ShortestDigits(Math.Abs(value), out var digits, out var point);

        StringBuilder text = new(digits.Length + 8);

        if (value < 0)
            _ = text.Append('-');

        var k = digits.Length;

        if (k <= point && point <= 21)
            _ = text.Append(digits).Append('0', point - k);
        else if (point is > 0 and <= 21)
            _ = text.Append(digits, 0, point).Append('.').Append(digits, point, k - point);
        else if (point is > -6 and <= 0)
            _ = text.Append("0.").Append('0', -point).Append(digits);
        else
            AppendExponent(text, digits, point - 1);

        return text.ToString();
    }

    /// <summary>
    /// The shortest round-trip digits of a positive finite number, without leading or trailing zeros, and where its decimal point
    /// falls: the value is <c>0.digits × 10^point</c>.
    /// </summary>
    public static void ShortestDigits(double value, out string digits, out int point)
    {
        var text = value.ToString("R", CultureInfo.InvariantCulture);
        var exponentAt = text.IndexOf('E', StringComparison.Ordinal);
        var exponent = 0;

        if (exponentAt >= 0)
        {
            exponent = int.Parse(text.AsSpan(exponentAt + 1), NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture);
            text = text[..exponentAt];
        }

        var dot = text.IndexOf('.', StringComparison.Ordinal);
        var whole = dot < 0 ? text : text[..dot];
        var all = dot < 0 ? text : string.Concat(whole, text.AsSpan(dot + 1));
        var lead = 0;

        while (lead < all.Length - 1 && all[lead] == '0')
            lead++;

        digits = all[lead..].TrimEnd('0');
        point = whole.Length + exponent - lead;

        if (digits.Length == 0)
            digits = "0";
    }

    private static void AppendExponent(StringBuilder text, string digits, int exponent)
    {
        _ = text.Append(digits[0]);

        if (digits.Length > 1)
            _ = text.Append('.').Append(digits, 1, digits.Length - 1);

        _ = text.Append('e').Append(exponent < 0 ? '-' : '+').Append(Math.Abs(exponent).ToString(CultureInfo.InvariantCulture));
    }
}
