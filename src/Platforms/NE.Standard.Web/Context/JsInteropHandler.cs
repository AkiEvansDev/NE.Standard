using Microsoft.JSInterop;
using NE.Standard.Design.Data;

namespace NE.Standard.Web.Context;

public class JsInteropHandler(ISessionContextProvider contextProvider)
{
    private readonly ISessionContextProvider _contextProvider = contextProvider;

    [JSInvokable("HandleAction")]
    public async Task<INEActionResult> HandleAction(string action, object[] parameters)
    {
        var context = _contextProvider.GetCurrentSessionContext();

        if (context?.Model != null)
            return await context.Model.Execute(action, parameters);

        return new NEActionResult { Error = $"Context not found." };
    }
}
