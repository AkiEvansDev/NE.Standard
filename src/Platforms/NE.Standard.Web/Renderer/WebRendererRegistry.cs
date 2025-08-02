using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Web.Components;
using System.Collections.Concurrent;

namespace NE.Standard.Web.Renderer;

public static class WebRendererRegistry
{
    private static readonly ConcurrentDictionary<Type, IBlockRenderer> _renderers = [];

    public static void RegisterRenderer<TBlock, TRenderer>()
        where TBlock : class, IBlock
        where TRenderer : class, IBlockRenderer<TBlock>, new()
    {
        _renderers.TryAdd(typeof(TBlock), new TRenderer());
    }

    public static void Render(ref int seq, RenderTreeBuilder builder, IBlock block, ISessionContext? context, BlockWrapper component, bool ignoreComponent = false)
    {
        if (_renderers.TryGetValue(block.GetType(), out var renderer))
            renderer.Render(ref seq, builder, block, context, component, ignoreComponent);
        else
            builder.AddContent(seq++, $"<!-- renderer not found for {block.GetType().Name} -->");
    }
}
