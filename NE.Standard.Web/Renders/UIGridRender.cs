using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Extensions;

namespace NE.Standard.Web.Renders;

internal class UIGridRender
{
    public static RenderFragment Render(UIGrid grid, UIPageResult page) => builder =>
    {
        var cols = string.Join(" ", grid.Columns.Select(c => c.Star.HasValue ? $"{c.Star.Value}fr" : c.Absolute.HasValue ? $"{c.Absolute.Value}px" : "auto"));
        var rows = string.Join(" ", grid.Rows.Select(r => r.Star.HasValue ? $"{r.Star.Value}fr" : r.Absolute.HasValue ? $"{r.Absolute.Value}px" : "auto"));

        if (cols.IsNull()) cols = "auto";
        if (rows.IsNull()) rows = "auto";

        builder.OpenElement(0, "div");
        if (!grid.Id.IsNull())
            builder.AddAttribute(1, "id", grid.Id);
        builder.AddAttribute(2, "class", "UIGrid");
        builder.AddAttribute(3, "style", $"{CssGenerator.GetDefaultStyle(grid)}display:grid;grid-template-columns:{cols};grid-template-rows:{rows};");

        foreach (var el in grid.Elements)
        {
            if (el is UIPageRenderer && page.Page?.Content != null)
            {
                builder.OpenElement(5, "div");
                builder.AddAttribute(6, "class", "root");
                builder.AddAttribute(7, "style", CssGenerator.GetDefaultStyle(el));
                builder.AddContent(8, WebRendererRegistry.Render(page.Page.Content, page));
                builder.CloseElement();
            }
            else
            {
                builder.AddContent(4, WebRendererRegistry.Render(el, page));
            }
        }

        builder.CloseElement();
    };
}
