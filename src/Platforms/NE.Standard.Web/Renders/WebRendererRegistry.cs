using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI.Common;

namespace NE.Standard.Web.Renders;

public static class WebRendererRegistry
{
    private static readonly Dictionary<Type, Func<IBlock, IInternalModel, ComponentBase, RenderFragment>> _renderers = [];

    public static void RegisterRenderer<T>(IBlockRenderer<T> renderer)
        where T : IBlock
    {
        _renderers[typeof(T)] = (el, model, context) => renderer.Render((T)el, model, context);
    }

    public static RenderFragment Render(IBlock el, IInternalModel model, ComponentBase context)
    {
        if (_renderers.TryGetValue(el.GetType(), out var renderer))
            return renderer(el, model, context);

        return builder => builder.AddContent(0, $"<!-- renderer not found for {el.GetType().Name} -->");
    }
}

public static class WebDefaultRenderers
{
    static WebDefaultRenderers()
    {

    }

    public static void Init() { }
}
