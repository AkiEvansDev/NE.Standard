namespace NE.Standard.UI.Web.Abstractions.Html;

public interface IHtmlElementBuilder : IHtmlBuilder
{
    IHtmlElementBuilder Class(string value);

    IHtmlElementBuilder Attribute(string name, string? value = null);

    IHtmlElementBuilder Style(string name, string value);
}
