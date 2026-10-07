using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Views;

/// <summary>
/// Shows the application's <c>ErrorPageMessage</c>, or the failure's own message where <c>IncludeExceptionDetail</c> is on.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class DefaultErrorController : UIControllerBase
{
    private readonly UIErrorHandlingOptions _errors;

    public DefaultErrorController(UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _errors = application.ErrorHandling;
        Message = _errors.ErrorPageMessage;
    }

    // Bound to a translatable description, so a word key is translated by the page, in the reader's language.
    [RecursiveMember]
    public partial string Message { get; set; }

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

    // The page is open to anyone at its own address, so a free-text message in the query would be shown on the application's origin.
    private void ShowMessageOf(UINavigationRequest navigation)
        => Message = _errors.IncludeExceptionDetail && navigation.Parameters?.TryGetValue("message", out var value) == true && value is string message && !string.IsNullOrWhiteSpace(message)
            ? message
            : _errors.ErrorPageMessage;
}
