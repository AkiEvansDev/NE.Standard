using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
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
        ShowMessageOf(Context.Handle.Instance.Navigation);
        return Task.CompletedTask;
    }

    // A later failure in the same tab finds this runtime again, and only this hook hears the navigation it arrived with.
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ShowMessageOf(navigation);
        return Task.CompletedTask;
    }

    private void ShowMessageOf(UINavigationRequest navigation)
        => Message = navigation.Parameters?.TryGetValue("message", out var value) == true && value is string message && !string.IsNullOrWhiteSpace(message)
            ? message
            : DefaultMessage;
}
