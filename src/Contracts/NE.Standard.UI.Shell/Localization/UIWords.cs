using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// Fills a translated template's <c>{name}</c> slots — the one formatter of the framework's words and an application's.
/// </summary>
/// <remarks>
/// A slot name is <c>[A-Za-z0-9_]+</c>, so <c>{0}</c> is a positional one; a slot with no argument stays as written, and there is
/// no escape. A number is written as its shortest invariant text (a culture's digits are the caller's: pass a string), a
/// <see langword="bool"/> as <c>true</c>/<c>false</c>, <see langword="null"/> as nothing, a nested <see cref="UIPhrase"/> translated
/// first. Twin of the client's <c>format</c>, both pinned by <c>eng/Tests/Shared/words-format-corpus.json</c>.
/// </remarks>
public static class UIWords
{
    /// <summary>The argument whose number chooses a key's plural form.</summary>
    public const string CountArgument = "count";

    /// <summary>
    /// Fills <paramref name="template"/>'s slots from <paramref name="arguments"/>; <paramref name="translateNested"/> turns a
    /// nested phrase into its words, and without it a nested phrase is its key filled with its own arguments.
    /// </summary>
    public static string Format(string template, IReadOnlyDictionary<string, object?>? arguments, Func<UIPhrase, string>? translateNested = null)
    {
        ArgumentNullException.ThrowIfNull(template);

        if (arguments is null || arguments.Count == 0)
            return template;

        var open = template.IndexOf('{', StringComparison.Ordinal);

        if (open < 0)
            return template;

        StringBuilder result = new(template.Length + 16);
        _ = result.Append(template, 0, open);

        var at = open;

        while (at < template.Length)
        {
            if (template[at] == '{' && TryReadSlot(template, at, out var name, out var next) && arguments.TryGetValue(name, out var value))
            {
                _ = result.Append(FormatArgument(value, translateNested));
                at = next;
                continue;
            }

            _ = result.Append(template[at]);
            at++;
        }

        return result.ToString();
    }

    /// <summary>
    /// Reads the slot opening at <paramref name="open"/>: a name of <c>[A-Za-z0-9_]</c> and a closing brace right after it.
    /// </summary>
    private static bool TryReadSlot(string template, int open, out string name, out int next)
    {
        var at = open + 1;

        while (at < template.Length && IsNameChar(template[at]))
            at++;

        if (at == open + 1 || at >= template.Length || template[at] != '}')
        {
            name = string.Empty;
            next = open + 1;
            return false;
        }

        name = template[(open + 1)..at];
        next = at + 1;
        return true;
    }

    private static bool IsNameChar(char value)
        => char.IsAsciiLetterOrDigit(value) || value == '_';

    private static string FormatArgument(object? value, Func<UIPhrase, string>? translateNested)
        => value switch
        {
            null => string.Empty,
            string text => text,
            bool flag => flag ? "true" : "false",
            UIPhrase nested => translateNested is null ? Format(nested.Key, nested.Arguments) : translateNested(nested),
            _ when TryReadNumber(value, out var number) => FormatNumber(number),
            _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty
        };

    /// <summary>
    /// Arguments named by position — <c>{0}</c>, <c>{1}</c>, … — for a template written with numbered slots.
    /// </summary>
    public static IReadOnlyDictionary<string, object?> Positional(params object?[] values)
    {
        ArgumentNullException.ThrowIfNull(values);

        Dictionary<string, object?> arguments = new(values.Length, StringComparer.Ordinal);

        for (var i = 0; i < values.Length; i++)
            arguments[i.ToString(CultureInfo.InvariantCulture)] = values[i];

        return arguments;
    }

    /// <summary>
    /// Reads the numeric <see cref="CountArgument"/> that chooses a plural form; <see langword="false"/> when there is none.
    /// </summary>
    internal static bool TryReadCount(IReadOnlyDictionary<string, object?>? arguments, out double count)
    {
        count = 0;

        return arguments is not null && arguments.TryGetValue(CountArgument, out var value) && TryReadNumber(value, out count);
    }

    /// <summary>
    /// A number as the page reads it off the wire: a <see langword="float"/> by its own shortest text, a <see langword="decimal"/>
    /// as the nearest <see langword="double"/>.
    /// </summary>
    internal static bool TryReadNumber(object? value, out double number)
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
    internal static string FormatNumber(double value)
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

    private static void AppendExponent(StringBuilder text, string digits, int exponent)
    {
        _ = text.Append(digits[0]);

        if (digits.Length > 1)
            _ = text.Append('.').Append(digits, 1, digits.Length - 1);

        _ = text.Append('e').Append(exponent < 0 ? '-' : '+').Append(Math.Abs(exponent).ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>
    /// The shortest round-trip digits of a positive finite number, without leading or trailing zeros, and where its decimal point
    /// falls: the value is <c>0.digits × 10^point</c>.
    /// </summary>
    internal static void ShortestDigits(double value, out string digits, out int point)
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
}
