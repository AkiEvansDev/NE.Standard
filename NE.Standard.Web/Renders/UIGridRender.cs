using Microsoft.AspNetCore.Components;
using NE.Standard.Extensions;
using NE.Standard.Design;
using NE.Standard.Design.Elements;

namespace NE.Standard.Web.Renders;

internal class UIGridRender
{
    public static RenderFragment Render(UIGrid grid, UIPageResult page, BindingContext context, AppHost host) => builder =>
    {
        var cols = string.Join(" ", grid.Columns.Select(c => c.Star.HasValue ? $"{c.Star.Value}fr" : c.Absolute.HasValue ? $"{c.Absolute.Value}px" : "auto"));
        var rows = string.Join(" ", grid.Rows.Select(r => r.Star.HasValue ? $"{r.Star.Value}fr" : r.Absolute.HasValue ? $"{r.Absolute.Value}px" : "auto"));

        if (cols.IsNull()) cols = "auto";
        if (rows.IsNull()) rows = "auto";

        builder.OpenElement(0, "div");
        if (!grid.Id.IsNull())
            builder.AddAttribute(1, "id", grid.Id);
        builder.AddAttribute(1, "class", "UIGrid");
        builder.AddAttribute(1, "style", $"{CssGenerator.GetDefaultStyle(grid)}display:grid;grid-template-columns:{cols};grid-template-rows:{rows};");

        foreach (var el in grid.Elements)
        {
            if (el is UIPageRenderer && page.Page?.Content != null)
            {
                builder.OpenElement(3, "div");
                builder.AddAttribute(4, "class", "root");
                builder.AddAttribute(4, "style", CssGenerator.GetDefaultStyle(el));
                builder.AddContent(5, WebRendererRegistry.Render(page.Page.Content, page, context, host));
                builder.CloseElement();
            }
            else
            {
                builder.AddContent(2, WebRendererRegistry.Render(el, page, context, host));
            }
        }

        builder.CloseElement();
    };
}
