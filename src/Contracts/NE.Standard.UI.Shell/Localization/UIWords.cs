using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// Fills a translated template's <c>{name}</c> slots — the one formatter of the framework's words and an application's.
/// </summary>
/// <remarks>
/// A slot name is <c>[A-Za-z0-9_]+</c>, so <c>{0}</c> is a positional one; a slot with no argument stays as written, and there is
/// no escape. A number is written as its shortest invariant text (a culture's digits are the caller's: pass a string), a
/// <see langword="bool"/> as <c>true</c>/<c>false</c>, <see langword="null"/> as nothing, a nested <see cref="UIPhrase"/> translated
/// first, a moment (<see cref="UIMoment.TryRead"/>) as <see cref="UIMoment.ToString"/> — the page writes it in the reader's zone, the
/// web render's first paint in the application's patterns. Twin of the client's <c>format</c>, both pinned by
/// <c>eng/Tests/Shared/words-format-corpus.json</c>.
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
            _ when UIMoment.TryRead(value, out UIMoment moment) => moment.ToString(),
            _ when UIScriptNumber.TryRead(value, out var number) => UIScriptNumber.Format(number),
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

        return arguments is not null && arguments.TryGetValue(CountArgument, out var value) && UIScriptNumber.TryRead(value, out count);
    }
}
