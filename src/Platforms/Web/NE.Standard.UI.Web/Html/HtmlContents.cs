using System;
using System.IO;
using System.Net;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

/// <summary>Markup written as it is: the caller vouches for it.</summary>
internal sealed class RawHtmlContent(string value) : IHtmlContent
{
    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.Write(value);
    }
}

/// <summary>Text written encoded — the one place rendered text is made safe for the page, shared by both builders.</summary>
internal sealed class TextHtmlContent(string value) : IHtmlContent
{
    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);
        writer.Write(WebUtility.HtmlEncode(value));
    }
}
