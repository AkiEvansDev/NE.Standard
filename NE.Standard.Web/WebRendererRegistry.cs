using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Web.Renders;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<IUIElement, UIPageResult, BindingContext, AppHost, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(Func<T, UIPageResult, BindingContext, AppHost, RenderFragment> renderer)
        where T : IUIElement
    {
        _renderers[typeof(T)] = (el, page, context, host) => renderer((T)el, page, context, host);
    }

    public static RenderFragment Render(IUIElement element, UIPageResult page, BindingContext context, AppHost host)
    {
        if (_renderers.TryGetValue(element.GetType(), out var renderer))
            return renderer(element, page, context, host);

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
