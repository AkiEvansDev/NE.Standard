using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>
/// The small inline markup a description or a tooltip may be written in: <c>**bold**</c>, <c>*italic*</c>,
/// <c>__underline__</c>, <c>~~strikethrough~~</c>, <c>`code`</c>, <c>[label](url)</c>, <c>![glyph]</c> and the fold
/// <c>[caption]{text}</c>.
/// </summary>
public static class UIInlineMarkup
{
    /// <summary>
    /// The text with the closing mark after every position indexed on first use, so an opening mark finds its close in
    /// constant time and a parse stays linear however many marks are left open.
    /// </summary>
    /// <remarks>
    /// Every lookup starts right after an opening mark, which is never a backslash, so the escapes read from the start of the
    /// text are the escapes a scan from that position would read.
    /// </remarks>
    private sealed class MarkupText(string text)
    {
        private bool[]? _escaped;
        private int[]? _closeBrackets;
        private int[]? _openBrackets;
        private int[]? _closeParens;
        private int[]? _braceMatches;
        private int[]? _braceDepths;
        private readonly int[]?[] _closers = new int[]?[5];
        private int _linkLabel = -1;
        private string? _linkUrl;

        public string Text { get; } = text;

        public char this[int index] => Text[index];

        /// <summary>The first unescaped <c>]</c> in [<paramref name="start"/>, <paramref name="end"/>); -1 when there is none.</summary>
        public int FindClosingBracket(int start, int end)
            => Within(Next(ref _closeBrackets, ']', honourEscapes: true)[start], end);

        /// <summary>Whether an unescaped <c>[</c> stands in [<paramref name="start"/>, <paramref name="end"/>).</summary>
        public bool HasOpeningBracket(int start, int end)
            => Within(Next(ref _openBrackets, '[', honourEscapes: true)[start], end) >= 0;

        /// <summary>The first <c>)</c> in [<paramref name="start"/>, <paramref name="end"/>), escaped or not, as a link's URL ends.</summary>
        public int FindClosingParen(int start, int end)
            => Within(Next(ref _closeParens, ')', honourEscapes: false)[start], end);

        /// <summary>The <c>}</c> matching the <c>{</c> at <paramref name="open"/> before <paramref name="end"/>; -1 when there is none.</summary>
        public int FindMatchingBrace(int open, int end)
        {
            EnsureBraces();

            return Within(_braceMatches![open], end);
        }

        /// <summary>How many brace levels the pair opened at <paramref name="open"/> holds, itself included.</summary>
        public int BraceDepth(int open)
        {
            EnsureBraces();

            return _braceDepths![open];
        }

        /// <summary>
        /// Where a run opened just before <paramref name="contentStart"/> closes: the marker, exactly as long as it opened,
        /// hugging the text before it.
        /// </summary>
        public int FindClosingMarker(int contentStart, int end, char marker, int markerLength)
        {
            var slot = ClosingMarkerSlot(marker, markerLength);

            _closers[slot] ??= BuildClosers(marker, markerLength);

            var first = _closers[slot]![contentStart + 1];

            if (markerLength == 2)
                return first >= 0 && first + 1 < end ? first : -1;

            if (first >= 0 && first < end - 1)
                return first;

            // A single marker right before the range's end closes even when the character after the range repeats it.
            var last = end - 1;

            return last > contentStart && Text[last] == marker && !IsEscaped(last) && !IsSpace(Text[last - 1]) ? last : -1;
        }

        /// <summary>The URL of the link whose label closes at <paramref name="closingLabel"/>, or null when it has none that is safe.</summary>
        public string? ReadLinkUrl(int closingLabel, int closingUrl)
        {
            // Every bracket opened before one label reads the same URL; kept once, a refused one is not cut and checked again per bracket.
            if (_linkLabel != closingLabel)
            {
                var candidate = Text[(closingLabel + 2)..closingUrl].Trim();

                _linkLabel = closingLabel;
                _linkUrl = IsSafeUrl(candidate) ? candidate : null;
            }

            return _linkUrl;
        }

        private static int Within(int position, int end)
            => position >= 0 && position < end ? position : -1;

        private bool IsEscaped(int index)
        {
            if (_escaped is null)
            {
                _escaped = new bool[Text.Length];

                for (var i = 1; i < Text.Length; i++)
                    _escaped[i] = Text[i - 1] == EscapeCharacter && !_escaped[i - 1];
            }

            return _escaped[index];
        }

        private int[] Next(ref int[]? table, char value, bool honourEscapes)
        {
            if (table is not null)
                return table;

            table = new int[Text.Length + 1];
            table[Text.Length] = -1;

            for (var i = Text.Length - 1; i >= 0; i--)
                table[i] = Text[i] == value && (!honourEscapes || !IsEscaped(i)) ? i : table[i + 1];

            return table;
        }

        private void EnsureBraces()
        {
            if (_braceMatches is not null)
                return;

            var matches = new int[Text.Length];
            var depths = new int[Text.Length];
            Stack<int> open = new();

            Array.Fill(matches, -1);

            for (var i = 0; i < Text.Length; i++)
            {
                if (IsEscaped(i))
                    continue;

                if (Text[i] == FoldOpen)
                {
                    open.Push(i);
                }
                else if (Text[i] == FoldClose && open.TryPop(out var pair))
                {
                    // While a pair is open its depth holds its deepest child's; closing it adds its own level and passes it up.
                    matches[pair] = i;
                    depths[pair]++;

                    if (open.TryPeek(out var parent))
                        depths[parent] = Math.Max(depths[parent], depths[pair]);
                }
            }

            _braceDepths = depths;
            _braceMatches = matches;
        }

        private static int ClosingMarkerSlot(char marker, int markerLength)
            => marker switch
            {
                '*' => markerLength == 2 ? 0 : 1,
                '_' => 2,
                '~' => 3,
                _ => 4
            };

        private int[] BuildClosers(char marker, int markerLength)
        {
            var closers = new int[Text.Length + 1];
            closers[Text.Length] = -1;

            for (var i = Text.Length - 1; i >= 0; i--)
                closers[i] = IsCloser(i, marker, markerLength) ? i : closers[i + 1];

            return closers;
        }

        private bool IsCloser(int index, char marker, int markerLength)
        {
            if (index == 0 || Text[index] != marker || IsEscaped(index) || IsSpace(Text[index - 1]))
                return false;

            var repeated = index + 1 < Text.Length && Text[index + 1] == marker;

            // The doubled marker must be exactly doubled, so `***a***` closes as bold wrapping italic.
            return markerLength == 2 ? repeated : !repeated;
        }
    }

    private const char EscapeCharacter = '\\';
    private const char CodeMarker = '`';
    private const char IconMarker = '!';
    private const char FoldOpen = '{';
    private const char FoldClose = '}';

    // A fold's text is parsed again where it is rendered, one level of recursion per fold: text nested deeper than this reads as
    // literal braces, or a few kilobytes of user text could exhaust the stack of whatever renders it.
    private const int MaxFoldDepth = 8;

    /// <summary>
    /// Splits text into runs. Text with no markup in it comes back as a single plain run, and empty text as
    /// no runs at all.
    /// </summary>
    public static IReadOnlyList<UIInlineSegment> Parse(string? text)
    {
        if (string.IsNullOrEmpty(text))
            return [];

        List<UIInlineSegment> segments = [];
        StringBuilder buffer = new();

        ParseRange(new MarkupText(text), 0, text.Length, UIInlineStyles.None, null, segments, buffer);
        Flush(segments, buffer, UIInlineStyles.None, null);

        return segments;
    }

    /// <summary>
    /// Whether the text carries anything this parser would turn into markup.
    /// </summary>
    public static bool HasMarkup(string? text)
    {
        IReadOnlyList<UIInlineSegment> segments = Parse(text);

        for (var i = 0; i < segments.Count; i++)
        {
            if (!segments[i].IsPlain)
                return true;
        }

        return false;
    }

    /// <summary>
    /// Strips the markup, leaving the text a reader would see, for places that take a plain string (e.g. <c>aria-label</c>).
    /// A fold reads unfolded: its caption, then its text.
    /// </summary>
    public static string ToPlainText(string? text)
    {
        StringBuilder builder = new();

        AppendPlainText(Parse(text), builder);

        return builder.ToString();
    }

    private static void AppendPlainText(IReadOnlyList<UIInlineSegment> segments, StringBuilder builder)
    {
        for (var i = 0; i < segments.Count; i++)
        {
            UIInlineSegment segment = segments[i];

            if (!segment.IsFold)
            {
                _ = builder.Append(segment.Text);
                continue;
            }

            _ = builder.Append(segment.Fold).Append(' ');
            AppendPlainText(Parse(segment.Text), builder);
        }
    }

    /// <summary>
    /// Escapes every marker in a value so it reads as plain text; escape a value before substituting it into a localized
    /// string, so it can't turn the rest into markup.
    /// </summary>
    public static string Escape(string? text)
    {
        if (string.IsNullOrEmpty(text))
            return string.Empty;

        StringBuilder builder = new(text.Length);

        for (var i = 0; i < text.Length; i++)
        {
            if (IsMarkerCharacter(text[i]))
                _ = builder.Append(EscapeCharacter);

            _ = builder.Append(text[i]);
        }

        return builder.ToString();
    }

    private static void ParseRange(MarkupText text, int start, int end, UIInlineStyles styles, string? url, List<UIInlineSegment> segments, StringBuilder buffer)
    {
        var index = start;

        while (index < end)
        {
            var current = text[index];

            if (current == EscapeCharacter && index + 1 < end && IsMarkerCharacter(text[index + 1]))
            {
                _ = buffer.Append(text[index + 1]);
                index += 2;
                continue;
            }

            // Before the style markers: a code run's content is never parsed, so its marker stays literal.
            if (TryReadCode(text, index, end, out var codeEnd))
            {
                Flush(segments, buffer, styles, url);
                AppendLiteral(text.Text, index + 1, codeEnd, buffer);
                Flush(segments, buffer, styles | UIInlineStyles.Code, url);

                index = codeEnd + 1;
                continue;
            }

            if (TryReadStyle(text, index, end, out UIInlineStyles style, out var markerLength, out var contentEnd))
            {
                Flush(segments, buffer, styles, url);
                ParseRange(text, index + markerLength, contentEnd, styles | style, url, segments, buffer);
                Flush(segments, buffer, styles | style, url);

                index = contentEnd + markerLength;
                continue;
            }

            // Before the link, because both open on a bracket and only this one has the `!` in front of it.
            if (TryReadIcon(text, index, end, out var icon, out var iconEnd))
            {
                Flush(segments, buffer, styles, url);
                segments.Add(new UIInlineSegment(string.Empty, styles, url, icon));

                index = iconEnd;
                continue;
            }

            if (url is null && TryReadLink(text, index, end, out var labelStart, out var labelEnd, out var linkUrl, out var linkEnd))
            {
                Flush(segments, buffer, styles, url);
                ParseRange(text, labelStart, labelEnd, styles, linkUrl, segments, buffer);
                Flush(segments, buffer, styles, linkUrl);

                index = linkEnd;
                continue;
            }

            // A fold's text stays unparsed here and is parsed when it is rendered, which is how a fold may hold a fold.
            if (TryReadFold(text, index, end, out var caption, out var foldStart, out var foldEnd))
            {
                Flush(segments, buffer, styles, url);
                segments.Add(new UIInlineSegment(text.Text[foldStart..foldEnd], styles, null, null, caption));

                index = foldEnd + 1;
                continue;
            }

            _ = buffer.Append(current);
            index++;
        }
    }

    /// <summary>Finds where the code run starting at <paramref name="index"/> closes, by the same hugging rule every marker follows.</summary>
    private static bool TryReadCode(MarkupText text, int index, int end, out int contentEnd)
    {
        contentEnd = 0;

        if (text[index] != CodeMarker)
            return false;

        var contentStart = index + 1;

        if (contentStart >= end || IsSpace(text[contentStart]))
            return false;

        contentEnd = text.FindClosingMarker(contentStart, end, CodeMarker, 1);

        return contentEnd > contentStart;
    }

    /// <summary>
    /// Copies a range verbatim except for <c>\</c>, which lets a backtick be written inside a code run.
    /// </summary>
    private static void AppendLiteral(string text, int start, int end, StringBuilder buffer)
    {
        for (var index = start; index < end; index++)
        {
            if (text[index] == EscapeCharacter && index + 1 < end && IsMarkerCharacter(text[index + 1]))
            {
                _ = buffer.Append(text[index + 1]);
                index++;
                continue;
            }

            _ = buffer.Append(text[index]);
        }
    }

    private static void Flush(List<UIInlineSegment> segments, StringBuilder buffer, UIInlineStyles styles, string? url)
    {
        if (buffer.Length == 0)
            return;

        segments.Add(new UIInlineSegment(buffer.ToString(), styles, url));
        _ = buffer.Clear();
    }

    /// <summary>Finds where the style marker at <paramref name="index"/> closes; two-character markers are tried first, so <c>**</c> is never read as two italics.</summary>
    private static bool TryReadStyle(MarkupText text, int index, int end, out UIInlineStyles style, out int markerLength, out int contentEnd)
    {
        style = UIInlineStyles.None;
        markerLength = 0;
        contentEnd = 0;

        var current = text[index];

        if (current is not ('*' or '_' or '~'))
            return false;

        var doubled = index + 1 < end && text[index + 1] == current;

        if (current == '*')
        {
            style = doubled ? UIInlineStyles.Bold : UIInlineStyles.Italic;
            markerLength = doubled ? 2 : 1;
        }
        else if (doubled)
        {
            style = current == '_' ? UIInlineStyles.Underline : UIInlineStyles.Strikethrough;
            markerLength = 2;
        }
        else
        {
            // A lone `_` or `~` is ordinary punctuation, such as snake_case or a tilde in a path.
            return false;
        }

        var contentStart = index + markerLength;

        if (contentStart >= end || IsSpace(text[contentStart]))
            return false;

        contentEnd = text.FindClosingMarker(contentStart, end, current, markerLength);

        return contentEnd > contentStart;
    }

    /// <summary>
    /// Reads <c>![glyph]</c>; the value is a glyph name and only a glyph name, never a URL or a data payload.
    /// </summary>
    private static bool TryReadIcon(MarkupText text, int index, int end, out string? icon, out int iconEnd)
    {
        icon = null;
        iconEnd = 0;

        if (text[index] != IconMarker || index + 1 >= end || text[index + 1] != '[')
            return false;

        var contentStart = index + 2;
        var closing = text.FindClosingBracket(contentStart, end);

        if (closing <= contentStart || !IsGlyphName(text.Text.AsSpan(contentStart, closing - contentStart)))
            return false;

        icon = text.Text[contentStart..closing];
        iconEnd = closing + 1;

        return true;
    }

    /// <summary>Whether <paramref name="value"/> could name a glyph — a pack constant's characters, never something that could turn into a scheme, path or payload.</summary>
    private static bool IsGlyphName(ReadOnlySpan<char> value)
    {
        if (value.IsEmpty)
            return false;

        for (var i = 0; i < value.Length; i++)
        {
            if (!char.IsAsciiLetterOrDigit(value[i]) && value[i] is not ('-' or '_' or '.'))
                return false;
        }

        return true;
    }

    private static bool TryReadLink(MarkupText text, int index, int end, out int labelStart, out int labelEnd, out string? url, out int linkEnd)
    {
        labelStart = 0;
        labelEnd = 0;
        url = null;
        linkEnd = 0;

        if (text[index] != '[')
            return false;

        var closingLabel = text.FindClosingBracket(index + 1, end);

        if (closingLabel < 0 || closingLabel + 1 >= end || text[closingLabel + 1] != '(')
            return false;

        var closingUrl = text.FindClosingParen(closingLabel + 2, end);

        if (closingUrl < 0)
            return false;

        var candidate = text.ReadLinkUrl(closingLabel, closingUrl);

        if (candidate is null)
            return false;

        labelStart = index + 1;
        labelEnd = closingLabel;
        url = candidate;
        linkEnd = closingUrl + 1;

        return labelEnd > labelStart;
    }

    /// <summary>
    /// Whether a string may be safely rendered as a link target; rejects anything that could resolve to a <c>javascript:</c> scheme.
    /// </summary>
    [SuppressMessage("Design", "CA1054:URI-like parameters should not be strings", Justification = "This is the check that decides whether a raw authored string may become an href at all; taking a Uri would mean parsing it first, which is exactly what must not happen before the scheme is known to be safe.")]
    public static bool IsSafeUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        for (var i = 0; i < url.Length; i++)
        {
            if (char.IsControl(url[i]) || IsSpace(url[i]))
                return false;
        }

        if (url[0] is '/' or '#' or '?' or '.')
            return true;

        var colon = url.IndexOf(':', StringComparison.Ordinal);

        if (colon < 0)
            return true;

        var scheme = url[..colon];

        return scheme.Equals("http", StringComparison.OrdinalIgnoreCase)
            || scheme.Equals("https", StringComparison.OrdinalIgnoreCase)
            || scheme.Equals("mailto", StringComparison.OrdinalIgnoreCase)
            || scheme.Equals("tel", StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Reads <c>[caption]{text}</c>: the caption is plain text, and the braces nest so the text may hold a fold of its own.
    /// </summary>
    private static bool TryReadFold(MarkupText text, int index, int end, out string? caption, out int contentStart, out int contentEnd)
    {
        caption = null;
        contentStart = 0;
        contentEnd = -1;

        if (text[index] != '[')
            return false;

        var closingCaption = text.FindClosingBracket(index + 1, end);

        if (closingCaption <= index + 1 || closingCaption + 1 >= end || text[closingCaption + 1] != FoldOpen)
            return false;

        // A caption is a word or a few, never markup: a bracket opened inside it means the fold starts there, as a link inside a link's label does.
        if (text.HasOpeningBracket(index + 1, closingCaption))
            return false;

        var open = closingCaption + 1;

        contentStart = open + 1;
        contentEnd = text.FindMatchingBrace(open, end);

        if (contentEnd <= contentStart || text.BraceDepth(open) > MaxFoldDepth)
            return false;

        StringBuilder captionBuffer = new();

        AppendLiteral(text.Text, index + 1, closingCaption, captionBuffer);
        caption = captionBuffer.ToString();

        return true;
    }

    private static bool IsMarkerCharacter(char value)
        => value is '*' or '_' or '~' or '[' or ']' or '(' or ')' or FoldOpen or FoldClose or CodeMarker or EscapeCharacter;

    private static bool IsSpace(char value)
        => value is ' ' or '\t' or '\r' or '\n';
}
