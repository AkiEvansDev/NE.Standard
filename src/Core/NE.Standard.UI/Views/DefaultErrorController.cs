using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Views;

/// <summary>
/// Carries the message of the failure that redirected here.
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
