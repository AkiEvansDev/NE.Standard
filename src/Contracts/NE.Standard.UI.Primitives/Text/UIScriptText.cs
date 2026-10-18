using System;
using System.Collections;
using System.Globalization;
using System.Text;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// A value as the page's script writes it — JavaScript's <c>String(value)</c> over the value as the wire carries it: the one port of
/// that rule, for a server text that must read as the page's (a rule's comparison, a word's slot, a cell, a chart's category).
/// </summary>
public static class UIScriptText
{
    /// <summary>
    /// The text: nothing for what the page holds as null, a flag in the wire's words, a number as <see cref="UIScriptNumber"/> writes it,
    /// a moment as the wire writes it, a list's elements joined by commas, anything else by its invariant text.
    /// </summary>
    public static string Of(object? value)
        => value switch
        {
            // A list's NaN too, which travels as the null String([1, null]) leaves empty.
            _ when UIScriptNumber.ReadsAsNull(value) => string.Empty,
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

            _ = builder.Append(Of(element));
            first = false;
        }

        return builder.ToString();
    }
}
