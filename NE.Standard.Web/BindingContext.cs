using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using NE.Standard.Design.Models;

namespace NE.Standard.Web;

public class BindingContext(IJSRuntime jsRuntime)
{
    private class BindingRegistration
    {
        public ElementReference Element { get; set; }
        public string TargetProperty { get; set; } = default!;
    }

    private readonly IJSRuntime _jsRuntime = jsRuntime;
    private readonly Dictionary<string, List<BindingRegistration>> _bindings = [];

    public void RegisterBinding(string property, ElementReference element, string targetProperty)
    {
        if (!_bindings.ContainsKey(property))
            _bindings[property] = [];

        _bindings[property].Add(new BindingRegistration
        {
            Element = element,
            TargetProperty = targetProperty
        });
    }

    public async Task ApplyUpdateAsync(UpdateProperty update)
    {
        if (!_bindings.TryGetValue(update.Property, out var regs)) return;

        foreach (var reg in regs)
        {
            await _jsRuntime.InvokeVoidAsync("BindingHelper.updateElementProperty", reg.Element, reg.TargetProperty, update.Value);
        }
    }

    public void Clear()
    {
        _bindings.Clear();
    }
}
