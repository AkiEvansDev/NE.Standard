using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using DemoApp.Security;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Security;

internal sealed partial class SignInGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string UserName { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Password { get; set; } = string.Empty;

    /// <summary>
    /// Where to go once signed in — the route that refused the request, or the account page when the user came
    /// to the sign-in page on their own.
    /// </summary>
    public string ReturnUrl { get; set; } = SecurityRoutes.Account;

    public void ReportRefusedRoute(string route)
        => Message = $"'{route}' refused the current session — sign in to continue.";

    public void ReportFailure()
        => LogEvent("Unknown user name or password.");

    public void ReportSuccess(string userName)
        => LogEvent($"Signed in as '{userName}'.");
}

/// <summary>
/// The sign-in page. Anonymous by necessity: a session that has to be authenticated to reach the sign-in page
/// can never get one.
/// </summary>
[UIAllowAnonymous]
internal sealed partial class SignInController() : DemoController
{
    [RecursiveMember]
    public partial SignInGroupContext SignInGroup { get; set; } = new();

    /// <summary>
    /// Picks up the <c>returnUrl</c> the host attaches when a route refuses the session, so signing in lands
    /// back on the page that was asked for rather than on a fixed one.
    /// </summary>
    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Instance.Navigation.Parameters?.TryGetValue("returnUrl", out var value) == true
            && value is string route
            && !string.IsNullOrWhiteSpace(route))
        {
            SignInGroup.ReturnUrl = route;
            SignInGroup.ReportRefusedRoute(route);
        }

        return Task.CompletedTask;
    }

    [UICommand]
    public async Task<UICommandResult> SignInAsync(CancellationToken cancellationToken)
    {
        DemoAccount? account = DemoAccounts.Find(SignInGroup.UserName, SignInGroup.Password);

        if (account is null)
        {
            SignInGroup.ReportFailure();

            return UICommandResult.Ok([new ShowNotificationEffect("Unknown user name or password.", UIColorStyle.Danger)]);
        }

        await Context.SignInAsync(account.UserName, account.Roles, account.Permissions, cancellationToken).ConfigureAwait(false);

        SignInGroup.ReportSuccess(account.UserName);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = SignInGroup.ReturnUrl })]);
    }

    [UICommand]
    public void UseAdminAccount()
        => FillCredentials("admin", "admin");

    private void FillCredentials(string userName, string password)
    {
        SignInGroup.UserName = userName;
        SignInGroup.Password = password;
        SignInGroup.Message = $"Filled in '{userName}'. Press Sign in.";
    }

    [UICommand]
    public void UseMemberAccount()
        => FillCredentials("member", "member");
}
