using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Extensions;

namespace NE.Standard.Web;

public static class WebDefaultRenderers
{
    static WebDefaultRenderers()
    {
        WebRendererRegistry.RegisterRenderer<UIGrid>(RenderGrid);
        WebRendererRegistry.RegisterRenderer<UILabel>(RenderLabel);
    }

    public static void Init() { }

    private static RenderFragment RenderGrid(UIGrid grid, UIPageResult page) => builder =>
    {
        var cols = string.Join(" ", grid.Columns.Select(c => c.Star.HasValue ? $"{c.Star.Value}fr" : c.Absolute.HasValue ? $"{c.Absolute.Value}px" : "auto"));
        var rows = string.Join(" ", grid.Rows.Select(r => r.Star.HasValue ? $"{r.Star.Value}fr" : r.Absolute.HasValue ? $"{r.Absolute.Value}px" : "auto"));

        if (cols.IsNull()) cols = "auto";
        if (rows.IsNull()) rows = "auto";

        builder.OpenElement(0, "div");
        builder.AddAttribute(1, "class", "UIGrid");
        builder.AddAttribute(1, "style", $"{CssGenerator.GetDefaultStyle(grid)}display:grid;grid-template-columns:{cols};grid-template-rows:{rows};");

        foreach (var el in grid.Elements)
        {
            if (el is UIPageRenderer && page.Page?.Content != null)
            {
                builder.OpenElement(3, "div");
                builder.AddAttribute(4, "class", "root");
                builder.AddAttribute(4, "style", CssGenerator.GetDefaultStyle(el));
                builder.AddContent(5, WebRendererRegistry.Render(page.Page.Content, page));
                builder.CloseElement();
            }
            else
            {
                builder.AddContent(2, WebRendererRegistry.Render(el, page));
            }
        }

        builder.CloseElement();
    };

    private static RenderFragment RenderLabel(UILabel label, UIPageResult page) => builder =>
    {
        builder.OpenElement(0, "div");
        builder.AddAttribute(1, "class", "UILabel");
        builder.AddAttribute(1, "style", CssGenerator.GetDefaultStyle(label));
        if (label.Label != null)
        {
            builder.OpenElement(2, "h3");
            builder.AddContent(3, label.Description);
            builder.CloseElement();
        }
        if (label.Description != null)
        {
            builder.OpenElement(4, "p");
            builder.AddContent(5, label.Description);
            builder.CloseElement();
        }
        builder.CloseElement();
    };
}
