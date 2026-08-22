using System;
using System.Collections;
using System.Globalization;
using System.Text.RegularExpressions;

using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Items;

/// <summary>
/// Applies a <see cref="UIComparisonOperator"/> to a pair of values.
/// </summary>
/// <remarks>
/// <para>
/// A third hand-maintained port, and it says so: <c>interaction-evaluator.ts</c>'s <c>evaluateOperator</c> is
/// the original and stays the one the client runs for interactions and validation. This copy exists because a
/// windowed items host resolves its filter and sort rules <em>on the server</em> — the client holds one window
/// and cannot judge the rest — so the server has to answer the same question the client answers for every
/// other host. It is public because an in-memory <c>IUIItemSource</c> applying a <c>UIItemsQuery</c> by hand
/// would otherwise have to re-decide what <c>Like</c> or <c>Required</c> mean, and disagree with the client.
/// <c>UIComparisonEvaluatorSyncTests</c> pins the two against each other.
/// </para>
/// <para>
/// The comparisons are deliberately JavaScript's, not .NET's, because that is what the rules already mean
/// everywhere else: values are compared as text unless the operator is numeric, and <see langword="null"/>
/// reads as an empty string. The one place they cannot agree is <see cref="UIComparisonOperator.Regex"/>,
/// whose two engines are different languages.
/// </para>
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
    /// The value as the text the comparisons work on — <see langword="null"/> is the empty string, as it is on
    /// the client, and a number or a boolean is rendered invariantly so that a server and a browser agree.
    /// </summary>
    private static string AsText(object? value)
        => value switch
        {
            null => string.Empty,
            string text => text,
            bool flag => flag ? "true" : "false",
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString() ?? string.Empty
        };

    /// <summary>
    /// The value as the number the numeric operators work on — <see cref="double.NaN"/> when it is not one,
    /// which makes every comparison against it false exactly as JavaScript's <c>Number(x)</c> does.
    /// </summary>
    private static double AsNumber(object? value)
    {
        switch (value)
        {
            case null:
                // Number(null) is 0, and the rules lean on it: an unset numeric source reads as zero rather
                // than as a value no comparison can touch.
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
