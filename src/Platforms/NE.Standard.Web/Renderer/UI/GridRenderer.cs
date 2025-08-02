using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Design.Common;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Web.Components;

namespace NE.Standard.Web.Renderer.UI;

public sealed class GridRenderer : BlockRendererBase<GridArea>
{
    public override void RenderContent(ref int seq, RenderTreeBuilder builder, GridArea block, ISessionContext? context, BlockWrapper component)
    {
        foreach (var child in block.Blocks)
        {
            WebRendererRegistry.Render(ref seq, builder, child, context, component);
        }
    }

    public override List<string> GetStyles(GridArea block)
    {
        var styles = base.GetStyles(block);

        if (block.Columns?.Count > 0)
        {
            var columns = string.Join(" ", block.Columns.Select(ToCssUnit));
            styles.Add($"grid-template-columns:{columns}");
        }

        if (block.Rows?.Count > 0)
        {
            var rows = string.Join(" ", block.Rows.Select(ToCssUnit));
            styles.Add($"grid-template-rows:{rows}");
        }

        return styles;
    }

    private static string ToCssUnit(GridUnit unit)
    {
        return unit.Unit switch
        {
            UnitType.Absolute => $"{unit.Value}px",
            UnitType.Star => $"{unit.Value}fr",
            _ => throw new NotImplementedException()
        };
    }
}
