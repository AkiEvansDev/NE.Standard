using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

internal sealed class HtmlElementBuilder : IHtmlElementBuilder, IHtmlContent
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

    private readonly List<KeyValuePair<string, string?>> _attributes = [];
    private readonly List<IHtmlContent> _children = [];

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
    /// Adds an inline style; a value that formats to nothing is left out, so the stylesheet's own applies, rather than failing the page.
    /// </summary>
    public IHtmlElementBuilder Style(string name, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        if (string.IsNullOrWhiteSpace(value))
            return this;

        (_styles ??= []).Add(new KeyValuePair<string, string>(name, value));

        return this;
    }

    public IHtmlBuilder Raw(string value)
    {
        ArgumentNullException.ThrowIfNull(value);

        _children.Add(new RawHtmlContent(value));

        return this;
    }

    public IHtmlBuilder Text(string value)
    {
        ArgumentNullException.ThrowIfNull(value);

        _children.Add(new TextHtmlContent(value));

        return this;
    }

    public IHtmlBuilder Element(string tag, Action<IHtmlElementBuilder> configure)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tag);
        ArgumentNullException.ThrowIfNull(configure);

        HtmlElementBuilder element = new(tag);
        configure(element);

        _children.Add(element);

        return this;
    }

    public IHtmlBuilder Content(IHtmlContent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        _children.Add(content);

        return this;
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

        for (var i = 0; i < _children.Count; i++)
            _children[i].WriteTo(writer);

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
