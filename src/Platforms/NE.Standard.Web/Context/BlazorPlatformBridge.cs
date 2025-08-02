using Microsoft.JSInterop;
using NE.Standard.Design.Data;

namespace NE.Standard.Web.Context;

public class BlazorPlatformBridge(IJSRuntime js) : IPlatformBridge
{
    private readonly IJSRuntime _js = js;

    public async Task<bool> Set(IEnumerable<KeyValuePair<object?, string[]>> set)
    {
        return await _js.InvokeAsync<bool>("ne.set", set);
    }

    public async Task<bool> Call(string name, params object[]? parameters)
    {
        return await _js.InvokeAsync<bool>($"ne.{name}", parameters);
    }
}
