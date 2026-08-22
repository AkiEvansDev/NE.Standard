using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Hosting;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public interface IWebViewRenderer
{
    WebRenderResult Render(UIViewResolution resolution);

    void RenderComponent(WebRenderContext parent, UIComponentId componentId);
}
