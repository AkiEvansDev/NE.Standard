using System;
using System.Buffers;
using System.Collections.Generic;
using System.IO;
using System.Net;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

internal sealed class HtmlElementBuilder : HtmlChildrenBuilder, IHtmlElementBuilder, IHtmlContent
{
    private static readonly HashSet<string> VoidElements = new(StringComparer.OrdinalIgnoreCase)
    {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "source",
        "track",
        "wbr"
    };

    // What a style may hold only inside a quoted string: outside one each ends the declaration, opens a block or starts an escape,
    // and a raw control character ends the string itself. `*` for a comment's start, `/*`: it would hide what follows, the next
    // declaration's end among it, so a later value's quoted text would stand outside any string.
    private static readonly SearchValues<char> StyleDelimiters = SearchValues.Create(StyleDelimiterCharacters());

    private const char NoQuote = '\0';

    private readonly List<KeyValuePair<string, string?>> _attributes = [];

    // Made on first use: most elements carry no inline style and many no class, and a page is tens of thousands of elements.
    private List<string>? _classes;
    private List<KeyValuePair<string, string>>? _styles;

    public HtmlElementBuilder(string tag)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tag);
        Tag = tag;
    }

    public string Tag { get; }

    /// <summary>
    /// Adds a class, ignoring one the element already carries, since a repeat would print the class twice; an empty one — what a
    /// class switch answers for a value it does not know — adds nothing rather than failing the page.
    /// </summary>
    public IHtmlElementBuilder Class(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return this;

        _classes ??= [];

        // List<string>.Contains is ordinal already; the comparer overload would enumerate through an allocated enumerator.
        if (!_classes.Contains(value))
            _classes.Add(value);

        return this;
    }

    /// <summary>
    /// Adds an attribute, replacing one of the same name — the last write wins, since a repeated attribute would be invalid HTML.
    /// </summary>
    public IHtmlElementBuilder Attribute(string name, string? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        for (var i = 0; i < _attributes.Count; i++)
        {
            if (string.Equals(_attributes[i].Key, name, StringComparison.OrdinalIgnoreCase))
            {
                _attributes[i] = new KeyValuePair<string, string?>(name, value);

                return this;
            }
        }

        _attributes.Add(new KeyValuePair<string, string?>(name, value));

        return this;
    }

    /// <summary>
    /// Adds an inline style; a value that formats to nothing is left out, so the stylesheet's own applies, rather than failing the page —
    /// and so is one that would end its declaration (a <c>;</c>, a brace, a backslash or a comment's start outside a quoted string, an
    /// unclosed string).
    /// </summary>
    /// <remarks>HTML encoding keeps a value inside the attribute; only this keeps a bound string from adding declarations of its own.</remarks>
    public IHtmlElementBuilder Style(string name, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        if (name.AsSpan().IndexOfAny(StyleDelimiters) >= 0 || name.Contains(':', StringComparison.Ordinal))
            throw new ArgumentException($"Style property name '{name}' holds a character no property name has.", nameof(name));

        if (string.IsNullOrWhiteSpace(value) || !IsOneDeclarationValue(value))
            return this;

        (_styles ??= []).Add(new KeyValuePair<string, string>(name, value));

        return this;
    }

    /// <summary>
    /// Whether a value stays one declaration's: every delimiter inside a closed quoted string, as <c>WebCssValues.CssString</c> writes one.
    /// </summary>
    internal static bool IsOneDeclarationValue(ReadOnlySpan<char> value)
    {
        // The common case, a number or a variable, holds none at all.
        if (value.IndexOfAny(StyleDelimiters) < 0)
            return true;

        var quote = NoQuote;

        for (var i = 0; i < value.Length; i++)
        {
            var c = value[i];

            if (char.IsControl(c))
                return false;

            if (quote != NoQuote)
            {
                if (c == '\\')
                {
                    // An escape takes the next character, which a string cannot end on.
                    if (++i >= value.Length || char.IsControl(value[i]))
                        return false;
                }
                else if (c == quote)
                {
                    quote = NoQuote;
                }

                continue;
            }

            if (c is '"' or '\'')
                quote = c;
            else if (c is ';' or '{' or '}' or '\\' || (c == '/' && i + 1 < value.Length && value[i + 1] == '*'))
                return false;
        }

        return quote == NoQuote;
    }

    private static string StyleDelimiterCharacters()
    {
        var characters = new char[32 + 8];

        for (var i = 0; i < 32; i++)
            characters[i] = (char)i;

        ";{}\\\"'*".CopyTo(characters.AsSpan(32));
        characters[^1] = '\u007F';

        return new string(characters);
    }

    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.Write('<');
        writer.Write(Tag);

        if (_classes is { Count: > 0 } classes)
            WriteClassAttribute(writer, classes);

        for (var i = 0; i < _attributes.Count; i++)
        {
            KeyValuePair<string, string?> attribute = _attributes[i];
            WriteAttribute(writer, attribute.Key, attribute.Value);
        }

        if (_styles is { Count: > 0 } styles)
            WriteStyleAttribute(writer, styles);

        if (VoidElements.Contains(Tag))
        {
            writer.Write('>');
            return;
        }

        writer.Write('>');

        WriteChildren(writer);

        writer.Write("</");
        writer.Write(Tag);
        writer.Write('>');
    }

    // Encoded straight into the writer: the string-returning overload allocates a copy of every value that needs escaping.
    private static void WriteClassAttribute(TextWriter writer, List<string> classes)
    {
        writer.Write(" class=\"");

        for (var i = 0; i < classes.Count; i++)
        {
            if (i > 0)
                writer.Write(' ');

            WebUtility.HtmlEncode(classes[i], writer);
        }

        writer.Write('"');
    }

    private static void WriteAttribute(TextWriter writer, string name, string? value)
    {
        writer.Write(' ');
        writer.Write(name);

        if (value is null)
            return;

        writer.Write("=\"");
        WebUtility.HtmlEncode(value, writer);
        writer.Write('"');
    }

    private static void WriteStyleAttribute(TextWriter writer, List<KeyValuePair<string, string>> styles)
    {
        writer.Write(" style=\"");

        for (var i = 0; i < styles.Count; i++)
        {
            if (i > 0)
                writer.Write("; ");

            KeyValuePair<string, string> style = styles[i];

            WebUtility.HtmlEncode(style.Key, writer);
            writer.Write(": ");
            WebUtility.HtmlEncode(style.Value, writer);
        }

        writer.Write('"');
    }
}
