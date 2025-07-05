using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<IUIElement, UIPageResult, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(Func<T, UIPageResult, RenderFragment> renderer)
        where T : IUIElement
    {
        _renderers[typeof(T)] = (el, style) => renderer((T)el, style);
    }

    public static RenderFragment Render(IUIElement element, UIPageResult page)
    {
        if (_renderers.TryGetValue(element.GetType(), out var renderer))
            return renderer(element, page);

        return builder => builder.AddContent(0, $"<!-- renderer not found for {element.GetType().Name} -->");
    }
}
