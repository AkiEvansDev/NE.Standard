using System;
using System.Collections;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Items;

/// <summary>
/// Applies a <see cref="UIComparisonOperator"/> to a pair of values.
/// </summary>
/// <remarks>
/// Comparisons are the framework's rule, which every platform's client-side rules follow — JavaScript's rather than .NET's,
/// because that is what the rules already meant on the web: text unless the operator is numeric,
/// <see langword="null"/> as an empty string.
/// </remarks>
public static class UIComparisonEvaluator
{
    // A pattern arriving from an author is still a pattern that can backtrack for ever.
    private static readonly TimeSpan RegexTimeout = TimeSpan.FromMilliseconds(100);

    /// <summary>
    /// Evaluates <paramref name="left"/> against <paramref name="right"/> under <paramref name="operator"/>.
    /// </summary>
    public static bool Evaluate(object? left, UIComparisonOperator @operator, object? right)
    {
        var text = AsText(left);

        return @operator switch
        {
            UIComparisonOperator.Required => left is not null and not false && !string.IsNullOrWhiteSpace(text),
            UIComparisonOperator.Equal => string.Equals(text, AsText(right), StringComparison.Ordinal),
            UIComparisonOperator.NotEqual => !string.Equals(text, AsText(right), StringComparison.Ordinal),
            UIComparisonOperator.Greater => AsNumber(left) > AsNumber(right),
            UIComparisonOperator.GreaterOrEqual => AsNumber(left) >= AsNumber(right),
            UIComparisonOperator.Less => AsNumber(left) < AsNumber(right),
            UIComparisonOperator.LessOrEqual => AsNumber(left) <= AsNumber(right),
            UIComparisonOperator.Like => text.Contains(AsText(right), StringComparison.Ordinal),
            UIComparisonOperator.LikeIgnoreCase => text.Contains(AsText(right), StringComparison.OrdinalIgnoreCase),
            UIComparisonOperator.In => IsIn(text, right),
            UIComparisonOperator.Regex => IsRegexMatch(text, right),
            _ => false
        };
    }

    /// <summary>
    /// The value as text, matching what <c>String(value)</c> answers on the client.
    /// </summary>
    private static string AsText(object? value)
        => value switch
        {
            null => string.Empty,
            string text => text,
            bool flag => flag ? "true" : "false",
            double number => FormatNumber(number.ToString("R", CultureInfo.InvariantCulture)),
            float number => FormatNumber(number.ToString("R", CultureInfo.InvariantCulture)),
            decimal number => FormatNumber(number.ToString(CultureInfo.InvariantCulture)),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            IEnumerable elements => JoinElements(elements),
            _ => value.ToString() ?? string.Empty
        };

    /// <summary>
    /// Formats a number the way JavaScript's <c>String(n)</c> would, so text comparisons agree with the client.
    /// </summary>
    private static string FormatNumber(string roundTrip)
    {
        var negative = roundTrip.StartsWith('-');
        var text = negative ? roundTrip[1..] : roundTrip;

        if (text is "NaN" or "Infinity" or "∞")
            return negative && text != "NaN" ? "-Infinity" : text == "NaN" ? "NaN" : "Infinity";

        var exponentIndex = text.IndexOfAny(['E', 'e']);
        var mantissa = exponentIndex < 0 ? text : text[..exponentIndex];
        var exponent = exponentIndex < 0 ? 0 : int.Parse(text[(exponentIndex + 1)..], NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture);
        var pointIndex = mantissa.IndexOf('.', StringComparison.Ordinal);
        var digits = pointIndex < 0 ? mantissa : mantissa.Remove(pointIndex, 1);
        var integerDigits = pointIndex < 0 ? mantissa.Length : pointIndex;

        var leadingZeros = 0;

        while (leadingZeros < digits.Length - 1 && digits[leadingZeros] == '0')
            leadingZeros++;

        digits = digits[leadingZeros..].TrimEnd('0');
        integerDigits -= leadingZeros;

        if (digits.Length == 0)
            return "0";

        // ECMAScript Number::toString: n is where the point sits relative to the digits, k how many there are.
        var n = integerDigits + exponent;
        var k = digits.Length;

        var result = n switch
        {
            <= 21 when k <= n => digits + new string('0', n - k),
            > 0 and <= 21 => digits[..n] + "." + digits[n..],
            > -6 and <= 0 => "0." + new string('0', -n) + digits,
            _ => (k == 1 ? digits : digits[..1] + "." + digits[1..]) + "e" + (n < 1 ? "-" : "+") + Math.Abs(n - 1).ToString(CultureInfo.InvariantCulture)
        };

        return negative ? "-" + result : result;
    }

    /// <summary>
    /// Joins elements the way JavaScript's <c>String(array)</c> would — comma-separated, empty for an empty array.
    /// </summary>
    private static string JoinElements(IEnumerable elements)
    {
        StringBuilder builder = new();
        var first = true;

        foreach (var element in elements)
        {
            if (!first)
                _ = builder.Append(',');

            _ = builder.Append(AsText(element));
            first = false;
        }

        return builder.ToString();
    }

    /// <summary>
    /// The value as a number, matching what JavaScript's <c>Number(x)</c> would answer, or <see cref="double.NaN"/> when it is not one.
    /// </summary>
    private static double AsNumber(object? value)
    {
        switch (value)
        {
            case null:
                // Number(null) is 0, so an unset numeric source reads as zero rather than as incomparable.
                return 0;
            case bool flag:
                return flag ? 1 : 0;
            case IConvertible convertible and not string:
                try
                {
                    return convertible.ToDouble(CultureInfo.InvariantCulture);
                }
                catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException)
                {
                    return double.NaN;
                }

            default:
                break;
        }

        var text = AsText(value).Trim();

        if (text.Length == 0)
            return 0;

        return double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out var number) ? number : double.NaN;
    }

    private static bool IsIn(string text, object? right)
    {
        if (right is not IEnumerable candidates || right is string)
            return false;

        foreach (var candidate in candidates)
        {
            if (string.Equals(AsText(candidate), text, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    private static bool IsRegexMatch(string text, object? right)
    {
        try
        {
            return Regex.IsMatch(text, AsText(right), RegexOptions.None, RegexTimeout);
        }
        catch (Exception exception) when (exception is ArgumentException or RegexMatchTimeoutException)
        {
            // An unusable pattern matches nothing, which is the client's answer too.
            return false;
        }
    }
}
