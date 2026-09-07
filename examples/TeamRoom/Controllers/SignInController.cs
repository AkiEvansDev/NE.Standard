using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>
/// The one anonymous page: where a session gains an identity. Sign-in ends in a navigation, which is what rotates the session id.
/// </summary>
[UIAllowAnonymous]
public sealed partial class SignInController(AccountService accounts) : UIControllerBase
{
    private string _returnUrl = AppRoutes.Files;

    [RecursiveMember]
    public partial string Login { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Password { get; set; } = string.Empty;

    /// <summary>Why the door stayed shut, said on the password field.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? Notice { get; set; }

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        UINavigationRequest navigation = Context.Handle.Instance.Navigation;

        if (navigation.TryGetParameter("returnUrl", out var route) && route.StartsWith('/'))
            _returnUrl = route;

        if (navigation.TryGetParameter("reason", out var reason) && reason == "blocked")
            Notice = UIValidationMessage.Error("This account is no longer allowed in.");

        return Task.CompletedTask;
    }

    [UICommand]
    public async Task<UICommandResult> SignInAsync(CancellationToken cancellationToken)
    {
        AccountRecord? account = accounts.Verify(Login, Password);

        Password = string.Empty;

        if (account is null)
        {
            Notice = UIValidationMessage.Error("Unknown login or password.");

            return UICommandResult.Ok();
        }

        Notice = null;

        await Context.SignInAsync(account.Id, new System.Collections.Generic.HashSet<string> { account.Role }, cancellationToken: cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = _returnUrl })]);
    }
}
