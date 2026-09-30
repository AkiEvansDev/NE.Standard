using System.Collections.Generic;

namespace TeamRoom;

/// <summary>
/// The few words the application says through a phrase — where a moment stands in them, written by the page in the reader's zone and
/// kept current; every other string is no key and shows as written.
/// </summary>
public static class AppWords
{
    /// <summary>A conversation's line in the list: when its newest message came, then the message; takes <c>at</c> and <c>text</c>.</summary>
    public const string LastMessage = "teamroom.chat.last";

    private const string Language = "en";

    private static readonly Dictionary<string, string> English = new()
    {
        [LastMessage] = "{at} · {text}"
    };

    public static IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> Build()
        => new Dictionary<string, IReadOnlyDictionary<string, string>> { [Language] = English };
}
