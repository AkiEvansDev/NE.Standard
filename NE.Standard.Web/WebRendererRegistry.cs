using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<UIElement, UIStyleConfig, RenderFragment>> _renderers = new();

    public static void RegisterRenderer<T>(Func<T, UIStyleConfig, RenderFragment> renderer)
        where T : UIElement
    {
        _renderers[typeof(T)] = (el, style) => renderer((T)el, style);
    }

    public static RenderFragment Render(UIElement element, UIStyleConfig style)
    {
        if (_renderers.TryGetValue(element.GetType(), out var renderer))
            return renderer(element, style);

        return builder => builder.AddContent(0, $"<!-- renderer not found for {element.GetType().Name} -->");
    }
}
