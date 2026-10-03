using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace DemoApp.Views;

/// <summary>
/// A piece of controller code an example shows on its Controller tab: a type whole, or only the members of it named.
/// </summary>
internal sealed class DemoCode
{
    private DemoCode(Type type, string[] members)
    {
        Type = type;
        Members = members;
    }

    public Type Type { get; }

    public IReadOnlyList<string> Members { get; }

    /// <summary>The type whole, or, given names, those members inside its declaration — every overload of a name.</summary>
    public static DemoCode Of<T>(params string[] members)
        => new(typeof(T), members);
}

/// <summary>
/// The mechanism controllers' sources, embedded as written (<c>DemoApp.csproj</c>), and the reader that takes a type or its members
/// out of them by name.
/// </summary>
/// <remarks>
/// Brace matching over the text rather than marker comments in it, so the code shown is the code that runs and the controllers read
/// as ordinary code. A member is everything from the end of the one before it to its own end, its doc comment and attributes with it.
/// A name the sources do not hold throws, so the view that names it fails to compile.
/// </remarks>
internal static partial class DemoSources
{
    private const string ResourcePrefix = "DemoApp.Sources.";

    private static readonly Lazy<SourceType[]> Types = new(Load);

    private static readonly HashSet<string> Modifiers = new(StringComparer.Ordinal)
    {
        "public", "private", "protected", "internal", "static", "readonly", "const", "sealed", "override", "virtual", "abstract",
        "partial", "async", "new", "extern", "unsafe", "volatile", "required", "file"
    };

    /// <summary>The pieces, each found by name, one after another.</summary>
    public static string Read(IEnumerable<DemoCode> pieces)
        => string.Join("\n\n", pieces.Select(Read));

    /// <summary>A type whole, or the members named inside its declaration, in the order the file has them.</summary>
    public static string Read(DemoCode piece)
    {
        ArgumentNullException.ThrowIfNull(piece);

        SourceType type = Find(piece.Type);

        if (piece.Members.Count == 0)
            return type.Text;

        foreach (var name in piece.Members)
        {
            if (!type.Members.Any(member => member.Name == name))
                throw new InvalidOperationException($"'{type.Name}' declares no member '{name}' in the demo's embedded sources.");
        }

        StringBuilder text = new StringBuilder(type.Declaration).Append("\n{");
        var first = true;

        foreach (SourceMember member in type.Members)
        {
            if (!piece.Members.Contains(member.Name))
                continue;

            _ = text.Append(first ? "\n" : "\n\n").Append(Indent(member.Text));
            first = false;
        }

        return text.Append("\n}").ToString();
    }

    private static SourceType Find(Type type)
    {
        SourceType[] found = [.. Types.Value.Where(source => source.Name == type.Name && source.Namespace == type.Namespace)];

        return found.Length switch
        {
            1 => found[0],
            0 => throw new InvalidOperationException($"'{type.FullName}' is not among the demo's embedded sources (DemoApp.csproj, EmbeddedResource)."),
            _ => throw new InvalidOperationException($"'{type.FullName}' is declared more than once in the demo's embedded sources.")
        };
    }

    private static string Indent(string text)
    {
        var lines = text.Split('\n');

        return string.Join('\n', lines.Select(static line => line.Length == 0 ? line : "    " + line));
    }

    private static SourceType[] Load()
    {
        List<SourceType> types = [];

        foreach (var resource in typeof(DemoSources).Assembly.GetManifestResourceNames())
        {
            if (!resource.StartsWith(ResourcePrefix, StringComparison.Ordinal))
                continue;

            using Stream stream = typeof(DemoSources).Assembly.GetManifestResourceStream(resource)!;
            using StreamReader reader = new(stream);

            var text = reader.ReadToEnd().Replace("\r\n", "\n", StringComparison.Ordinal);
            var space = NamespaceDeclaration().Match(text) is { Success: true } match ? match.Groups[1].Value : string.Empty;

            _ = Parse(text, Mask(text), 0, text.Length, space, types);
        }

        return [.. types];
    }

    /// <summary>The text with every comment and every string and character literal blanked, its length and line breaks kept.</summary>
    private static string Mask(string text)
    {
        var code = text.ToCharArray();
        var i = 0;

        while (i < code.Length)
        {
            var c = code[i];
            var next = i + 1 < code.Length ? code[i + 1] : '\0';

            if (c == '/' && next == '/')
                i = Blank(code, i, text.IndexOf('\n', i) is var line and >= 0 ? line : code.Length);
            else if (c == '/' && next == '*')
                i = Blank(code, i, text.IndexOf("*/", i + 2, StringComparison.Ordinal) is var close and >= 0 ? close + 2 : code.Length);
            else if (c == '"')
                i = Blank(code, i, StringEnd(text, i));
            else if (c == '\'')
                i = Blank(code, i, CharEnd(text, i));
            else
                i++;
        }

        return new string(code);
    }

    private static int Blank(char[] code, int from, int to)
    {
        for (var i = from; i < to; i++)
        {
            if (code[i] != '\n')
                code[i] = ' ';
        }

        return to;
    }

    /// <summary>Just past the string literal opening at <paramref name="at"/>: raw, verbatim, interpolated (holes and all) or plain.</summary>
    private static int StringEnd(string text, int at)
    {
        var quotes = 0;

        while (at + quotes < text.Length && text[at + quotes] == '"')
            quotes++;

        if (quotes >= 3)
        {
            var close = text.IndexOf(new string('"', quotes), at + quotes, StringComparison.Ordinal);

            return close < 0 ? text.Length : close + quotes;
        }

        var prefix = text[Math.Max(0, at - 2)..at];
        var verbatim = prefix.Contains('@', StringComparison.Ordinal);
        var interpolated = prefix.Contains('$', StringComparison.Ordinal);
        var holes = 0;

        for (var i = at + 1; i < text.Length; i++)
        {
            var c = text[i];

            if (holes > 0)
            {
                if (c == '"')
                    i = StringEnd(text, i) - 1;
                else if (c == '{')
                    holes++;
                else if (c == '}')
                    holes--;
            }
            else if (c == '\\' && !verbatim)
            {
                i++;
            }
            else if (interpolated && c == '{')
            {
                if (i + 1 < text.Length && text[i + 1] == '{')
                    i++;
                else
                    holes++;
            }
            else if (c == '"')
            {
                if (verbatim && i + 1 < text.Length && text[i + 1] == '"')
                    i++;
                else
                    return i + 1;
            }
            else if (c == '\n' && !verbatim)
            {
                return i;
            }
        }

        return text.Length;
    }

    private static int CharEnd(string text, int at)
    {
        for (var i = at + 1; i < text.Length; i++)
        {
            if (text[i] == '\\')
                i++;
            else if (text[i] is '\'' or '\n')
                return i + 1;
        }

        return text.Length;
    }

    /// <summary>The members between two offsets, the types among them kept in <paramref name="types"/> with members of their own.</summary>
    private static List<SourceMember> Parse(string text, string code, int start, int end, string space, List<SourceType> types)
    {
        List<SourceMember> members = [];

        foreach ((var from, var to) in Split(code, start, end))
        {
            var header = Flatten(code, from, FindHeaderEnd(code, from, to));
            var body = Dedent(text[from..to]);

            if (TypeDeclaration().Match(header) is { Success: true } declared)
            {
                var name = declared.Groups[1].Value;
                var open = FindBody(code, from, to);
                List<SourceMember> nested = open < 0 || declared.Value.StartsWith("enum", StringComparison.Ordinal)
                    ? []
                    : Parse(text, code, open + 1, to - 1, space, types);
                var lineStart = text.LastIndexOf('\n', from + declared.Index) + 1;
                var declaration = Dedent(text[lineStart..(open < 0 ? to : open)]).TrimEnd();

                types.Add(new SourceType(space, name, body, declaration, [.. nested]));
                members.Add(new SourceMember(name, body));
            }
            else if (MemberName(header) is { Length: > 0 } name)
            {
                members.Add(new SourceMember(name, body));
            }
        }

        return members;
    }

    /// <summary>
    /// The members between two offsets, each from the end of the one before: a member ends at a semicolon or at the brace that closes
    /// its body, unless an initializer follows that brace (<c>{ get; } = [...];</c>).
    /// </summary>
    private static List<(int From, int To)> Split(string code, int start, int end)
    {
        List<(int, int)> chunks = [];
        var depth = 0;
        var from = start;
        var initialized = false;

        for (var i = start; i < end; i++)
        {
            var c = code[i];

            if (c is '(' or '[' or '{')
            {
                depth++;
            }
            else if (c is ')' or ']' or '}')
            {
                depth--;

                if (depth == 0 && c == '}' && !initialized && !FollowedBy(code, i + 1, end, '=', ';'))
                    Close(i + 1);
            }
            else if (depth == 0 && c == '=')
            {
                initialized = true;
            }
            else if (depth == 0 && c == ';')
            {
                Close(i + 1);
            }
        }

        return chunks;

        void Close(int to)
        {
            if (!string.IsNullOrWhiteSpace(code[from..to]))
                chunks.Add((from, to));

            from = to;
            initialized = false;
        }
    }

    private static bool FollowedBy(string code, int at, int end, char first, char second)
    {
        while (at < end && char.IsWhiteSpace(code[at]))
            at++;

        return at < end && (code[at] == first || code[at] == second);
    }

    /// <summary>
    /// Where a member's header ends: its first bracket, <c>=</c> or <c>;</c> outside brackets — a parenthesis after a modifier opens a
    /// tuple type, not a parameter list, and is skipped.
    /// </summary>
    private static int FindHeaderEnd(string code, int from, int to)
    {
        var depth = 0;

        for (var i = from; i < to; i++)
        {
            var c = code[i];

            if (depth == 0 && (c is '{' or '=' or ';' || (c == '(' && FollowsName(code, from, i))))
                return i;

            if (c is '(' or '[' or '{')
                depth++;
            else if (c is ')' or ']' or '}')
                depth--;
        }

        return to - 1;
    }

    private static bool FollowsName(string code, int from, int at)
    {
        var end = at;

        while (end > from && char.IsWhiteSpace(code[end - 1]))
            end--;

        var start = end;

        while (start > from && IsNameChar(code[start - 1]))
            start--;

        return start < end && !Modifiers.Contains(code[start..end]);
    }

    private static bool IsNameChar(char c)
        => char.IsLetterOrDigit(c) || c == '_';

    /// <summary>The header with everything inside brackets blanked (attributes, a tuple type), so only its own words are read.</summary>
    private static string Flatten(string code, int from, int to)
    {
        StringBuilder header = new(to - from);
        var depth = 0;

        for (var i = from; i < to; i++)
        {
            var c = code[i];

            if (c is '(' or '[' or '{')
                depth++;

            _ = header.Append(depth == 0 ? c : ' ');

            if (c is ')' or ']' or '}')
                depth--;
        }

        return header.ToString();
    }

    /// <summary>The text from its first line that holds anything, every line moved left by the least indentation among them.</summary>
    private static string Dedent(string text)
    {
        var lines = text.Split('\n');
        var first = Array.FindIndex(lines, static line => !string.IsNullOrWhiteSpace(line));

        if (first < 0)
            return string.Empty;

        var cut = lines.Skip(first).Where(static line => !string.IsNullOrWhiteSpace(line)).Min(static line => line.Length - line.TrimStart().Length);

        return string.Join('\n', lines.Skip(first).Select(line => string.IsNullOrWhiteSpace(line) ? string.Empty : line[cut..].TrimEnd()));
    }

    /// <summary>A type's opening brace: the first outside brackets, past a primary constructor's parameters and a base call.</summary>
    private static int FindBody(string code, int from, int to)
    {
        var depth = 0;

        for (var i = from; i < to; i++)
        {
            var c = code[i];

            if (depth == 0 && c == '{')
                return i;

            if (c is '(' or '[' or '{')
                depth++;
            else if (c is ')' or ']' or '}')
                depth--;
        }

        return -1;
    }

    /// <summary>The identifier just before the header's end, past a generic argument list.</summary>
    private static string MemberName(string header)
    {
        var end = header.TrimEnd().Length;

        if (end > 0 && header[end - 1] == '>')
        {
            var depth = 0;

            for (end--; end >= 0; end--)
            {
                if (header[end] == '>')
                    depth++;
                else if (header[end] == '<' && --depth == 0)
                    break;
            }

            end = header[..Math.Max(0, end)].TrimEnd().Length;
        }

        var start = end;

        while (start > 0 && IsNameChar(header[start - 1]))
            start--;

        return header[start..end];
    }

    [GeneratedRegex(@"^namespace\s+([\w.]+)\s*;", RegexOptions.Multiline)]
    private static partial Regex NamespaceDeclaration();

    [GeneratedRegex(@"\b(?:class|struct|interface|enum|record(?:\s+(?:class|struct))?)\s+(\w+)")]
    private static partial Regex TypeDeclaration();

    private sealed record SourceType(string Namespace, string Name, string Text, string Declaration, IReadOnlyList<SourceMember> Members);

    private sealed record SourceMember(string Name, string Text);
}
