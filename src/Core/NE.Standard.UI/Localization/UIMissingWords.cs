using System.Collections.Generic;
using System.Threading;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Localization;

/// <summary>
/// The framework's <see cref="IUIMissingWords"/>: each (language, key, kind) recorded and logged once, up to
/// <see cref="MaxRecorded"/> distinct ones, then one line saying the rest go unrecorded.
/// </summary>
internal sealed partial class UIMissingWords(ILogger logger) : IUIMissingWords
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "No translation of '{Key}' in '{Language}'; the page shows a fallback.")]
        public static partial void WordMissing(ILogger logger, string key, string language);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "{Count} missing words recorded; later ones are neither recorded nor logged until the collection is cleared.")]
        public static partial void RecordingStopped(ILogger logger, int count);

        [LoggerMessage(EventId = 3, Level = LogLevel.Warning, Message = "'{Text}' on {Place} starts with no key prefix, so every language shows it as written; key it, or mark it content.")]
        public static partial void WordUnkeyed(ILogger logger, string text, string place);
    }

    /// <summary>How many distinct missing words are kept; a page asking for unbounded content must not grow the set forever.</summary>
    public const int MaxRecorded = 4096;

    private readonly Lock _sync = new();
    private readonly HashSet<UIMissingWord> _seen = [];
    private readonly List<UIMissingWord> _order = [];
    private bool _stopped;

    /// <summary>
    /// Records a word missing in a language, logging it the first time.
    /// </summary>
    public void Record(string language, string key)
    {
        if (TryAdd(new UIMissingWord(language, key)))
            Log.WordMissing(logger, key, language);
    }

    private bool TryAdd(UIMissingWord word)
    {
        lock (_sync)
        {
            if (_stopped || _seen.Contains(word))
                return false;

            if (_seen.Count >= MaxRecorded)
            {
                _stopped = true;
                Log.RecordingStopped(logger, _seen.Count);
                return false;
            }

            _ = _seen.Add(word);
            _order.Add(word);
        }

        return true;
    }

    /// <summary>
    /// Records a view's static text that is no key under the prefixes, logging it with the first place it stands.
    /// </summary>
    public void RecordUnkeyed(string text, string place)
    {
        if (TryAdd(new UIMissingWord(string.Empty, text) { Kind = UIMissingWordKind.Unkeyed }))
            Log.WordUnkeyed(logger, text, place);
    }

    /// <inheritdoc />
    public IReadOnlyList<UIMissingWord> Snapshot()
    {
        lock (_sync)
            return [.. _order];
    }

    /// <inheritdoc />
    public void Clear()
    {
        lock (_sync)
        {
            _seen.Clear();
            _order.Clear();
            _stopped = false;
        }
    }
}
