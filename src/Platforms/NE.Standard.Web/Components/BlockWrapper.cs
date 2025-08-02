using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.Extensions.Logging;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Web.Renderer;

namespace NE.Standard.Web.Components;

public class BlockWrapper : ComponentBase, IPlatformRefresh, IDisposable
{
    private bool _updateJS;

    [Parameter] public string Id { get; set; } = default!;
    [Parameter] public ISessionContext Context { get; set; } = default!;

    public void Refresh()
    {
        _updateJS = true;
        StateHasChanged();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_updateJS)
        {
            _updateJS = false;

            var callTask = Context.Bridge?.Call("updateEvents", Id);
            if (callTask != null && (await callTask) == false)
            {
                Context.Logger.LogWarning("Client `updateEvents` return false.");
            }
        }
    }

    public virtual void Dispose() 
    {
        GC.SuppressFinalize(this);
    }
}

public class BlockWrapper<TBlock, TRenderer> : BlockWrapper
    where TBlock : class, IBlock
    where TRenderer : class, IBlockRenderer<TBlock>
{
    [Parameter] public string Key { get; set; } = default!;
    [Parameter] public TBlock Block { get; set; } = default!;
    [Parameter] public TRenderer Renderer { get; set; } = default!;

    protected override bool ShouldRender()
    {
        return Key != Context.BindingContext?.GetKey(Block);
    }

    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        int seq = 0;
        Renderer.Render(ref seq, builder, Block, Context, this, true);
    }
}
