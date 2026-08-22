using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

public sealed class HtmlContentBuilder : IHtmlBuilder, IHtmlContent
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

    private readonly List<IHtmlContent> _children = [];

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

        for (var i = 0; i < _children.Count; i++)
            _children[i].WriteTo(writer);
    }
}
