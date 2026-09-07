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
    private const char EscapeCharacter = '\\';
    private const char CodeMarker = '`';
    private const char IconMarker = '!';
    private const char FoldOpen = '{';
    private const char FoldClose = '}';

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

        ParseRange(text, 0, text.Length, UIInlineStyles.None, null, segments, buffer);
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
    /// Strips the markup, leaving the text a reader would see — for the places that take a plain string, such
    /// as an <c>aria-label</c>. A fold reads unfolded: its caption, then its text.
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
    /// Escapes every marker in a value so it reads as the text it is.
    /// </summary>
    /// <remarks>
    /// Escape a value before substituting it into a localized string so it cannot turn the rest of the sentence into markup.
    /// </remarks>
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

    private static void ParseRange(string text, int start, int end, UIInlineStyles styles, string? url, List<UIInlineSegment> segments, StringBuilder buffer)
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
                AppendLiteral(text, index + 1, codeEnd, buffer);
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
                segments.Add(new UIInlineSegment(text[foldStart..foldEnd], styles, null, null, caption));

                index = foldEnd + 1;
                continue;
            }

            _ = buffer.Append(current);
            index++;
        }
    }

    /// <summary>
    /// Reads a code marker at <paramref name="index"/> and finds where its run closes, by the same hugging
    /// rule every other marker follows.
    /// </summary>
    private static bool TryReadCode(string text, int index, int end, out int contentEnd)
    {
        contentEnd = 0;

        if (text[index] != CodeMarker)
            return false;

        var contentStart = index + 1;

        if (contentStart >= end || IsSpace(text[contentStart]))
            return false;

        contentEnd = FindClosingMarker(text, contentStart, end, CodeMarker, 1);

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

    /// <summary>
    /// Reads a style marker at <paramref name="index"/> and finds where its run closes; two-character markers
    /// are tried first, so <c>**</c> is never read as two italics.
    /// </summary>
    private static bool TryReadStyle(string text, int index, int end, out UIInlineStyles style, out int markerLength, out int contentEnd)
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

        contentEnd = FindClosingMarker(text, contentStart, end, current, markerLength);

        return contentEnd > contentStart;
    }

    private static int FindClosingMarker(string text, int contentStart, int end, char marker, int markerLength)
    {
        for (var index = contentStart; index + markerLength <= end; index++)
        {
            if (text[index] == EscapeCharacter)
            {
                index++;
                continue;
            }

            if (text[index] != marker)
                continue;

            // The doubled marker must be exactly doubled, so `***a***` closes as bold wrapping italic.
            if (markerLength == 2 && (index + 1 >= end || text[index + 1] != marker))
                continue;

            if (markerLength == 1 && index + 1 < end && text[index + 1] == marker)
                continue;

            if (index > contentStart && !IsSpace(text[index - 1]))
                return index;
        }

        return -1;
    }

    /// <summary>
    /// Reads <c>![glyph]</c>; the value is a glyph name and only a glyph name, never a URL or a data payload.
    /// </summary>
    private static bool TryReadIcon(string text, int index, int end, out string? icon, out int iconEnd)
    {
        icon = null;
        iconEnd = 0;

        if (text[index] != IconMarker || index + 1 >= end || text[index + 1] != '[')
            return false;

        var contentStart = index + 2;
        var closing = FindClosingBracket(text, contentStart, end);

        if (closing <= contentStart || !IsGlyphName(text.AsSpan(contentStart, closing - contentStart)))
            return false;

        icon = text[contentStart..closing];
        iconEnd = closing + 1;

        return true;
    }

    /// <summary>The <c>]</c> closing a bracket opened before <paramref name="start"/>, honouring escapes; -1 when there is none.</summary>
    private static int FindClosingBracket(string text, int start, int end)
    {
        for (var scan = start; scan < end; scan++)
        {
            if (text[scan] == EscapeCharacter)
            {
                scan++;
                continue;
            }

            if (text[scan] == ']')
                return scan;
        }

        return -1;
    }

    /// <summary>
    /// What may name a glyph: the characters a pack's constants are made of, and nothing that could turn into
    /// a scheme, a path or a payload.
    /// </summary>
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

    private static bool TryReadLink(string text, int index, int end, out int labelStart, out int labelEnd, out string? url, out int linkEnd)
    {
        labelStart = 0;
        labelEnd = 0;
        url = null;
        linkEnd = 0;

        if (text[index] != '[')
            return false;

        var closingLabel = FindClosingBracket(text, index + 1, end);

        if (closingLabel < 0 || closingLabel + 1 >= end || text[closingLabel + 1] != '(')
            return false;

        var closingUrl = text.IndexOf(')', closingLabel + 2);

        if (closingUrl < 0 || closingUrl >= end)
            return false;

        var candidate = text[(closingLabel + 2)..closingUrl].Trim();

        if (!IsSafeUrl(candidate))
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
    private static bool TryReadFold(string text, int index, int end, out string? caption, out int contentStart, out int contentEnd)
    {
        caption = null;
        contentStart = 0;
        contentEnd = -1;

        if (text[index] != '[')
            return false;

        var closingCaption = FindClosingBracket(text, index + 1, end);

        if (closingCaption <= index + 1 || closingCaption + 1 >= end || text[closingCaption + 1] != FoldOpen)
            return false;

        // A caption is a word or a few, never markup: a bracket opened inside it means the fold starts there, as a link inside a link's label does.
        for (var scan = index + 1; scan < closingCaption; scan++)
        {
            if (text[scan] == EscapeCharacter)
                scan++;
            else if (text[scan] == '[')
                return false;
        }

        contentStart = closingCaption + 2;

        var depth = 1;

        for (var scan = contentStart; scan < end && contentEnd < 0; scan++)
        {
            if (text[scan] == EscapeCharacter)
            {
                scan++;
                continue;
            }

            if (text[scan] == FoldOpen)
                depth++;
            else if (text[scan] == FoldClose && --depth == 0)
                contentEnd = scan;
        }

        if (contentEnd <= contentStart)
            return false;

        StringBuilder captionBuffer = new();

        AppendLiteral(text, index + 1, closingCaption, captionBuffer);
        caption = captionBuffer.ToString();

        return true;
    }

    private static bool IsMarkerCharacter(char value)
        => value is '*' or '_' or '~' or '[' or ']' or '(' or ')' or FoldOpen or FoldClose or CodeMarker or EscapeCharacter;

    private static bool IsSpace(char value)
        => value is ' ' or '\t' or '\r' or '\n';
}
