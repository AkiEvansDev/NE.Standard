using System.Threading;
using System.Threading.Tasks;
using DemoApp.Security;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Screens;

/// <summary>
/// The door: anonymous by necessity, since a session that had to be signed in to reach the sign-in page could never get there.
/// A refused route arrives as <c>returnUrl</c>, and signing in ends in a navigation back to it — which is also what rotates the
/// session id.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class SignInController : UIControllerBase
{
    private string _returnUrl = "/screens/account";

    [RecursiveMember]
    public partial string? UserName { get; set; }

    [RecursiveMember]
    public partial string? Password { get; set; }

    /// <summary>Why the door stayed shut, said on the password field.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? Notice { get; set; }

    /// <summary>What brought the visitor here, when a page did.</summary>
    [RecursiveMember]
    public partial string ReasonLine { get; set; } = "Two accounts exist: admin and member, each with its own password. Pick one below or type it.";

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Instance.Navigation.TryGetParameter("returnUrl", out var route) && route.StartsWith('/'))
        {
            _returnUrl = route;
            ReasonLine = $"{route} needs a signed-in session. Sign in and you go back there.";
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
        => Fill("admin");

    [UICommand]
    public void UseMember()
        => Fill("member");

    private void Fill(string userName)
    {
        UserName = userName;
        Password = userName;
        Notice = null;
    }
}
