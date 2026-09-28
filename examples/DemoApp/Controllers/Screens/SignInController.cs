using System;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Security;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// The door: anonymous by necessity, since a session that had to be signed in to reach the sign-in page could never get there.
/// A refused route arrives as <c>returnUrl</c>, and signing in ends in a navigation back to it — which is also what rotates the
/// session id.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class SignInController : UIControllerBase
{
    private const string DefaultReturnUrl = "/screens/account";
    private const string DefaultReasonLine = "Two staff accounts exist: robin, an admin, and mika, a viewer, each with its own password. Pick one below or type it.";

    private string _returnUrl = DefaultReturnUrl;

    [RecursiveMember]
    public partial string? UserName { get; set; }

    [RecursiveMember]
    public partial string? Password { get; set; }

    /// <summary>Why the door stayed shut, said on the password field.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? Notice { get; set; }

    /// <summary>What brought the visitor here, when a page did.</summary>
    [RecursiveMember]
    public partial string ReasonLine { get; set; } = DefaultReasonLine;

    /// <summary>Read on every attach, not once: a kept runtime is found again by a refusal that names another way back.</summary>
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        if (navigation.TryGetParameter("returnUrl", out var route) && UIRoutePath.IsLocal(route))
        {
            _returnUrl = route;
            ReasonLine = $"{route} needs a signed-in session. Sign in and you go back there.";
        }
        else
        {
            _returnUrl = DefaultReturnUrl;
            ReasonLine = DefaultReasonLine;
        }

        return Task.CompletedTask;
    }

    [UICommand]
    public async Task<UICommandResult> SignInAsync(CancellationToken cancellationToken)
    {
        DemoAccount? account = DemoAccounts.Find(UserName, Password);

        Password = null;

        if (account is null)
        {
            Notice = UIValidationMessage.Error("Unknown user name or password.");
            return UICommandResult.Ok();
        }

        Notice = null;
        await Context.SignInAsync(account.UserName, account.Roles, account.Permissions, cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = _returnUrl })]);
    }

    [UICommand]
    public void UseAdmin()
        => Fill("robin");

    [UICommand]
    public void UseViewer()
        => Fill("mika");

    private void Fill(string userName)
    {
        UserName = userName;
        Password = userName;
        Notice = null;
    }
}
