using Microsoft.AspNetCore.Components;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;
using System.Linq;

namespace NE.Standard.Web;

public static class WebDefaultRenderers
{
    static WebDefaultRenderers()
    {
        WebRendererRegistry.RegisterRenderer<UIGrid>(RenderGrid);
        WebRendererRegistry.RegisterRenderer<UIStackPanel>(RenderStack);
        WebRendererRegistry.RegisterRenderer<UILabel>(RenderLabel);
        WebRendererRegistry.RegisterRenderer<UIButton>(RenderButton);
        WebRendererRegistry.RegisterRenderer<UICard>(RenderCard);
    }

    public static void Init() { }

    private static RenderFragment RenderGrid(UIGrid grid, UIStyleConfig style) => builder =>
    {
        builder.OpenElement(0, "div");
        var cols = string.Join(" ", grid.Columns.Select(c => c.Star.HasValue ? $"{c.Star.Value}fr" : c.Absolute.HasValue ? $"{c.Absolute.Value}px" : "auto"));
        var rows = string.Join(" ", grid.Rows.Select(r => r.Star.HasValue ? $"{r.Star.Value}fr" : r.Absolute.HasValue ? $"{r.Absolute.Value}px" : "auto"));
        builder.AddAttribute(1, "style", $"display:grid;grid-template-columns:{cols};grid-template-rows:{rows};gap:4px;");
        int seq = 2;
        foreach (var el in grid.Elements)
        {
            builder.AddContent(seq++, WebRendererRegistry.Render(el, style));
        }
        builder.CloseElement();
    };

    private static RenderFragment RenderStack(UIStackPanel stack, UIStyleConfig style) => builder =>
    {
        builder.OpenElement(0, "div");
        var dir = stack.Orientation == StackOrientation.Horizontal ? "row" : "column";
        builder.AddAttribute(1, "style", $"display:flex;flex-direction:{dir};gap:{stack.Spacing}px;");
        int seq = 2;
        foreach (var el in stack.Elements)
        {
            builder.AddContent(seq++, WebRendererRegistry.Render(el, style));
        }
        builder.CloseElement();
    };

    private static RenderFragment RenderLabel(UILabel label, UIStyleConfig style) => builder =>
    {
        builder.OpenElement(0, "div");
        if (label.Label != null)
            builder.AddContent(1, label.Label);
        if (label.Description != null)
        {
            builder.OpenElement(2, "div");
            builder.AddAttribute(3, "class", "description");
            builder.AddContent(4, label.Description);
            builder.CloseElement();
        }
        builder.CloseElement();
    };

    private static RenderFragment RenderButton(UIButton button, UIStyleConfig style) => builder =>
    {
        builder.OpenElement(0, "button");
        builder.AddContent(1, button.Label);
        builder.CloseElement();
    };

    private static RenderFragment RenderCard(UICard card, UIStyleConfig style) => builder =>
    {
        builder.OpenElement(0, "div");
        builder.AddAttribute(1, "class", "card");
        if (card.Content != null)
            builder.AddContent(2, WebRendererRegistry.Render(card.Content, style));
        builder.CloseElement();
    };

}
