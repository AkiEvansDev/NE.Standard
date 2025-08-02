using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Web.Components;

namespace NE.Standard.Web.Renderer.UI;

public sealed class LabelRenderer : BlockRendererBase<LabelBlock>
{
    public override void RenderContent(ref int seq, RenderTreeBuilder builder, LabelBlock block, ISessionContext? context, BlockWrapper component)
    {
        builder.OpenElement(seq++, "h2");
        builder.AddAttribute(seq++, "id", $"{block.Id}_{LabelBlock.LabelProperty}");
        builder.AddContent(seq++, GetBindingValue(block, context, LabelBlock.LabelProperty, block.Label));
        builder.CloseElement();

        builder.OpenElement(seq++, "h6");
        builder.AddAttribute(seq++, "id", $"{block.Id}_{LabelBlock.DescriptionProperty}");
        builder.AddContent(seq++, GetBindingValue(block, context, LabelBlock.DescriptionProperty, block.Description));
        builder.CloseElement();
    }
}
