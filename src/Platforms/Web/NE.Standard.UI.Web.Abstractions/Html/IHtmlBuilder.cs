using System;

namespace NE.Standard.UI.Web.Abstractions.Html;

public interface IHtmlBuilder
{
    IHtmlBuilder Raw(string value);

    IHtmlBuilder Text(string value);

    IHtmlBuilder Element(string tag, Action<IHtmlElementBuilder> configure);

    /// <summary>Adds markup already built elsewhere as it stands, written when this builder is — never turned into a string first.</summary>
    IHtmlBuilder Content(IHtmlContent content);
}
