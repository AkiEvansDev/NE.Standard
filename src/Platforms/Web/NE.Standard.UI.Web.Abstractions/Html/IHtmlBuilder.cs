using System;

namespace NE.Standard.UI.Web.Abstractions.Html;

public interface IHtmlBuilder
{
    IHtmlBuilder Raw(string value);

    IHtmlBuilder Text(string value);

    IHtmlBuilder Element(string tag, Action<IHtmlElementBuilder> configure);
}
