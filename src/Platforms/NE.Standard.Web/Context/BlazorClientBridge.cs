using Microsoft.JSInterop;
using NE.Standard.Design.Data;

namespace NE.Standard.Web.Context;

internal class BlazorClientBridge(IJSRuntime js) : IClientBridge
{
    private readonly IJSRuntime _js = js;

    public async Task<bool> UpdateUI(List<UIUpdate> updates)
    {
        return await _js.InvokeAsync<bool>("ne.updateUI", updates);
    }

    public async Task<bool> ShowDialog(string id)
    {
        return await _js.InvokeAsync<bool>("ne.showDialog", id);
    }

    public async Task<bool> ShowNotification(UINotification notification)
    {
        return await _js.InvokeAsync<bool>("ne.showNotification", notification);
    }
}
