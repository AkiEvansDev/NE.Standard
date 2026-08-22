using System.IO;

namespace NE.Standard.UI.Web.Abstractions.Html;

public interface IHtmlContent
{
    void WriteTo(TextWriter writer);
}
