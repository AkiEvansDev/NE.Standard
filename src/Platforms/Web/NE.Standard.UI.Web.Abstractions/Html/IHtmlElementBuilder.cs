namespace NE.Standard.UI.Web.Abstractions.Html;

public interface IHtmlElementBuilder : IHtmlBuilder
{
    /// <summary>Adds a class once; an empty value adds nothing.</summary>
    IHtmlElementBuilder Class(string value);

    IHtmlElementBuilder Attribute(string name, string? value = null);

    /// <summary>Adds an inline style; an empty value adds nothing, so the stylesheet's own applies, and an empty name is refused.</summary>
    IHtmlElementBuilder Style(string name, string value);
}
