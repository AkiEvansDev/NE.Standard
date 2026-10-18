using System;
using System.IO;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Html;

public sealed class HtmlContentBuilder : HtmlChildrenBuilder, IHtmlContent
{
    public void WriteTo(TextWriter writer)
    {
        ArgumentNullException.ThrowIfNull(writer);

        WriteChildren(writer);
    }
}
