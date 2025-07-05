using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Web.Renders;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<IUIElement, UIPageResult, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(Func<T, UIPageResult, RenderFragment> renderer)
        where T : IUIElement
    {
        _renderers[typeof(T)] = (el, page) => renderer((T)el, page);
    }

    public static RenderFragment Render(IUIElement element, UIPageResult page)
    {
        if (_renderers.TryGetValue(element.GetType(), out var renderer))
            return renderer(element, page);

        return builder => builder.AddContent(0, $"<!-- renderer not found for {element.GetType().Name} -->");
    }
}

public static class WebDefaultRenderers
{
    static WebDefaultRenderers()
    {
        WebRendererRegistry.RegisterRenderer<UIGrid>(UIGridRender.Render);
        WebRendererRegistry.RegisterRenderer<UILabel>(UILabelRender.Render);
        WebRendererRegistry.RegisterRenderer<UIButton>(UIButtonRender.Render);
    }

    public static void Init() { }
}
