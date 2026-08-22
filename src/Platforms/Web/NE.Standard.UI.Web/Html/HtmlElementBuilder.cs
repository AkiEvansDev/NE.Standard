using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

internal sealed class HtmlElementBuilder : IHtmlElementBuilder, IHtmlContent
{
    private sealed class RawHtmlContent(string value) : IHtmlContent
    {
        public void WriteTo(TextWriter writer)
        {
            ArgumentNullException.ThrowIfNull(writer);
            writer.Write(value);
        }
    }

    private sealed class TextHtmlContent(string value) : IHtmlContent
    {
        public void WriteTo(TextWriter writer)
        {
            ArgumentNullException.ThrowIfNull(writer);
            writer.Write(WebUtility.HtmlEncode(value));
        }
    }

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
    private readonly List<string> _classes = [];
    private readonly List<KeyValuePair<string, string>> _styles = [];
    private readonly List<IHtmlContent> _children = [];

    public HtmlElementBuilder(string tag)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tag);
        Tag = tag;
    }

    public string Tag { get; }

    public IHtmlElementBuilder Class(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        _classes.Add(value);

        return this;
    }

    public IHtmlElementBuilder Attribute(string name, string? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        _attributes.Add(new KeyValuePair<string, string?>(name, value));

        return this;
    }

    public IHtmlElementBuilder Style(string name, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        _styles.Add(new KeyValuePair<string, string>(name, value));

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

    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.Write('<');
        writer.Write(Tag);

        if (_classes.Count != 0)
            WriteClassAttribute(writer);

        for (var i = 0; i < _attributes.Count; i++)
        {
            KeyValuePair<string, string?> attribute = _attributes[i];
            WriteAttribute(writer, attribute.Key, attribute.Value);
        }

        if (_styles.Count != 0)
            WriteStyleAttribute(writer);

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

    private void WriteClassAttribute(TextWriter writer)
    {
        writer.Write(" class=\"");

        for (var i = 0; i < _classes.Count; i++)
        {
            if (i > 0)
                writer.Write(' ');

            writer.Write(WebUtility.HtmlEncode(_classes[i]));
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
        writer.Write(WebUtility.HtmlEncode(value));
        writer.Write('"');
    }

    private void WriteStyleAttribute(TextWriter writer)
    {
        writer.Write(" style=\"");

        for (var i = 0; i < _styles.Count; i++)
        {
            if (i > 0)
                writer.Write("; ");

            KeyValuePair<string, string> style = _styles[i];

            writer.Write(WebUtility.HtmlEncode(style.Key));
            writer.Write(": ");
            writer.Write(WebUtility.HtmlEncode(style.Value));
        }

        writer.Write('"');
    }
}
