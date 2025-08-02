using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.Extensions.Logging;
using NE.Standard.Design.Common;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Extensions;
using NE.Standard.Web.Components;

namespace NE.Standard.Web.Renderer;

public interface IBlockRenderer
{
    void Render(ref int seq, RenderTreeBuilder builder, IBlock block, ISessionContext? context, BlockWrapper component, bool ignoreComponent);
}

public interface IBlockRenderer<T> : IBlockRenderer
    where T : class, IBlock
{
    string RootElement { get; }

    void RenderAttribute(ref int seq, RenderTreeBuilder builder, T block, ISessionContext? context, BlockWrapper component);
    void RenderContent(ref int seq, RenderTreeBuilder builder, T block, ISessionContext? context, BlockWrapper component);

    List<string> GetStyles(T block);
    List<string> GetClasses(T block);
}

public abstract class BlockRendererBase<TBlock> : IBlockRenderer<TBlock>
    where TBlock : class, IBlock
{
    public virtual string RootElement { get; } = "div";

    public void Render(ref int seq, RenderTreeBuilder builder, IBlock block, ISessionContext? context, BlockWrapper component, bool ignoreComponent)
    {
        RenderUtils.Render(ref seq, this, builder, (TBlock)block, context, component, ignoreComponent);
    }

    public virtual void RenderAttribute(ref int seq, RenderTreeBuilder builder, TBlock block, ISessionContext? context, BlockWrapper component) { }
    public abstract void RenderContent(ref int seq, RenderTreeBuilder builder, TBlock block, ISessionContext? context, BlockWrapper component);

    public virtual List<string> GetStyles(TBlock block) => CssGenerator.GenerateBlockStyles(block);
    public virtual List<string> GetClasses(TBlock block) => CssGenerator.GenerateBlockClasses(block);

    protected object? GetBindingValue(TBlock block, ISessionContext? context, string property, object? value)
    {
        if (context?.BindingContext?.TryGetPath(block, property, out var path) == true)
            return context.Model!.GetValue(path);

        return value;
    }
}

public static class RenderUtils
{
    public static void Render<T>(
        ref int seq,
        IBlockRenderer<T> renderer,
        RenderTreeBuilder builder,
        T block,
        ISessionContext? context,
        BlockWrapper component,
        bool ignoreComponent
    ) where T : class, IBlock
    {
        var key = context?.BindingContext?.GetKey(block);

        if (!ignoreComponent && NeedComponent(block))
        {
#if DEBUG
            context?.Logger.LogDebug("RenderComponent: {Block} => {Key}", block.GetType().Name, key);
#endif
            builder.OpenComponent<DynamicComponent>(seq++);
            builder.SetKey(key);

            builder.AddAttribute(seq++, "Type", typeof(BlockWrapper<T, IBlockRenderer<T>>));
            builder.AddAttribute(seq++, "Parameters", new Dictionary<string, object?>
            {
                ["Id"] = block.Id,
                ["Key"] = key,
                ["Block"] = block,
                ["Context"] = context,
                ["Renderer"] = renderer
            });

            builder.CloseComponent();
            return;
        }
#if DEBUG
        context?.Logger.LogDebug("Render: {Block} => {Key}", block.GetType().Name, key);
#endif
        if (!ignoreComponent)
            builder.OpenRegion(seq++);

        builder.OpenElement(seq++, renderer.RootElement);

        if (!ignoreComponent)
            builder.SetKey(key);

        builder.AddAttribute(seq++, "id", block.Id);
        builder.AddAttribute(seq++, "style", string.Join(";", renderer.GetStyles(block).Where(s => !s.IsNull())));
        builder.AddAttribute(seq++, "class", string.Join(" ", renderer.GetClasses(block).Where(c => !c.IsNull())));

        context?.BindingContext?.OpenBinding(block, component);

        renderer.RenderAttribute(ref seq, builder, block, context, component);
        renderer.RenderContent(ref seq, builder, block, context, component);

        context?.BindingContext?.CloseBinding(block);

        builder.CloseElement();

        if (!ignoreComponent)
            builder.CloseRegion();
    }

    private static bool NeedComponent(IBlock block)
    {
        return block.Bindings?.Any(b => b.Target.TargetType == UIPathType.Object) == true;
    }
}
