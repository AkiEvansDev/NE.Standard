using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Web.Context;
using NE.Standard.Web.Renderer;

namespace NE.Standard.Web.Components;

public sealed class AppHost : BlockWrapper
{
    [Inject] public NavigationManager Navigation { get; set; } = default!;
    [Inject] public JsInteropHandler JsHandler { get; set; } = default!;
    [Inject] public INEApp App { get; set; } = default!;
    [Inject] public ISessionContextProvider ContextProvider { get; set; } = default!;

    private string? _uri;
    private string? _query;
    private NENavigateResult? _result;

    private DotNetObjectReference<JsInteropHandler>? _jsRef;

    protected override async Task OnParametersSetAsync()
    {
        var link = new Uri(Navigation.Uri);
        _uri = link.AbsolutePath == "/" ? App.DefaultUri : link.AbsolutePath;
        _query = link.Query;

        _result = await App.NavigateAsync<BlazorPlatformBinding>(_uri, _query, ContextProvider, SyncMode.Debounced);
#if DEBUG
        _result?.Context?.Logger.LogDebug("Navigate: `{Uri}{Query}` => {Result}", _uri, _query, _result?.Success);
#endif     
        if (_result?.Success == true && _result.Context != null && _result.Context.View?.Area != null)
        {
            Context = _result.Context;
            Id = Context.View.Area.Id;
            Refresh();
        }
    }

    protected override bool ShouldRender()
    {
        return _uri != Context?.Uri || _query != Context?.Query;
    }

    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        int seq = 0;
        if (_result?.Success == true && Context != null && Context.View?.Area != null)
        {
            WebRendererRegistry.Render(ref seq, builder, Context.View.Area, Context, this);
        }
        else
        {
            WebRendererRegistry.Render(ref seq, builder, new LabelBlock
            {
                Label = "Error while navigation...",
                Description = _result?.Error,
                HorizontalAlignment = Alignment.Center,
                VerticalAlignment = Alignment.Center,
            }, null, this, true);
        }
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            _jsRef = DotNetObjectReference.Create(JsHandler);

            var callTask = Context.Bridge?.Call("initInterop", _jsRef);
            if (callTask != null && (await callTask) == false)
            {
                Context.Logger.LogWarning("Client `initInterop` return false.");
            }
        }

        await base.OnAfterRenderAsync(firstRender);
    }

    public override void Dispose()
    {
        _jsRef?.Dispose();
        base.Dispose();
    }
}
