using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The token subset every date and time pattern is written in — what the server's and the page's formatters both write, and what
/// the page reads typed text by; anything else in a pattern is written as it stands.
/// </summary>
public static class UITemporalPattern
{
    // An array under the list, so a match walks it with no enumerator: a grid's cells format through it.
    private static readonly string[] TokenTable =
    [
        "MMMM", "dddd", "yyyy", "MMM", "ddd", "dd", "MM", "yy", "HH", "hh", "mm", "ss", "tt", "d", "M", "H", "h", "m", "s"
    ];

    /// <summary>The tokens, longest first: matching is greedy, so <c>MMMM</c> must come before <c>MMM</c>.</summary>
    public static IReadOnlyList<string> Tokens => TokenTable;

    /// <summary>
    /// Refuses a pattern outside the subset, or one a field could not show a value in: a letter no token holds, a quote (the subset
    /// has none), a two-digit year, a time's token in a date or a date's in a time, a missing part.
    /// </summary>
    /// <exception cref="InvalidOperationException">The pattern cannot be shown or read by the subset.</exception>
    public static void Validate(string pattern, bool isTime, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(pattern, name);

        for (var index = 0; index < pattern.Length;)
        {
            var token = Match(pattern, index);

            if (token is null)
            {
                var character = pattern[index];

                if (char.IsAsciiLetter(character))
                    throw Refused(pattern, name, $"'{character}' is no token of the shared subset ({string.Join(", ", Tokens)})");

                if (character is '\'' or '"' or '\\')
                    throw Refused(pattern, name, "the shared subset has no quoting; write a literal as it is, with no token's letter in it");

                index++;
                continue;
            }

            if (token == "yy")
                throw Refused(pattern, name, "a year is written in four digits (yyyy), the only form the picker reads every year in");

            if (isTime != IsTimeToken(token))
                throw Refused(pattern, name, isTime ? $"a time pattern names no part of a date ('{token}')" : $"a date pattern names no part of a time ('{token}')");

            index += token.Length;
        }

        if (!IsComplete(pattern, isTime))
            throw Refused(pattern, name, isTime ? "a time names its hour and its minute, and a 12-hour hour its AM or PM (tt)" : "a date names its year, month and day");
    }

    /// <summary>A date names its year, month and day; a time its hour and minute, a 12-hour hour its AM or PM, and no part of a date.</summary>
    public static bool IsComplete(string pattern, bool isTime)
    {
        ArgumentNullException.ThrowIfNull(pattern);

        if (!isTime)
            return IsCompleteDate(pattern);

        var twelveHour = IsTwelveHour(pattern);

        return (twelveHour || pattern.Contains('H', StringComparison.Ordinal))
            && pattern.Contains('m', StringComparison.Ordinal)
            && (!twelveHour || pattern.Contains('t', StringComparison.Ordinal))
            && !pattern.Contains('y', StringComparison.Ordinal) && !pattern.Contains('M', StringComparison.Ordinal) && !pattern.Contains('d', StringComparison.Ordinal);
    }

    /// <summary>Token by token: a weekday's name (<c>ddd</c>, <c>dddd</c>) is no day the page's reader can read a date back by.</summary>
    private static bool IsCompleteDate(string pattern)
    {
        var day = false;
        var month = false;
        var year = false;

        for (var index = 0; index < pattern.Length;)
        {
            var token = Match(pattern, index);

            if (token is null)
            {
                index++;
                continue;
            }

            day |= token is "d" or "dd";
            month |= token[0] == 'M';
            year |= token == "yyyy";
            index += token.Length;
        }

        return day && month && year;
    }

    /// <summary>Whether a time pattern counts its hours to 12.</summary>
    public static bool IsTwelveHour(string pattern)
    {
        ArgumentNullException.ThrowIfNull(pattern);

        return pattern.Contains('h', StringComparison.Ordinal);
    }

    /// <summary>The longest token at <paramref name="index"/>, or <see langword="null"/> where none starts.</summary>
    public static string? Match(string pattern, int index)
    {
        ArgumentNullException.ThrowIfNull(pattern);

        foreach (var token in TokenTable)
        {
            if (index + token.Length <= pattern.Length && string.CompareOrdinal(pattern, index, token, 0, token.Length) == 0)
                return token;
        }

        return null;
    }

    private static bool IsTimeToken(string token)
        => token[0] is 'H' or 'h' or 'm' or 's' or 't';

    private static InvalidOperationException Refused(string pattern, string name, string reason)
        => new($"{name} '{pattern}' cannot be shown: {reason}.");
}
