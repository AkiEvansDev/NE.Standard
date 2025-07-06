using Microsoft.JSInterop;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Models;

namespace NE.Standard.Web;

internal class BlazorClientBridge(IJSRuntime js) : IClientBridge
{
    private readonly IJSRuntime _js = js;

    public async Task<bool> SyncToClient(List<UpdateProperty> updates)
    {
        return await _js.InvokeAsync<bool>("designInterop.receiveUpdates", updates);
    }

    public async Task<bool> ShowDialog(string id)
    {
        return await _js.InvokeAsync<bool>("designInterop.showDialog", id);
    }

    public async Task<bool> ShowNotification(UINotification notification)
    {
        return await _js.InvokeAsync<bool>("designInterop.showNotification", notification);
    }
}
