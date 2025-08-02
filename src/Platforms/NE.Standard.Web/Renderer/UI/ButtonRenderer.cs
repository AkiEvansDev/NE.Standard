using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using NE.Standard.Extensions;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Web.Components;

namespace NE.Standard.Web.Renderer.UI;

public sealed class ButtonRenderer : BlockRendererBase<ButtonBlock>
{
    public override string RootElement { get; } = "button";

    public override void RenderContent(ref int seq, RenderTreeBuilder builder, ButtonBlock block, ISessionContext? context, BlockWrapper component)
    {
        builder.AddContent(seq++, GetBindingValue(block, context, ButtonBlock.LabelProperty, block.Label));
    }

    public override void RenderAttribute(ref int seq, RenderTreeBuilder builder, ButtonBlock block, ISessionContext? context, BlockWrapper component)
    {
        builder.AddAttribute(seq++, "data-action", block.Action);
        builder.AddAttribute(seq++, "data-params", block.Parameters?.SerializeJson());
    }
}
