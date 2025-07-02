using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<UIElement, UIStyleConfig, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(Func<T, UIStyleConfig, RenderFragment> renderer)
        where T : UIElement
    {
        _renderers[typeof(T)] = (element, style) => renderer((T)element, style);
    }

    public static RenderFragment Render(UIElement element, UIStyleConfig style)
    {
        return _renderers[element.GetType()].Invoke(element, style);
    }
}
