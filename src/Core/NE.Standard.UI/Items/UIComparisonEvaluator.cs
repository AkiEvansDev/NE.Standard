using System;
using System.Collections;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Items;

/// <summary>Applies a <see cref="UIComparisonOperator"/> to a pair of values.</summary>
/// <remarks>
/// Follows JavaScript's comparison rules, not .NET's, since that's what the rules already mean on the web: text unless the
/// operator is numeric, <see langword="null"/> as an empty string.
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
            UIComparisonOperator.Greater => IsOrdered(left, right, static order => order > 0),
            UIComparisonOperator.GreaterOrEqual => IsOrdered(left, right, static order => order >= 0),
            UIComparisonOperator.Less => IsOrdered(left, right, static order => order < 0),
            UIComparisonOperator.LessOrEqual => IsOrdered(left, right, static order => order <= 0),
            UIComparisonOperator.Like => text.Contains(AsText(right), StringComparison.Ordinal),
            UIComparisonOperator.LikeIgnoreCase => text.Contains(AsText(right), StringComparison.OrdinalIgnoreCase),
            UIComparisonOperator.In => IsIn(text, right),
            UIComparisonOperator.Regex => IsRegexMatch(text, right),
            UIComparisonOperator.RegexEach => IsEveryRegexMatch(left, right),
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
            // As the page holds a number, a double, and writes it: a decimal's or a long's digits past a double's read as the page's.
            _ when UIScriptNumber.TryRead(value, out var number) => UIScriptNumber.Format(number),
            // A moment as the wire writes it, which is the text the client compares and the shape that orders as the moments do.
            DateTime moment => moment.ToString("yyyy-MM-dd'T'HH:mm:ss.FFFFFFFK", CultureInfo.InvariantCulture),
            DateTimeOffset moment => moment.ToString("yyyy-MM-dd'T'HH:mm:ss.FFFFFFFzzz", CultureInfo.InvariantCulture),
            DateOnly date => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            TimeOnly time => time.ToString("HH:mm:ss.FFFFFFF", CultureInfo.InvariantCulture),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            IEnumerable elements => JoinElements(elements),
            _ => value.ToString() ?? string.Empty
        };

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
    /// Whether the pair stands in the order asked: as numbers, or — when neither text reads as a number — as ordinal text.
    /// </summary>
    private static bool IsOrdered(object? left, object? right, Func<int, bool> asked)
    {
        var leftNumber = AsNumber(left);
        var rightNumber = AsNumber(right);

        if (!double.IsNaN(leftNumber) && !double.IsNaN(rightNumber))
            return asked(leftNumber.CompareTo(rightNumber));

        // One side a number and the other not stays incomparable, as in JavaScript; two texts order as text, which is what
        // dates in the wire's ISO shape need.
        return double.IsNaN(leftNumber) && double.IsNaN(rightNumber) && IsText(left) && IsText(right) && asked(string.CompareOrdinal(AsText(left), AsText(right)));
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

    /// <summary>
    /// Whether the value is text on the client: a string, or a moment, which travels as one.
    /// </summary>
    // A phrase is text too: its key, or an author's text's own words — the client's `comparable`.
    private static bool IsText(object? value)
        => value is string or DateTime or DateTimeOffset or DateOnly or TimeOnly or UIPhrase;

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

    /// <summary>Whether every item of a list matches; text is one item, and nothing an empty list, which <c>Required</c> is for.</summary>
    private static bool IsEveryRegexMatch(object? left, object? right)
    {
        if (left is null)
            return true;

        if (left is string || left is not IEnumerable items)
            return IsRegexMatch(AsText(left), right);

        foreach (var item in items)
        {
            if (!IsRegexMatch(AsText(item), right))
                return false;
        }

        return true;
    }
}
