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
/// <see langword="bool"/> as <c>true</c>/<c>false</c>, <see langword="null"/> as nothing (a NaN or an infinity too, which the page reads
/// as null), a nested <see cref="UIPhrase"/> translated first, a moment (<see cref="UIMoment.TryRead"/>) as <see cref="UIMoment.ToString"/>
/// — the page writes it in the reader's zone, the web render's first paint in the application's patterns. Where the words are read as
/// inline markup, an argument written as text is data (<see cref="EscapeMarkup"/>). Twin of the client's <c>format</c>, both pinned by
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
            // A NaN or an infinity as the null the page holds it as.
            _ when UIScriptNumber.ReadsAsNull(value) => string.Empty,
            string text => text,
            bool flag => flag ? "true" : "false",
            UIPhrase nested => translateNested is null ? Format(nested.Key, nested.Arguments) : translateNested(nested),
            _ when UIMoment.TryRead(value, out UIMoment moment) => moment.ToString(),
            _ when UIScriptNumber.TryRead(value, out var number) => UIScriptNumber.Format(number),
            _ => Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty
        };

    /// <summary>
    /// <paramref name="arguments"/> for words read as inline markup (a description, a tooltip): an argument written as text — a string,
    /// an author's text as the words <paramref name="translateText"/> gives it, any other value as its invariant text (a character, an
    /// enum, a URI) — with its markup escaped, a nested phrase's arguments the same way, so a name typed as <c>[a](b)</c> shows as typed;
    /// the template's own text, numbers, flags and moments stay. The arguments themselves where none is text.
    /// </summary>
    /// <remarks>
    /// Escaped before a translator fills the template, so no <see cref="ITranslator"/> needs to know where its words land; the client's
    /// <c>formatWords</c> escapes the same under its <c>markup</c> flag, both pinned by <c>eng/Tests/Shared/words-format-corpus.json</c>.
    /// </remarks>
    public static IReadOnlyDictionary<string, object?>? EscapeMarkup(IReadOnlyDictionary<string, object?>? arguments, Func<string, string> translateText)
    {
        ArgumentNullException.ThrowIfNull(translateText);

        if (arguments is null || !HoldsText(arguments))
            return arguments;

        Dictionary<string, object?> escaped = new(arguments.Count, StringComparer.Ordinal);

        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            escaped[argument.Key] = argument.Value switch
            {
                // Looked up first: the author's text may be a key, and its words are what the template shows.
                UIPhrase { IsText: true } text => UIInlineMarkup.Escape(translateText(text.Key)),
                UIPhrase { Arguments: { } nested } phrase when HoldsText(nested) => new UIPhrase(phrase.Key, EscapeMarkup(nested, translateText)),
                var value when IsText(value) => UIInlineMarkup.Escape(Convert.ToString(value, CultureInfo.InvariantCulture)),
                _ => argument.Value
            };
        }

        return escaped;
    }

    private static bool HoldsText(IReadOnlyDictionary<string, object?> arguments)
    {
        foreach (KeyValuePair<string, object?> argument in arguments)
        {
            if (IsText(argument.Value) || argument.Value is UIPhrase { IsText: true } || (argument.Value is UIPhrase { Arguments: { } nested } && HoldsText(nested)))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Whether an argument reaches the page as text: anything but nothing, a flag, a phrase, a number or a moment — what
    /// <see cref="UIPhraseJsonConverter"/> writes as a string, which the client escapes under markup.
    /// </summary>
    private static bool IsText(object? value)
        => value is not (null or bool or UIPhrase) && !UIScriptNumber.TryRead(value, out _) && !UIMoment.TryRead(value, out _);

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
