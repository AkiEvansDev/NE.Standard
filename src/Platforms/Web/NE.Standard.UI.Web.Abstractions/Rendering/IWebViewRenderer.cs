using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Hosting;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public interface IWebViewRenderer
{
    /// <summary>
    /// Renders a resolved view, optionally with this session's values already in it rather than left to the
    /// client — see <see cref="IWebRenderValues"/>.
    /// </summary>
    WebRenderResult Render(UIViewResolution resolution, IWebRenderValues? values = null);

    void RenderComponent(WebRenderContext parent, UIComponentId componentId);
}
