namespace NE.Standard.UI.Web.Abstractions.Rendering;

public interface IWebComponentRenderer
{
    string ComponentTypeKey { get; }

    void Render(WebRenderContext context);
}
