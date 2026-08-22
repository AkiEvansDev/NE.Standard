using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Web.Views;

/// <summary>
/// Carries the message of the failure that redirected here. A controller rather than a view that reads the
/// navigation itself: the message is the only thing that varies per request, and a bound property delivers it
/// without recompiling the view for every visitor.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class DefaultErrorController : UIControllerBase
{
    private const string DefaultMessage = "An unexpected error occurred.";

    [RecursiveMember]
    public partial string Message { get; set; } = DefaultMessage;

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Instance.Navigation.Parameters?.TryGetValue("message", out var value) == true
            && value is string message
            && !string.IsNullOrWhiteSpace(message))
        {
            Message = message;
        }

        return Task.CompletedTask;
    }
}
