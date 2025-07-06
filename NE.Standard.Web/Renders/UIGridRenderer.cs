using Microsoft.AspNetCore.Components;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Models;
using NE.Standard.Extensions;
using NE.Standard.Web.Components;
using NE.Standard.Web.Renders.Binding;

namespace NE.Standard.Web.Renders;

internal class UIGridRenderer : UIElementRendererBase<UIGrid>
{
    public override string RootElement { get; } = "div";

    public override RenderFragment RenderContent(UIGrid el, IModel model, IDataBuilder data, ComponentBase context) => builder =>
    {
        foreach (var el in el.Elements)
        {
            if (el is UIPageRenderer)
            {
                builder.OpenComponent<PageHost>(2);
                builder.CloseComponent();
            }
            else
            {
                builder.AddContent(1, WebRendererRegistry.Render(el, model, data, context));
            }
        }
    };

    public override string GetStyle(UIGrid el)
    {
        var cols = string.Join(" ", el.Columns.Select(c => c.Star.HasValue ? $"{c.Star.Value}fr" : c.Absolute.HasValue ? $"{c.Absolute.Value}px" : "auto"));
        var rows = string.Join(" ", el.Rows.Select(r => r.Star.HasValue ? $"{r.Star.Value}fr" : r.Absolute.HasValue ? $"{r.Absolute.Value}px" : "auto"));

        if (cols.IsNull()) cols = "auto";
        if (rows.IsNull()) rows = "auto";

        return $"display:grid;grid-template-columns:{cols};grid-template-rows:{rows};";
    }
}
