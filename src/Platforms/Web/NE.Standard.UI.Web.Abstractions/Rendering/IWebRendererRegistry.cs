using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public interface IWebRendererRegistry
{
    bool TryGet(string componentTypeKey, [NotNullWhen(true)] out IWebComponentRenderer? renderer);

    IWebComponentRenderer GetRequired(string componentTypeKey);
}
