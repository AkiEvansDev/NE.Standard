using System;
using System.Collections.Generic;
using System.IO;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

/// <summary>
/// The child list a fragment and an element share: raw markup, text, nested elements and content, written in order.
/// </summary>
/// <remarks>A base rather than a list held by each: a page is tens of thousands of elements, and composition is one more object per element.</remarks>
public abstract class HtmlChildrenBuilder : IHtmlBuilder
{
    private readonly List<IHtmlContent> _children = [];

    private protected HtmlChildrenBuilder()
    {
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

    /// <summary>Writes the children in the order they were added.</summary>
    protected void WriteChildren(TextWriter writer)
    {
        for (var i = 0; i < _children.Count; i++)
            _children[i].WriteTo(writer);
    }
}
