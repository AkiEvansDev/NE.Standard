using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI.Common;
using NE.Standard.Extensions;

namespace NE.Standard.Web.Renders;

public interface IBlockRenderer<T>
    where T : IBlock
{
    string RootElement { get; }

    RenderFragment Render(T el, IInternalModel model, ComponentBase context);
    void RenderAttribute(RenderTreeBuilder builder, T el, IInternalModel model, ComponentBase context);

    string GetClass(T el);
    string GetStyle(T el);

    void SetBinding(T el, IInternalModel model, BlockBinding binding);
    void SetInteraction(T el, BlockInteraction interaction);
    void SetValidation(T el, BlockValidation validation);
}

public abstract class BlockRendererBase<T> : IBlockRenderer<T>
    where T : IBlock
{
    public abstract string RootElement { get; }
    public abstract RenderFragment RenderContent(T el, IInternalModel model, ComponentBase context);

    public RenderFragment Render(T el, IInternalModel model, ComponentBase context) => builder =>
    {
        RenderUtils.Render(this, builder, el, model, context, RenderContent(el, model, context));
    };

    public virtual void RenderAttribute(RenderTreeBuilder builder, T el, IInternalModel model, ComponentBase context) { }

    public virtual string GetClass(T el) => "";
    public virtual string GetStyle(T el) => "";

    public virtual void SetBinding(T el, IInternalModel model, BlockBinding binding) { }
    public virtual void SetInteraction(T el, BlockInteraction interaction) { }
    public virtual void SetValidation(T el, BlockValidation validation) { }
}

public static class RenderUtils
{
    public static void Render<T>(
        IBlockRenderer<T> renderer, 
        RenderTreeBuilder builder, 
        T el, 
        IInternalModel model, 
        ComponentBase context, 
        RenderFragment? childContent
    ) where T : IBlock
    {
        SetDefaultBinding(renderer, el, model);

        int seq = 0;
        builder.OpenElement(seq++, renderer.RootElement);

        if (!el.Id.IsNull())
            builder.AddAttribute(seq++, "id", el.Id);

        builder.AddAttribute(seq++, "class", GetDefaultClass(renderer, el));
        builder.AddAttribute(seq++, "style", GetDefaultStyle(renderer, el));

        renderer.RenderAttribute(builder, el, model, context);

        if (childContent != null)
            builder.AddContent(4, childContent);

        builder.CloseElement();
    }

    private static void SetDefaultBinding<T>(IBlockRenderer<T> renderer, T el, IInternalModel model)
        where T : IBlock
    {
        if (el.Bindings == null)
            return;

    }

    private static string GetDefaultClass<T>(IBlockRenderer<T> renderer, T el)
        where T : IBlock
    {
        List<string> classes = [el.GetType().Name, renderer.GetClass(el)];

        if (!el.Visible) classes.Add("hide");
        if (!el.Enabled) classes.Add("disabled");

        classes.Add(el.HorizontalAlignment switch
        {
            Alignment.Start => "justify-start",
            Alignment.Center => "justify-center",
            Alignment.End => "justify-end",
            Alignment.Stretch => "justify-stretch",
            _ => ""
        });

        classes.Add(el.VerticalAlignment switch
        {
            Alignment.Start => "align-start",
            Alignment.Center => "align-center",
            Alignment.End => "align-end",
            Alignment.Stretch => "align-stretch",
            _ => ""
        });

        return string.Join(" ", classes.Where(c => !c.IsNull()));
    }

    private static string GetDefaultStyle<T>(IBlockRenderer<T> renderer, T el)
        where T : IBlock
    {
        List<string> styles = [renderer.GetStyle(el)];

        //if (el.Desktop is { } placement)
        //{
        //    var colStart = placement.Column + 1;
        //    var colEnd = colStart + placement.ColumnSpan;
        //    var rowStart = placement.Row + 1;
        //    var rowEnd = rowStart + placement.RowSpan;

        //    styles.Add($"grid-column:{colStart}/{colEnd}");
        //    styles.Add($"grid-row:{rowStart}/{rowEnd}");
        //}

        return string.Join(";", styles.Where(s => !s.IsNull()));
    }
}
