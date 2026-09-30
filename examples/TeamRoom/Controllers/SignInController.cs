using System;
using System.Threading;
using System.Threading.Tasks;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>
/// The one anonymous page: where a session gains an identity. Sign-in ends in a navigation, which is what rotates the session id.
/// </summary>
[UIAllowAnonymous]
public sealed partial class SignInController(AccountService accounts, QuickSignIn quickSignIn) : UIControllerBase
{
    private string _returnUrl = AppRoutes.Files;

    [RecursiveMember]
    public partial string Login { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Password { get; set; } = string.Empty;

    /// <summary>Whether the page offers the demo's test accounts, a button each.</summary>
    [RecursiveMember]
    public partial UIVisibility QuickSignInVisibility { get; set; } = UIVisibility.Collapsed;

    /// <summary>Why the door stayed shut, said on the password field.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? Notice { get; set; }

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        QuickSignInVisibility = quickSignIn.Enabled ? UIVisibility.Visible : UIVisibility.Collapsed;

        return Task.CompletedTask;
    }

    /// <summary>Read on every attach, not once: a kept runtime is found again by a refusal that names another way back.</summary>
    protected override Task OnAttachedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(navigation);

        _returnUrl = navigation.TryGetParameter("returnUrl", out var route) && UIRoutePath.IsLocal(route) ? route : AppRoutes.Files;

        if (navigation.TryGetParameter("reason", out var reason) && reason == "blocked")
            Notice = UIValidationMessage.Error("This account is no longer allowed in.");

        return Task.CompletedTask;
    }

    [UICommand]
    public async Task<UICommandResult> SignInAsync(CancellationToken cancellationToken)
    {
        AccountRecord? account = accounts.Verify(Login, Password, out var throttled);

        Password = string.Empty;

        if (account is null)
        {
            Notice = UIValidationMessage.Error(throttled ? AccountService.TooManyAttempts : "Unknown login or password.");

            return UICommandResult.Ok();
        }

        return await EnterAsync(account, cancellationToken).ConfigureAwait(false);
    }

    private async Task<UICommandResult> EnterAsync(AccountRecord account, CancellationToken cancellationToken)
    {
        Notice = null;

        await Context.SignInAsync(account.Id, new System.Collections.Generic.HashSet<string> { account.Role }, cancellationToken: cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = _returnUrl })]);
    }

    /// <summary>
    /// A test account entered without its password — refused outright unless the host turned the shortcut on, and for any login
    /// the shortcut does not offer: the login comes from the page, and would otherwise open any account by its name alone.
    /// </summary>
    [UICommand]
    public async Task<UICommandResult> QuickSignInAsync(string login, CancellationToken cancellationToken)
    {
        if (!quickSignIn.Enabled)
            return UICommandResult.Fail("Quick sign-in is off.");

        if (!QuickSignIn.Offers(login))
            return UICommandResult.Fail("That is no test account.");

        AccountRecord? account = accounts.FindByLogin(login);

        if (account is not { IsBlocked: false })
        {
            Notice = UIValidationMessage.Error("That test account is missing or blocked.");

            return UICommandResult.Ok();
        }

        return await EnterAsync(account, cancellationToken).ConfigureAwait(false);
    }
}
