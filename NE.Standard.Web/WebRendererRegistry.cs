using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using NE.Standard.Web.Renders;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<IUIElement, IModel, IDataBuilder, ComponentBase, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(IUIElementRenderer<T> renderer)
        where T : IUIElement
    {
        _renderers[typeof(T)] = (el, model, data, context) => renderer.Render((T)el, model, data, context);
    }

    public static RenderFragment Render(IUIElement el, IModel model, IDataBuilder data, ComponentBase context)
    {
        if (_renderers.TryGetValue(el.GetType(), out var renderer))
            return renderer(el, model, data, context);

        return builder => builder.AddContent(0, $"<!-- renderer not found for {el.GetType().Name} -->");
    }
}

public static class WebDefaultRenderers
{
    static WebDefaultRenderers()
    {
        WebRendererRegistry.RegisterRenderer(new UIGridRenderer());
        WebRendererRegistry.RegisterRenderer(new UILabelRenderer());
        WebRendererRegistry.RegisterRenderer(new UIButtonRenderer());
    }

    public static void Init() { }
}
